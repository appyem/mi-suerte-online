const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});