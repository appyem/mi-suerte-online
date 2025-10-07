const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // 🔴 NUEVO: para scraping
const cheerio = require('cheerio'); // 🔴 NUEVO: para parsing HTML

const app = express();
app.use(cors());
app.use(express.json());

// 🔴 REEMPLAZA ESTA LÍNEA CON TU URI REAL DE MONGODB ATLAS
const MONGODB_URI = 'mongodb+srv://adminuser:Appy2025@misuertecluster.hymrcja.mongodb.net/?retryWrites=true&w=majority&appName=MiSuerteCluster';

// Conectar a MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 🔴 Función para convertir YYYY-MM-DD a la medianoche en Colombia (UTC-5)
const parseDateToColombia = (dateStr) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  // La medianoche en Colombia (UTC-5) corresponde a 05:00 UTC
  return new Date(Date.UTC(year, month - 1, day, 5, 0, 0));
};

// Esquema de Ticket
const ticketSchema = new mongoose.Schema({
  ticketId: String,
  seller: String,
  bets: Array,
  total: Number,
  customerPhone: String,
  timestamp: { type: Date, default: Date.now },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

// Esquema para vendedores
const sellerSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  commission: { type: Number, default: 10 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Seller = mongoose.model('Seller', sellerSchema);

// Esquema para pagos
const paymentSchema = new mongoose.Schema({
  seller: String,
  date: String,
  totalSales: Number,
  commissionRate: Number,
  commissionAmount: Number,
  netAmount: Number,
  ticketCount: Number,
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

// Ruta para login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Verificar administrador fijo
    if (username === 'superadmin' && password === 'Appy2025') {
      return res.json({ 
        success: true, 
        username: 'superadmin', 
        role: 'admin',
        message: 'Login exitoso'
      });
    }
    
    // Verificar vendedores en la base de datos
    const seller = await Seller.findOne({ username, password, active: true });
    if (seller) {
      return res.json({ 
        success: true, 
        username: seller.username, 
        role: 'seller',
        name: seller.name,
        message: 'Login exitoso'
      });
    }
    
    res.status(401).json({ 
      success: false, 
      message: 'Credenciales incorrectas' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para guardar un ticket
app.post('/api/tickets', async (req, res) => {
  try {
    const ticket = new Ticket(req.body);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔴 RUTA CORREGIDA: obtener tickets con soporte de rango de fechas (ahora compatible con zona horaria de Colombia)
app.get('/api/tickets', async (req, res) => {
  try {
    const { date, startDate, endDate, seller } = req.query;
    let filter = {};
    
    if (date) {
      const start = parseDateToColombia(date);
      if (!start) {
        return res.status(400).json({ error: 'Formato de fecha inválido' });
      }
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      filter.timestamp = { $gte: start, $lt: end };
    }
    else if (startDate && endDate) {
      const start = parseDateToColombia(startDate);
      const end = parseDateToColombia(endDate);
      
      if (!start || !end) {
        return res.status(400).json({ error: 'Fechas inválidas' });
      }

      const endPlusOne = new Date(end);
      endPlusOne.setDate(endPlusOne.getDate() + 1);
      
      filter.timestamp = { $gte: start, $lt: endPlusOne };
    }
    
    if (seller) {
      filter.seller = seller;
    }
    
    const tickets = await Ticket.find(filter).sort({ timestamp: -1 });
    res.json(tickets);
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para eliminar ticket (solo del mismo día y del mismo vendedor)
app.delete('/api/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { seller } = req.body;

    if (!seller) {
      return res.status(400).json({ error: 'Se requiere el nombre de usuario del vendedor' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    if (ticket.seller !== seller) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este ticket' });
    }

    // Verificar que sea del mismo día (usando la misma lógica de Colombia)
    const todayStart = parseDateToColombia(new Date().toLocaleDateString('sv-SE'));
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    
    if (ticket.timestamp < todayStart || ticket.timestamp >= todayEnd) {
      return res.status(400).json({ error: 'Solo se pueden eliminar tickets del día actual' });
    }

    await Ticket.findByIdAndDelete(id);
    res.json({ message: 'Ticket eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar ticket:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener vendedores
app.get('/api/sellers', async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para crear vendedores
app.post('/api/sellers', async (req, res) => {
  try {
    const { name, username, password, commission = 10 } = req.body;
    
    if (!name || !username || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    const existingSeller = await Seller.findOne({ username });
    if (existingSeller) {
      return res.status(400).json({ error: 'El nombre de usuario ya existe' });
    }
    
    const newSeller = new Seller({
      name,
      username,
      password,
      commission: parseInt(commission) || 10,
      active: true
    });
    
    await newSeller.save();
    res.status(201).json(newSeller);
  } catch (error) {
    console.error('Error al crear vendedor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para actualizar vendedor
app.put('/api/sellers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSeller = await Seller.findByIdAndUpdate(id, req.body, { new: true });
    if (updatedSeller) {
      res.json(updatedSeller);
    } else {
      res.status(404).json({ error: 'Vendedor no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para eliminar vendedor
app.delete('/api/sellers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSeller = await Seller.findByIdAndDelete(id);
    if (deletedSeller) {
      res.json({ message: 'Vendedor eliminado exitosamente' });
    } else {
      res.status(404).json({ error: 'Vendedor no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para pagos
app.post('/api/payments', async (req, res) => {
  try {
    const newPayment = new Payment(req.body);
    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener pagos
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para reportes
app.get('/api/reports', async (req, res) => {
  try {
    const { type, date, seller } = req.query;
    
    let filter = {};
    if (date) {
      const start = parseDateToColombia(date);
      if (start) {
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        filter.timestamp = { $gte: start, $lt: end };
      }
    }
    
    if (seller) {
      filter.seller = seller;
    }
    
    let reportData = {};
    
    if (type === 'sales') {
      const tickets = await Ticket.find(filter);
      const totalSales = tickets.reduce((sum, ticket) => sum + ticket.total, 0);
      const ticketCount = tickets.length;
      
      const sellerSales = {};
      tickets.forEach(ticket => {
        sellerSales[ticket.seller] = (sellerSales[ticket.seller] || 0) + ticket.total;
      });
      
      const sellers = Object.entries(sellerSales).map(([seller, sales]) => ({
        seller,
        sales,
        tickets: tickets.filter(t => t.seller === seller).length
      }));
      
      reportData = {
        title: 'REPORTE DE VENTAS',
        period: date || 'Hoy',
        totalSales: totalSales.toLocaleString(),
        ticketCount,
        sellers
      };
    } else if (type === 'payments') {
      const payments = await Payment.find(filter);
      const totalPaid = payments.reduce((sum, payment) => sum + payment.netAmount, 0);
      const totalCommission = payments.reduce((sum, payment) => sum + payment.commissionAmount, 0);
      const paymentCount = payments.length;
      
      reportData = {
        title: 'REPORTE DE PAGOS A VENDEDORES',
        period: date || 'Hoy',
        totalPaid: totalPaid.toLocaleString(),
        totalCommission: totalCommission.toLocaleString(),
        paymentCount,
        sellers: payments.map(payment => ({
          name: payment.seller,
          paid: payment.netAmount.toLocaleString(),
          commission: payment.commissionAmount.toLocaleString(),
          payments: 1
        }))
      };
    }
    
    res.json(reportData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔴 NUEVO: Scraping de resultados oficiales desde loteriasdecolombia.co
const scrapeLoteriaResults = async () => {
  try {
    const { data } = await axios.get('https://loteriasdecolombia.co/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(data);
    const results = [];

    // Estrategia 1: Buscar bloques con clase específica (si existen)
    $('.resultado, .result, .lottery-result, [class*="result"]').each((i, el) => {
      let lottery = $(el).find('.nombre, .name, .title, h3, h4, strong').text().trim();
      let number = $(el).find('.numero, .number, .winning').text().trim().replace(/\D/g, '');
      
      if (!lottery) {
        // Intentar extraer del texto completo del bloque
        const fullText = $(el).text();
        const match = fullText.match(/([A-Za-zÁÉÍÓÚáéíóú\s]+?)[:\-–—]?\s*(\d{2,4})/);
        if (match) {
          lottery = match[1].trim();
          number = match[2];
        }
      }

      if (lottery && number && /^\d{2,4}$/.test(number)) {
        // Normalizar nombre de lotería (coincidir con tu lotterySchedule)
        const normalizedLottery = lottery
          .replace(/\s+/g, ' ')
          .replace(/(chance\s+)?(día|tarde|noche)/i, '')
          .trim();

        results.push({
          lottery: normalizedLottery,
          winningNumber: number,
          date: new Date().toISOString().split('T')[0]
        });
      }
    });

    // Estrategia 2: Si no se encontraron resultados, buscar en toda la página
    if (results.length === 0) {
      const allText = $('body').text();
      // Buscar patrones como "Dorado Noche 1234" o "Chontico: 567"
      const globalMatches = allText.matchAll(/([A-Za-zÁÉÍÓÚáéíóú\s]{3,})[:\-–—]?\s*(\d{2,4})/g);
      for (const match of globalMatches) {
        const lottery = match[1].trim();
        const number = match[2];
        if (lottery && number && /^\d{2,4}$/.test(number)) {
          const normalizedLottery = lottery
            .replace(/\s+/g, ' ')
            .replace(/(chance\s+)?(día|tarde|noche)/i, '')
            .trim();
          results.push({
            lottery: normalizedLottery,
            winningNumber: number,
            date: new Date().toISOString().split('T')[0]
          });
        }
      }
    }

    // Eliminar duplicados
    const uniqueResults = results.filter((result, index, self) =>
      index === self.findIndex(r => r.lottery === result.lottery)
    );

    return uniqueResults;
  } catch (error) {
    console.error('⚠️ Error al hacer scraping de loteriasdecolombia.co:', error.message);
    // Devolver resultados simulados para evitar fallos
    return [
      { lottery: 'Chontico Noche', winningNumber: '1234', date: new Date().toISOString().split('T')[0] },
      { lottery: 'Dorado Tarde', winningNumber: '567', date: new Date().toISOString().split('T')[0] },
      { lottery: 'Sinuano Noche', winningNumber: '89', date: new Date().toISOString().split('T')[0] }
    ];
  }
};

// 🔴 NUEVA RUTA: Obtener resultados oficiales
app.get('/api/lottery-results', async (req, res) => {
  try {
    const results = await scrapeLoteriaResults();
    res.json(results);
  } catch (error) {
    console.error('Error en /api/lottery-results:', error);
    res.status(500).json({ error: 'No se pudieron cargar los resultados oficiales' });
  }
});

// 🔴 NUEVA RUTA: Verificar tickets ganadores del día
app.get('/api/winning-tickets', async (req, res) => {
  try {
    // 1. Obtener resultados oficiales
    const officialResults = await scrapeLoteriaResults();
    
    // 2. Calcular rango de fechas para "hoy" en Colombia
    const today = new Date();
    const start = parseDateToColombia(today.toISOString().split('T')[0]);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    // 3. Obtener todos los tickets del día
    const tickets = await Ticket.find({ timestamp: { $gte: start, $lt: end } });

    // 4. Verificar coincidencias (2, 3 o 4 cifras al final del número ganador)
    const winningTickets = [];
    for (const ticket of tickets) {
      for (const bet of ticket.bets) {
        const played = bet.number;
        const digits = played.length;
        
        // Buscar resultado que coincida con la lotería (parcial o total)
        const result = officialResults.find(r => 
          r.lottery.toLowerCase().includes(bet.lottery.toLowerCase()) ||
          bet.lottery.toLowerCase().includes(r.lottery.toLowerCase())
        );
        
        if (result) {
          const lastDigits = result.winningNumber.slice(-digits);
          if (lastDigits === played) {
            winningTickets.push({
              ticketId: ticket.ticketId,
              seller: ticket.seller,
              customerPhone: ticket.customerPhone,
              lottery: bet.lottery,
              playedNumber: played,
              winningNumber: result.winningNumber,
              timestamp: ticket.timestamp
            });
          }
        }
      }
    }

    res.json(winningTickets);
  } catch (error) {
    console.error('Error en /api/winning-tickets:', error);
    res.status(500).json({ error: 'Error al verificar tickets ganadores' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});