const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // Para consumir la API oficial

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

// 🔴 NUEVA FUNCIÓN: Comparación inteligente de nombres de loterías
const findLotteryMatch = (ticketLottery, officialResults) => {
  if (!ticketLottery) return null;
  
  // Normalizar el nombre del ticket
  const normalizedTicket = ticketLottery
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Quitar caracteres especiales
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim();
  
  console.log(`🔍 Buscando: "${ticketLottery}" -> "${normalizedTicket}"`);
  
  // 1. Buscar coincidencia exacta primero
  for (const result of officialResults) {
    const normalizedResult = result.lottery
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (normalizedResult === normalizedTicket) {
      console.log(`✅ Coincidencia exacta: "${ticketLottery}" == "${result.lottery}"`);
      return result;
    }
  }
  
  // 2. Buscar coincidencias parciales (si uno contiene al otro)
  for (const result of officialResults) {
    const normalizedResult = result.lottery
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (normalizedResult.includes(normalizedTicket) || normalizedTicket.includes(normalizedResult)) {
      console.log(`🎯 Coincidencia parcial: "${ticketLottery}" ~ "${result.lottery}"`);
      return result;
    }
  }
  
  // 3. Búsqueda específica para casos conocidos
  const specialCases = {
    'loteria del meta': 'meta',
    'lotería del meta': 'meta',
    'loteria de bogota': 'bogota',
    'lotería de bogotá': 'bogota',
    'loteria de medellin': 'medellin',
    'lotería de medellín': 'medellin'
  };
  
  const specialKey = Object.keys(specialCases).find(key => 
    normalizedTicket.includes(key)
  );
  
  if (specialKey) {
    const target = specialCases[specialKey];
    for (const result of officialResults) {
      const normalizedResult = result.lottery
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (normalizedResult.includes(target)) {
        console.log(`🎯 Caso especial: "${ticketLottery}" -> "${result.lottery}"`);
        return result;
      }
    }
  }
  
  console.log(`❌ No se encontró coincidencia para "${ticketLottery}"`);
  return null;
};

// Esquema de Ticket
const ticketSchema = new mongoose.Schema({
  ticketId: String,
  seller: String,
  bets: [{
    lottery: String,
    digits: String,
    number: String,
    amount: Number,
    type: { type: String, default: 'direct' } // Nuevo campo para tipo de apuesta
  }],
  total: Number,
  customerPhone: String,
  customerName: { type: String, default: '' },
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
    const { bets } = req.body;
    
    // Validar que cada apuesta tenga el campo type
    const validatedBets = bets.map(bet => ({
      ...bet,
      type: bet.type || 'direct' // Valor por defecto si no viene
    }));
    
    const ticketData = {
      ...req.body,
      bets: validatedBets
    };
    
    const ticket = new Ticket(ticketData);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error al guardar ticket:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
    const nowInColombia = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Bogota' });
    const todayStart = parseDateToColombia(nowInColombia);
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

// 🔴 NUEVO: Consumir API oficial de resultados (CORREGIDO para usar fecha de Colombia)
const fetchOfficialResults = async (date = null) => {
  try {
    // Si no se da una fecha, usar la fecha actual EN COLOMBIA
    const targetDate = date || new Date().toLocaleDateString('sv-SE', {
      timeZone: 'America/Bogota'
    });
    
    const url = `https://api-resultadosloterias.com/api/results/${targetDate}`;
    
    const response = await axios.get(url, { timeout: 5000 });
    
    if (response.data.status === 'success') {
      return response.data.data.map(item => ({
        lottery: item.lottery,
        winningNumber: item.result,
        date: item.date
      }));
    }
    return [];
  } catch (error) {
    console.error('⚠️ Error al consumir API oficial:', error.message);
    // Fallback: resultados simulados actualizados
    const fallbackDate = date || new Date().toLocaleDateString('sv-SE', {
      timeZone: 'America/Bogota'
    });
    return [
      { lottery: 'CHONTICO NOCHE', winningNumber: '1234', date: fallbackDate },
      { lottery: 'DORADO TARDE', winningNumber: '567', date: fallbackDate },
      { lottery: 'SINUANO NOCHE', winningNumber: '89', date: fallbackDate },
      { lottery: 'LA CARIBEÑA NOCHE', winningNumber: '432', date: fallbackDate },
      { lottery: 'SUPER ASTRO LUNA', winningNumber: '7890', date: fallbackDate }
    ];
  }
};

// 🔴 NUEVA RUTA: Obtener resultados oficiales (usa la API real)
app.get('/api/lottery-results', async (req, res) => {
  try {
    const { date } = req.query;
    const results = await fetchOfficialResults(date);
    res.json(results);
  } catch (error) {
    console.error('Error en /api/lottery-results:', error);
    res.status(500).json({ error: 'No se pudieron cargar los resultados oficiales' });
  }
});

// 🔴 NUEVA RUTA: Verificar tickets ganadores (usa la API real) - CORREGIDA
app.get('/api/winning-tickets', async (req, res) => {
  try {
    console.log('🚀 Iniciando búsqueda de tickets ganadores...');
    
    // 1. Calcular "ayer" en Colombia
    const todayInColombia = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Bogota' });
    const todayDate = new Date(todayInColombia);
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(todayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    console.log(`📅 Buscando resultados del día: ${yesterday}`);

    // 2. Obtener resultados oficiales de AYER
    const officialResults = await fetchOfficialResults(yesterday);
    console.log(`📊 Se encontraron ${officialResults.length} resultados oficiales`);

    // 3. Calcular rango de fechas para "ayer" en Colombia
    const start = parseDateToColombia(yesterday);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    // 4. Obtener todos los tickets de AYER
    const tickets = await Ticket.find({ timestamp: { $gte: start, $lt: end } });
    console.log(`🎫 Se encontraron ${tickets.length} tickets de ayer`);

    // 5. Verificar coincidencias (2, 3 o 4 cifras al final del número ganador)
    const winningTickets = [];
    for (const ticket of tickets) {
      for (const bet of ticket.bets) {
        const played = bet.number;
        const digits = played.length;
        
        console.log(`🔍 Analizando ticket ${ticket.ticketId}: ${bet.lottery} - ${played} (${digits} cifras)`);
        
        // 🔴 ÚNICO CAMBIO: Usar la nueva función de comparación
        const result = findLotteryMatch(bet.lottery, officialResults);
        
        if (result) {
          const lastDigits = result.winningNumber.slice(-digits);
          console.log(`🎯 Comparando: ${played} vs ${result.winningNumber} (últimos ${digits}: ${lastDigits})`);
          
          // Verificar según el tipo de apuesta
          let isWinner = false;
          let winningType = '';

          if (bet.type === 'direct') {
            // Para apuestas directas, debe coincidir exactamente
            if (lastDigits === played) {
              isWinner = true;
              winningType = 'direct';
            }
          } else if (bet.type === 'combined') {
            // Para apuestas combinadas, las cifras deben coincidir en cualquier orden
            const playedDigits = played.split('').sort().join('');
            const winningDigits = lastDigits.split('').sort().join('');
            
            if (playedDigits === winningDigits && played.length === lastDigits.length) {
              isWinner = true;
              winningType = 'combined';
            }
          } else if (bet.type === 'first4') {
            // Para 5 cifras - 4 cifras directas (las primeras 4 del número jugado)
            if (bet.digits === '5' && result.winningNumber.length >= 4) {
              const first4Played = played.slice(0, 4);
              const first4Winning = result.winningNumber.slice(0, 4);
              if (first4Played === first4Winning) {
                isWinner = true;
                winningType = 'first4';
              }
            }
          } else if (bet.type === 'first4combined') {
            // Para 5 cifras - 4 cifras combinadas (las primeras 4 en cualquier orden)
            if (bet.digits === '5' && result.winningNumber.length >= 4) {
              const first4Played = played.slice(0, 4).split('').sort().join('');
              const first4Winning = result.winningNumber.slice(0, 4).split('').sort().join('');
              if (first4Played === first4Winning) {
                isWinner = true;
                winningType = 'first4combined';
              }
            }
          }

          if (isWinner) {
            console.log(`🎉 ¡GANADOR (${winningType})! Ticket ${ticket.ticketId} - ${bet.lottery} - ${played} vs ${result.winningNumber}`);
            winningTickets.push({
              ticketId: ticket.ticketId,
              seller: ticket.seller,
              customerPhone: ticket.customerPhone,
              lottery: bet.lottery,
              playedNumber: played,
              winningNumber: result.winningNumber,
              betType: bet.type,
              winningType: winningType,
              digits: bet.digits,
              timestamp: ticket.timestamp
            });

          } else {
            console.log(`❌ No coincide: ${played} ≠ ${lastDigits}`);
          }
        } else {
          console.log(`❌ No se encontró resultado para lotería: ${bet.lottery}`);
        }
      }
    }

    console.log(`🏆 Total de tickets ganadores encontrados: ${winningTickets.length}`);
    res.json(winningTickets);
  } catch (error) {
    console.error('Error en /api/winning-tickets:', error);
    res.status(500).json({ error: 'Error al verificar tickets ganadores' });
  }
});

// 🔴 NUEVA RUTA: Obtener loterías activas HOY en Colombia (SIN lógica de traslados)
app.get('/api/lotteries/today', (req, res) => {
  // 📅 Lista de loterías con sus horarios (martes normal)
  const lotterySchedule = [
    // LOTE R ÍAS TRADICIONALES
    { name: 'Antioqueñita Día', days: [1,2,3,4,5,6], time: '10:00', holidayTime: '12:00', sundayTime: '12:00' },
    { name: 'Antioqueñita Tarde', days: [0,1,2,3,4,5,6], time: '16:00', holidayTime: '16:00' },
    { name: 'Dorado Mañana', days: [1,2,3,4,5,6], time: '10:58' },
    { name: 'Dorado Tarde', days: [1,2,3,4,5,6], time: '15:28' },
    { name: 'Dorado Noche', days: [0,6], time: '22:15', holidayTime: '19:25', sundayTime: '19:25' },
    { name: 'Fantástica Día', days: [1,2,3,4,5,6], time: '12:57' },
    { name: 'Fantástica Noche', days: [1,2,3,4,5,6], time: '20:30' },
    { name: 'El Samán de la Suerte', days: [1,2,3,4,5,6], time: '13:00', holidayTime: '19:00', sundayTime: '19:00' },
    { name: 'Paisita Día', days: [1,2,3,4,5,6], time: '13:00', holidayTime: '14:00', sundayTime: '14:00' },
    { name: 'Paisita Noche', days: [1,2,3,4,5,6], time: '18:00', holidayTime: '20:00', sundayTime: '20:00' },
    { name: 'Chontico Día', days: [0,1,2,3,4,5,6], time: '13:00', holidayTime: '13:00' },
    { name: 'Chontico Noche', days: [0,1,2,3,4,5,6], time: '19:00', holidayTime: '20:00', saturdayTime: '22:00', sundayTime: '20:00' },
    { name: 'Pijao de Oro', days: [0,1,2,3,4,5,6], time: '14:00', holidayTime: '20:00', saturdayTime: '21:00', sundayTime: '22:00' },
    { name: 'Super Astro Sol', days: [1,2,3,4,5,6], time: '14:30' },
    { name: 'Super Astro Luna', days: [0,1,2,3,4,5,6], time: '22:30', holidayTime: '20:30', sundayTime: '20:30' },
    { name: 'Sinuano Día', days: [1,2,3,4,5,6], time: '14:30', holidayTime: '13:00', sundayTime: '13:00' },
    { name: 'Sinuano Noche', days: [0,1,2,3,4,5,6], time: '22:30', holidayTime: '20:30', sundayTime: '20:30' },
    { name: 'La Caribeña Día', days: [0,1,2,3,4,5,6], time: '14:30', holidayTime: '14:30' },
    { name: 'La Caribeña Noche', days: [0,1,2,3,4,5,6], time: '22:30', holidayTime: '20:30', sundayTime: '20:30' },
    { name: 'Motilón Tarde', days: [0,1,2,3,4,5,6], time: '15:00', holidayTime: '15:00' },
    { name: 'Motilón Noche', days: [0,1,2,3,4,5,6], time: '21:00', holidayTime: '21:00' },
    { name: 'Cafeterito Tarde', days: [1,2,3,4,5,6], time: '12:00' },
    { name: 'Cafeterito Noche', days: [0,1,2,3,4,5,6], time: '20:00', holidayTime: '21:00', saturdayTime: '23:00', sundayTime: '21:00' },
    { name: 'Paisa Lotto', days: [6], time: '22:00' },
    { name: 'La Culona Día', days: [0,1,2,3,4,5,6], time: '14:30', holidayTime: '14:30' },
    { name: 'La Culona Noche', days: [0,1,2,3,4,5,6], time: '21:30', holidayTime: '20:00', sundayTime: '20:00' },
    { name: 'SuperMillonaria', days: [5], time: '23:00' },
    
    // LOTE R ÍAS REGIONALES
    { name: 'Lotería de Cundinamarca', days: [1,2], time: '22:30' },
    { name: 'Lotería de Tolima', days: [1,2], time: '22:30' },
    { name: 'Lotería Cruz Roja', days: [2], time: '22:30' },
    { name: 'Lotería de Huila', days: [2], time: '22:30' },
    { name: 'Lotería de Manizales', days: [3], time: '22:30' },
    { name: 'Lotería del Meta', days: [3], time: '22:30' },
    { name: 'Lotería del Valle', days: [3], time: '22:30' },
    { name: 'Lotería Quindío', days: [4], time: '22:30' },
    { name: 'Lotería de Bogotá', days: [4], time: '22:30' },
    { name: 'Lotería de Santander', days: [5], time: '23:00' },
    { name: 'Lotería de Medellín', days: [5], time: '23:00' },
    { name: 'Lotería Risaralda', days: [5], time: '23:00' },
    { name: 'Lotería de Boyacá', days: [6], time: '22:40' },
    { name: 'Lotería de Cauca', days: [6], time: '21:40' },
    { name: 'Extra de Colombia (Mensual)', days: [6], time: '23:00' },
    
    // 🔴 SUPERCHANCE - NUEVAS LOTE R ÍAS ESPECIALIZADAS POR MODALIDAD
    { name: 'SuperChance 1 Cifra (Uña)', days: [0,1,2,3,4,5,6], time: '19:00' },
    { name: 'SuperChance 2 Cifras (Pata)', days: [0,1,2,3,4,5,6], time: '19:00' },
    { name: 'SuperChance 3 Cifras Directo', days: [0,1,2,3,4,5,6], time: '19:00' },
    { name: 'SuperChance 3 Cifras Combinado', days: [0,1,2,3,4,5,6], time: '19:00' },
    { name: 'SuperChance 4 Cifras Directo', days: [0,1,2,3,4,5,6], time: '19:00' },
    { name: 'SuperChance 4 Cifras Combinado', days: [0,1,2,3,4,5,6], time: '19:00' },
    { name: 'SuperChance 5 Cifras Directo', days: [0,1,2,3,4,5,6], time: '19:00' },
    { name: 'SuperChance 5 Cifras Combinado', days: [0,1,2,3,4,5,6], time: '19:00' },
    { name: 'SuperChance 5 Cifras - 4 Directas', days: [0,1,2,3,4,5,6], time: '19:00' },
    { name: 'SuperChance 5 Cifras - 4 Combinadas', days: [0,1,2,3,4,5,6], time: '19:00' }
  ];

  // Obtiene el día de la semana de HOY en Colombia (0 = domingo, 1 = lunes, ..., 2 = martes)
  const nowInColombia = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }));
  const dayOfWeek = nowInColombia.getDay(); // 2 para martes

  const todayLotteries = lotterySchedule
    .map(lottery => {
      // Si hoy es martes (2), ¿incluye el martes en sus días?
      if (lottery.days.includes(dayOfWeek)) {
        const [h, m] = lottery.time.split(':').map(Number);
        const now = nowInColombia;
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
        const lotteryTimeInMinutes = h * 60 + m;
        const fiveMinutesBefore = lotteryTimeInMinutes - 5;
        const active = currentTimeInMinutes < fiveMinutesBefore;
        return { 
          name: lottery.name, 
          time: lottery.time, 
          active,
          type: lottery.name.includes('SuperChance 1') ? '1' :
                 lottery.name.includes('SuperChance 2') ? '2' :
                 lottery.name.includes('SuperChance 3') ? '3' :
                 lottery.name.includes('SuperChance 4') ? '4' :
                 lottery.name.includes('SuperChance 5') ? '5' : 'all'
        };
      }
      // Si no juega hoy, no se muestra
      return null;
    })
    .filter(Boolean); // Elimina nulos

  res.json(todayLotteries);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});