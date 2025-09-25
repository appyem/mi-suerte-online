const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://adminuser:Appy2025@misuertecluster.hymrcja.mongodb.net/?retryWrites=true&w=majority&appName=MiSuerteCluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

const Payment = mongoose.model('Payment', paymentSchema, 'payments');

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

// Ruta para obtener tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const { date, seller } = req.query;
    let filter = {};
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.timestamp = { $gte: startDate, $lt: endDate };
    }
    
    if (seller) {
      filter.seller = seller;
    }
    
    const tickets = await Ticket.find(filter).sort({ timestamp: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// Ruta para obtener vendedores (ahora desde la base de datos)
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
    
    // Validar campos requeridos
    if (!name || !username || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    // Verificar si el usuario ya existe
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

// Ruta para reportes
app.get('/api/reports', async (req, res) => {
  try {
    const { type, date, seller } = req.query;
    
    let filter = {};
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.timestamp = { $gte: startDate, $lt: endDate };
    }
    
    if (seller) {
      filter.seller = seller;
    }
    
    const tickets = await Ticket.find(filter);
    
    let reportData = {};
    
    if (type === 'sales') {
      const totalSales = tickets.reduce((sum, ticket) => sum + ticket.total, 0);
      const ticketCount = tickets.length;
      
      // Obtener vendedores únicos
      const sellerNames = [...new Set(tickets.map(t => t.seller))];
      const sellersData = [];
      
      for (const sellerName of sellerNames) {
        const sellerTickets = tickets.filter(t => t.seller === sellerName);
        const sellerSales = sellerTickets.reduce((sum, ticket) => sum + ticket.total, 0);
        sellersData.push({
          seller: sellerName,
          name: sellerName,
          sales: sellerSales.toLocaleString(),
          tickets: sellerTickets.length
        });
      }
      
      reportData = {
        title: 'REPORTE DE VENTAS',
        period: date || new Date().toISOString().split('T')[0],
        totalSales: totalSales.toLocaleString(),
        ticketCount,
        sellers: sellersData,
        mostPlayedNumbers: []
      };
    } else if (type === 'payments') {
      // Calcular pagos basados en comisiones
      const payments = [];
      const sellerNames = [...new Set(tickets.map(t => t.seller))];
      
      for (const sellerName of sellerNames) {
        const sellerTickets = tickets.filter(t => t.seller === sellerName);
        const sellerSales = sellerTickets.reduce((sum, ticket) => sum + ticket.total, 0);
        
        // Obtener comisión del vendedor
        const sellerDoc = await Seller.findOne({ username: sellerName });
        const commissionRate = sellerDoc ? sellerDoc.commission : 10;
        const commissionAmount = Math.round(sellerSales * commissionRate / 100);
        const netAmount = sellerSales - commissionAmount;
        
        payments.push({
          name: sellerDoc ? sellerDoc.name : sellerName,
          paid: netAmount.toLocaleString(),
          commission: commissionAmount.toLocaleString(),
          payments: 1
        });
      }
      
      const totalPaid = payments.reduce((sum, p) => sum + parseInt(p.paid.replace(/,/g, '')), 0);
      const totalCommission = payments.reduce((sum, p) => sum + parseInt(p.commission.replace(/,/g, '')), 0);
      
      reportData = {
        title: 'REPORTE DE PAGOS A VENDEDORES',
        period: date || new Date().toISOString().split('T')[0],
        totalPaid: totalPaid.toLocaleString(),
        totalCommission: totalCommission.toLocaleString(),
        paymentCount: payments.length,
        sellers: payments
      };
    }
    
    res.json(reportData);
  } catch (error) {
    console.error('Error en reportes:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});