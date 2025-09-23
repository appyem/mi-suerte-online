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

// Crear esquema de Ticket
const ticketSchema = new mongoose.Schema({
  ticketId: String,
  seller: String,
  bets: Array,
  total: Number,
  customerPhone: String,
  timestamp: { type: Date, default: Date.now },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

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

// Ruta para obtener todos los tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ timestamp: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});