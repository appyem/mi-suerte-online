import React, { useState, useEffect } from 'react';

const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [lotteries, setLotteries] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [pendingBets, setPendingBets] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [currentBet, setCurrentBet] = useState({ lottery: '', digits: '2', number: '', amount: '' });
  const [betList, setBetList] = useState([]);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [payments, setPayments] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewReportData, setPreviewReportData] = useState({ message: '', phone: '' });
  const [todayTickets, setTodayTickets] = useState([]);
  const BACKEND_URL = 'https://mi-suerte-online-backend.onrender.com';

  const lotterySchedule = [
    { name: 'Antioqueñita Día', days: [1,2,3,4,5,6], time: '10:00', holidayTime: '12:00' },
    { name: 'Antioqueñita Tarde', days: [0,1,2,3,4,5,6], time: '16:00', holidayTime: '16:00' },
    { name: 'Dorado Mañana', days: [1,2,3,4,5,6], time: '10:58', holidayTime: null },
    { name: 'Dorado Tarde', days: [1,2,3,4,5,6], time: '15:28', holidayTime: null },
    { name: 'Dorado Noche', days: [6], time: '22:15', holidayTime: '19:25' },
    { name: 'Fantástica Día', days: [1,2,3,4,5,6], time: '12:57', holidayTime: null },
    { name: 'Fantástica Noche', days: [1,2,3,4,5,6], time: '20:30', holidayTime: null },
    { name: 'El Samán de la Suerte', days: [1,2,3,4,5,6], time: '13:00', holidayTime: '19:00' },
    { name: 'Paisita Día', days: [1,2,3,4,5,6], time: '13:00', holidayTime: '14:00' },
    { name: 'Paisita Noche', days: [1,2,3,4,5,6], time: '18:00', holidayTime: '20:00' },
    { name: 'Chontico Día', days: [0,1,2,3,4,5,6], time: '13:00', holidayTime: '13:00' },
    { name: 'Chontico Noche', days: [1,2,3,4,5], time: '19:00', holidayTime: '20:00', saturdayTime: '22:00' },
    { name: 'Pijao de Oro', days: [1,2,3,4,5], time: '14:00', holidayTime: '20:00', saturdayTime: '21:00', sundayTime: '22:00' },
    { name: 'Super Astro Sol', days: [1,2,3,4,5,6], time: '14:30', holidayTime: null },
    { name: 'Super Astro Luna', days: [1,2,3,4,5,6], time: '22:30', holidayTime: '20:30' },
    { name: 'Sinuano Día', days: [1,2,3,4,5,6], time: '14:30', holidayTime: '13:00' },
    { name: 'Sinuano Noche', days: [1,2,3,4,5,6], time: '22:30', holidayTime: '20:30' },
    { name: 'La Caribeña Día', days: [0,1,2,3,4,5,6], time: '14:30', holidayTime: '14:30' },
    { name: 'La Caribeña Noche', days: [1,2,3,4,5,6], time: '22:30', holidayTime: '20:30' },
    { name: 'Motilón Tarde', days: [0,1,2,3,4,5,6], time: '15:00', holidayTime: '15:00' },
    { name: 'Motilón Noche', days: [0,1,2,3,4,5,6], time: '21:00', holidayTime: '21:00' },
    { name: 'Cafeterito Tarde', days: [1,2,3,4,5,6], time: '12:00', holidayTime: null },
    { name: 'Cafeterito Noche', days: [1,2,3,4,5], time: '22:00', holidayTime: '21:00', saturdayTime: '23:00' },
    { name: 'Paisa Lotto', days: [6], time: '22:00', holidayTime: null },
    { name: 'La Culona Día', days: [0,1,2,3,4,5,6], time: '14:30', holidayTime: '14:30' },
    { name: 'La Culona Noche', days: [1,2,3,4,5,6], time: '21:30', holidayTime: '20:00' },
    { name: 'SuperMillonaria', days: [5], time: '23:00', holidayTime: null },
    { name: 'Lotería de Cundinamarca', days: [1], time: '22:30', holidayTime: null },
    { name: 'Lotería de Tolima', days: [1], time: '23:00', holidayTime: null },
    { name: 'Lotería Cruz Roja', days: [2], time: '22:30', holidayTime: null },
    { name: 'Lotería de Huila', days: [2], time: '22:30', holidayTime: null },
    { name: 'Lotería de Manizales', days: [3], time: '22:30', holidayTime: null },
    { name: 'Lotería del Meta', days: [3], time: '22:30', holidayTime: null },
    { name: 'Lotería del Valle', days: [3], time: '22:30', holidayTime: null },
    { name: 'Lotería Quindío', days: [4], time: '22:30', holidayTime: null },
    { name: 'Lotería de Bogotá', days: [4], time: '22:30', holidayTime: null },
    { name: 'Lotería de Santander', days: [5], time: '23:00', holidayTime: null },
    { name: 'Lotería de Medellín', days: [5], time: '23:00', holidayTime: null },
    { name: 'Lotería Risaralda', days: [5], time: '23:00', holidayTime: null },
    { name: 'Lotería de Boyacá', days: [6], time: '22:40', holidayTime: null },
    { name: 'Lotería de Cauca', days: [6], time: '21:40', holidayTime: null },
    { name: 'Extra de Colombia (Mensual)', days: [6], time: '23:00', holidayTime: null }
  ];

  const isHoliday = () => {
    const holidays = ['01-01', '01-06', '03-19', '05-01', '06-29', '08-15', '10-12', '11-01', '11-11', '12-08', '12-25'];
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return holidays.includes(`${month}-${day}`);
  };

  const getLotteryTime = (lottery) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const holiday = isHoliday();
    if (holiday && lottery.holidayTime) return lottery.holidayTime;
    if (dayOfWeek === 6 && lottery.saturdayTime) return lottery.saturdayTime;
    if (dayOfWeek === 0 && lottery.sundayTime) return lottery.sundayTime;
    if (lottery.days.includes(dayOfWeek)) return lottery.time;
    return null;
  };

  useEffect(() => {
    const todayLotteries = lotterySchedule.map((lottery, index) => {
      const time = getLotteryTime(lottery);
      if (time) {
        return { id: index + 1, name: lottery.name, time: time, active: true };
      }
      return null;
    }).filter(Boolean);
    setLotteries(todayLotteries);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('miSuerteSession');
    if (saved) {
      try {
        const { userRole, currentUser } = JSON.parse(saved);
        setUserRole(userRole);
        setCurrentUser(currentUser);
        setShowLogin(false);
      } catch (e) {
        console.error('Error al restaurar sesión:', e);
      }
    }
  }, []);

  const saveSession = (role, user) => {
    localStorage.setItem('miSuerteSession', JSON.stringify({ userRole: role, currentUser: user }));
  };

  const clearSession = () => {
    localStorage.removeItem('miSuerteSession');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setUserRole(data.role);
        setCurrentUser({ username: data.username, role: data.role, name: data.name });
        setShowLogin(false);
        saveSession(data.role, { username: data.username, role: data.role, name: data.name });
        alert(`Bienvenido, ${data.role === 'admin' ? 'Administrador' : 'Vendedor'}`);
      } else {
        alert(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('Error de conexión. Verifica que el backend esté funcionando.');
    }
  };

  const handleAddBet = () => {
    if (!currentBet.lottery || !currentBet.number || !currentBet.amount) {
      alert('Complete todos los campos');
      return;
    }
    const digits = parseInt(currentBet.digits);
    if (currentBet.number.length !== digits) {
      alert(`El número debe tener exactamente ${digits} dígitos`);
      return;
    }
    const amount = parseInt(currentBet.amount);
    if (digits === 4 && amount > 5000) {
      alert('El chance de 4 cifras tiene un límite máximo de $5,000 COP');
      return;
    }
    setBetList([...betList, { ...currentBet, id: Date.now() }]);
    setCurrentBet({ lottery: '', digits: '2', number: '', amount: '' });
  };

  const handleRemoveBet = (betId) => {
    if (window.confirm('¿Está seguro que desea eliminar esta apuesta?')) {
      setBetList(betList.filter(bet => bet.id !== betId));
    }
  };

  const openWhatsApp = (phone, message) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/57${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const confirmTicket = () => {
    if (betList.length === 0) {
      alert('No hay apuestas para generar el tiquete');
      return;
    }
    if (!customerPhone) {
      alert('Por favor ingrese el número del cliente');
      return;
    }
    setShowConfirmModal(true);
  };

  // 🔴 Función para eliminar ticket
  const deleteTicket = async (ticketId) => {
    if (!window.confirm('¿Está seguro que desea eliminar este ticket? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller: currentUser.username }),
      });

      if (response.ok) {
        setTodayTickets(todayTickets.filter(ticket => ticket._id !== ticketId));
        alert('Ticket eliminado exitosamente');
      } else {
        const errorData = await response.json();
        alert('Error: ' + (errorData.error || 'No se pudo eliminar el ticket'));
      }
    } catch (error) {
      console.error('Error al eliminar ticket:', error);
      alert('Error de conexión al intentar eliminar el ticket');
    }
  };

  const generateTicket = async () => {
    setShowConfirmModal(false);
    const ticket = {
      ticketId: `TKT${Date.now()}`,
      seller: currentUser.username,
      bets: [...betList],
      total: betList.reduce((sum, bet) => sum + parseInt(bet.amount), 0),
      customerPhone,
      timestamp: new Date()
    };
    const ticketWithCustomer = { ...ticket, customerName };
    setTodayTickets(prev => [...prev, ticketWithCustomer]);
    try {
      const response = await fetch(`${BACKEND_URL}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket),
      });
      if (!response.ok) throw new Error('Error al guardar el ticket');
      let message = `¡Gracias por jugar con Mi Suerte Online${customerName ? `, ${customerName}` : ''}! 🍀\n`;
      message += `Tiquete: ${ticket.ticketId}\n`;
      message += `Fecha: ${new Date(ticket.timestamp).toLocaleString()}\n`;
      message += `Vendedor: ${ticket.seller}\n`;
      message += `Total: $${ticket.total.toLocaleString()}\n`;
      message += `Detalles de apuestas:\n`;
      ticket.bets.forEach((bet, index) => {
        message += `${index + 1}. ${bet.lottery} - ${bet.number} (${bet.digits} cifras) - $${parseInt(bet.amount).toLocaleString()}\n`;
      });
      openWhatsApp(customerPhone, message);
      setBetList([]);
      setCustomerPhone('');
      setCustomerName('');
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al guardar el ticket. Por favor intenta nuevamente.');
    }
  };

  // 🔴 Función para obtener fecha local en formato YYYY-MM-DD
  const getLocalDate = () => {
    return new Date().toLocaleDateString('sv-SE');
  };

  // 🔴 Corregido: dailyClose ahora usa fecha local
  const dailyClose = async () => {
    const today = getLocalDate();
    try {
      const sellersResponse = await fetch(`${BACKEND_URL}/api/sellers`);
      if (!sellersResponse.ok) throw new Error('Error al cargar vendedores');
      const sellersData = await sellersResponse.json();

      const ticketsResponse = await fetch(`${BACKEND_URL}/api/tickets?date=${today}&seller=${currentUser.username}`);
      if (!ticketsResponse.ok) throw new Error(`Error HTTP: ${ticketsResponse.status}`);
      const todayTickets = await ticketsResponse.json();
      const totalSales = todayTickets.reduce((sum, ticket) => sum + ticket.total, 0);
      const ticketCount = todayTickets.length;
      if (ticketCount === 0) {
        alert('No hay ventas para el día de hoy');
        return;
      }
      const seller = sellersData.find(s => s.username === currentUser.username);
      const commissionRate = seller ? seller.commission : 10;
      const commissionAmount = Math.round(totalSales * commissionRate / 100);
      const netAmount = totalSales - commissionAmount;
      const reportPhone = prompt('Ingrese el número de teléfono para enviar el reporte (solo dígitos):', '');
      if (!reportPhone || reportPhone.trim() === '') {
        alert('Operación cancelada');
        return;
      }
      const cleanPhone = reportPhone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        alert('Por favor ingrese un número de teléfono válido (mínimo 10 dígitos)');
        return;
      }
      let reportMessage = `REPORTE DIARIO - Mi Suerte Online 📊\n`;
      reportMessage += `Fecha: ${new Date().toLocaleDateString('es-CO')}\n`;
      reportMessage += `Vendedor: ${currentUser.username}\n`;
      reportMessage += `Total Ventas: $${totalSales.toLocaleString()}\n`;
      reportMessage += `Número de Tiquetes: ${ticketCount}\n`;
      reportMessage += `Comisión (${commissionRate}%): $${commissionAmount.toLocaleString()}\n`;
      reportMessage += `Monto a Pagar: $${netAmount.toLocaleString()}\n`;
      reportMessage += `Detalles de Ventas:\n`;
      todayTickets.forEach((ticket, index) => {
        reportMessage += `\nTiquete #${index + 1}: ${ticket.ticketId}\n`;
        reportMessage += `Total: $${ticket.total.toLocaleString()}\n`;
        ticket.bets.forEach((bet, betIndex) => {
          reportMessage += `  ${betIndex + 1}. ${bet.lottery} - ${bet.number} - $${parseInt(bet.amount).toLocaleString()}\n`;
        });
      });

      setPreviewReportData({
        message: reportMessage,
        phone: cleanPhone,
        paymentData: {
          seller: currentUser.username,
          date: new Date().toLocaleDateString('es-CO'),
          totalSales,
          commissionRate,
          commissionAmount,
          netAmount,
          ticketCount
        }
      });
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error en cierre diario:', error);
      alert(`Error al generar el reporte diario: ${error.message || 'Verifique la conexión'}`);
    }
  };

  const openDateRangeModal = () => {
    const today = getLocalDate();
    setDateRange({ start: today, end: today });
    setShowDateRangeModal(true);
  };

  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [dateRange, setDateRange] = useState({ start: getLocalDate(), end: getLocalDate() });

  // 🔴 Corregido: generateDateRangeReport ahora usa fechas como cadenas
  const generateDateRangeReport = async () => {
    const { start, end } = dateRange;
    if (!start || !end) {
      alert('Seleccione ambas fechas');
      return;
    }
    if (start > end) {
      alert('La fecha de inicio no puede ser mayor que la fecha de fin');
      return;
    }
    try {
      const sellersResponse = await fetch(`${BACKEND_URL}/api/sellers`);
      if (!sellersResponse.ok) throw new Error('Error al cargar vendedores');
      const sellersData = await sellersResponse.json();

      const ticketsResponse = await fetch(`${BACKEND_URL}/api/tickets?startDate=${start}&endDate=${end}&seller=${currentUser.username}`);
      if (!ticketsResponse.ok) throw new Error(`Error HTTP: ${ticketsResponse.status}`);
      const ticketsInRange = await ticketsResponse.json();
      const totalSales = ticketsInRange.reduce((sum, ticket) => sum + ticket.total, 0);
      const ticketCount = ticketsInRange.length;
      if (ticketCount === 0) {
        alert(`No hay ventas en el rango de fechas: ${start} al ${end}`);
        return;
      }
      const seller = sellersData.find(s => s.username === currentUser.username);
      const commissionRate = seller ? seller.commission : 10;
      const commissionAmount = Math.round(totalSales * commissionRate / 100);
      const netAmount = totalSales - commissionAmount;
      const reportPhone = prompt('Ingrese el número de teléfono para enviar el reporte (solo dígitos):', '');
      if (!reportPhone || reportPhone.trim() === '') return;
      const cleanPhone = reportPhone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        alert('Por favor ingrese un número de teléfono válido (mínimo 10 dígitos)');
        return;
      }
      let reportMessage = `REPORTE DE CIERRE - Mi Suerte Online 📊\n`;
      reportMessage += `Rango de Fechas: ${start} al ${end}\n`;
      reportMessage += `Vendedor: ${currentUser.username}\n`;
      reportMessage += `Total Ventas: $${totalSales.toLocaleString()}\n`;
      reportMessage += `Número de Tiquetes: ${ticketCount}\n`;
      reportMessage += `Comisión (${commissionRate}%): $${commissionAmount.toLocaleString()}\n`;
      reportMessage += `Monto a Pagar: $${netAmount.toLocaleString()}\n`;
      reportMessage += `Detalles de Ventas:\n`;
      ticketsInRange.forEach((ticket, index) => {
        reportMessage += `\nTiquete #${index + 1}: ${ticket.ticketId}\n`;
        reportMessage += `Fecha: ${new Date(ticket.timestamp).toLocaleDateString('es-CO')}\n`;
        reportMessage += `Total: $${ticket.total.toLocaleString()}\n`;
        ticket.bets.forEach((bet, betIndex) => {
          reportMessage += `  ${betIndex + 1}. ${bet.lottery} - ${bet.number} - $${parseInt(bet.amount).toLocaleString()}\n`;
        });
      });

      setPreviewReportData({
        message: reportMessage,
        phone: cleanPhone,
        paymentData: {
          seller: currentUser.username,
          date: `${start} al ${end}`,
          totalSales,
          commissionRate,
          commissionAmount,
          netAmount,
          ticketCount
        }
      });
      setShowPreviewModal(true);
      setShowDateRangeModal(false);
    } catch (error) {
      console.error('Error en cierre por rango de fechas:', error);
      alert(`Error al generar el reporte: ${error.message || 'Verifique la conexión'}`);
    }
  };

  const sendReport = () => {
    openWhatsApp(previewReportData.phone, previewReportData.message);
    try {
      fetch(`${BACKEND_URL}/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(previewReportData.paymentData),
      });
    } catch (paymentError) {
      console.warn('No se pudo registrar el pago:', paymentError);
    }
    setShowPreviewModal(false);
    alert('Reporte enviado exitosamente');
  };

  const logout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setShowLogin(true);
    setUsername('');
    setPassword('');
    clearSession();
  };

  const handleNumberChange = (value) => {
    const digits = parseInt(currentBet.digits);
    if (value.length <= digits) {
      setCurrentBet({...currentBet, number: value});
    }
  };

  const loadSellers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/sellers`);
      if (response.ok) {
        const sellersData = await response.json();
        setSellers(sellersData);
      }
    } catch (error) {
      console.error('Error al cargar vendedores:', error);
    }
  };

  const loadTickets = async () => {
    try {
      let url = `${BACKEND_URL}/api/tickets`;
      if (userRole === 'seller' && currentUser) {
        url += `?seller=${currentUser.username}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const ticketsData = await response.json();
        if (userRole === 'admin') {
          setTickets(ticketsData);
        }
        const today = getLocalDate();
        const todayTicketsFromDB = ticketsData
          .filter(t => new Date(t.timestamp).toLocaleDateString('sv-SE') === today)
          .map(t => ({ ...t, customerName: '' }));
        setTodayTickets(todayTicketsFromDB);
      }
    } catch (error) {
      console.error('Error al cargar tickets:', error);
    }
  };

  const loadPayments = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/payments`);
      if (response.ok) {
        const paymentsData = await response.json();
        setPayments(paymentsData);
      }
    } catch (error) {
      console.error('Error al cargar pagos:', error);
    }
  };

  useEffect(() => {
    if (userRole === 'admin') {
      loadSellers();
      loadTickets();
      loadPayments();
    } else if (userRole === 'seller') {
      loadSellers(); // 🔴 Cargar sellers para obtener comisión
      loadTickets();
    }
  }, [userRole]);

  const openResendModal = (ticket) => {
    setResendTicketData({
      ...ticket,
      originalPhone: ticket.customerPhone,
      originalName: ticket.customerName || ''
    });
    setShowResendModal(true);
  };

  const [showResendModal, setShowResendModal] = useState(false);
  const [resendTicketData, setResendTicketData] = useState(null);

  const resendTicket = () => {
    if (!resendTicketData) return;
    const { customerName: name, customerPhone: phone, bets, total, ticketId, seller, timestamp } = resendTicketData;
    let message = `¡Gracias por jugar con Mi Suerte Online${name ? `, ${name}` : ''}! 🍀\n`;
    message += `Tiquete: ${ticketId}\n`;
    message += `Fecha: ${new Date(timestamp).toLocaleString()}\n`;
    message += `Vendedor: ${seller}\n`;
    message += `Total: $${total.toLocaleString()}\n`;
    message += `Detalles de apuestas:\n`;
    bets.forEach((bet, index) => {
      message += `${index + 1}. ${bet.lottery} - ${bet.number} (${bet.digits} cifras) - $${parseInt(bet.amount).toLocaleString()}\n`;
    });
    openWhatsApp(phone, message);
    setShowResendModal(false);
    alert('Ticket reenviado exitosamente');
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mi Suerte Online</h1>
            <p className="text-gray-600">Sistema de Gestión de Tickets</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese su usuario"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese su contraseña"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (userRole === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Mi Suerte Online - Panel Administrador</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Bienvenido, {currentUser.username}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="border-b border-gray-200 mb-8">
            <h2 className="text-xl font-bold text-gray-900">Panel de Administración</h2>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-600">Funcionalidades de administración aún en desarrollo.</p>
          </div>
        </div>
      </div>
    );
  }

  if (userRole === 'seller') {
    const today = getLocalDate();
    const totalSalesToday = todayTickets.reduce((sum, ticket) => sum + (ticket.total || 0), 0);
    const seller = sellers.find(s => s.username === currentUser.username);
    const commissionRate = seller ? seller.commission : 10;
    const commissionAmount = Math.round(totalSalesToday * commissionRate / 100);
    const netAmount = totalSalesToday - commissionAmount;

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Mi Suerte Online - Panel de Venta</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Vendedor: {currentUser.name || currentUser.username}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-6">
              <button
                onClick={() => setActiveTab('create')}
                className={`py-2 px-1 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Crear Apuesta
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`py-2 px-1 font-medium text-sm ${
                  activeTab === 'sales'
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ventas del Día {todayTickets.length > 0 ? `($${totalSalesToday.toLocaleString()})` : `(0)`}
              </button>
              <button
                onClick={() => setActiveTab('close')}
                className={`py-2 px-1 font-medium text-sm ${
                  activeTab === 'close'
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Cierre de Caja
              </button>
            </nav>
          </div>

          {activeTab === 'sales' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ventas del Día</h2>
              
              {todayTickets.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Vendido</p>
                      <p className="text-lg font-bold text-green-700">${totalSalesToday.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Comisión ({commissionRate}%)</p>
                      <p className="text-lg font-bold text-orange-600">${commissionAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monto a Recibir</p>
                      <p className="text-lg font-bold text-blue-700">${netAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {todayTickets.length === 0 ? (
                <p className="text-gray-500">No hay ventas registradas hoy.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lotería</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {todayTickets.map((ticket, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{ticket.ticketId}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{ticket.bets[0]?.lottery || '-'}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{ticket.bets[0]?.number || '-'}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-bold">${ticket.total.toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{ticket.customerName || 'Sin nombre'}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">+57{ticket.customerPhone}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {new Date(ticket.timestamp).toLocaleTimeString('es-CO')}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openResendModal(ticket)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                              >
                                Reenviar
                              </button>
                              <button
                                onClick={() => deleteTicket(ticket._id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Crear Nueva Apuesta</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Lotería</label>
                  <select
                    value={currentBet.lottery}
                    onChange={(e) => setCurrentBet({...currentBet, lottery: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={lotteries.filter(l => l.active).length === 0}
                  >
                    <option value="">Seleccione una lotería</option>
                    {lotteries.filter(l => l.active).map(lottery => (
                      <option key={lottery.id} value={lottery.name}>{lottery.name} - {lottery.time}</option>
                    ))}
                  </select>
                  {lotteries.filter(l => l.active).length === 0 && (
                    <p className="text-red-600 text-sm mt-2">No hay loterías activas en este momento</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad (Cifras)</label>
                  <select
                    value={currentBet.digits}
                    onChange={(e) => {
                      const newDigits = e.target.value;
                      setCurrentBet({
                        ...currentBet, 
                        digits: newDigits,
                        number: currentBet.number.slice(0, parseInt(newDigits))
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="2">2 Cifras</option>
                    <option value="3">3 Cifras</option>
                    <option value="4">4 Cifras</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número Apostado</label>
                  <input
                    type="text"
                    value={currentBet.number}
                    onChange={(e) => handleNumberChange(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Ej: ${'12'.substring(0, parseInt(currentBet.digits))}`}
                    maxLength={parseInt(currentBet.digits)}
                  />
                  <p className="text-sm text-gray-500 mt-1">Debe ingresar exactamente {currentBet.digits} dígito{parseInt(currentBet.digits) > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor de la Apuesta (COP)</label>
                  <input
                    type="number"
                    value={currentBet.amount}
                    onChange={(e) => setCurrentBet({...currentBet, amount: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 5000"
                  />
                  {parseInt(currentBet.digits) === 4 && parseInt(currentBet.amount) > 5000 && (
                    <p className="text-red-600 text-sm mt-2">Máximo $5,000 para 4 cifras</p>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleAddBet}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300 font-semibold"
                >
                  Añadir Apuesta
                </button>
              </div>
            </div>
          )}

          {activeTab === 'close' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cierre de Caja</h2>
              <p className="text-gray-600 mb-6">Genera reportes de cierre por fechas específicas.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={dailyClose}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                >
                  Cierre de Hoy
                </button>
                <button
                  onClick={openDateRangeModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                >
                  Cierre por Rango de Fechas
                </button>
              </div>
            </div>
          )}

          {betList.length > 0 && activeTab === 'create' && (
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Apuestas en el Tiquete</h3>
              <div className="space-y-3">
                {betList.map(bet => (
                  <div key={bet.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{bet.lottery}</p>
                        <p>Número: {bet.number} ({bet.digits} cifras)</p>
                        <p>Valor: ${parseInt(bet.amount).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRemoveBet(bet.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-300"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total: ${betList.reduce((sum, bet) => sum + parseInt(bet.amount), 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Información del Cliente</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Cliente</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Número del Cliente (solo dígitos)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +57
                  </span>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3001234567"
                    maxLength={10}
                  />
                </div>
              </div>
              <button
                onClick={confirmTicket}
                disabled={betList.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
              >
                Generar y Enviar Tiquete
              </button>
            </div>
          )}

          {showConfirmModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Tiquete</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2">Resumen del Tiquete:</h4>
                  <p>Total: ${betList.reduce((sum, bet) => sum + parseInt(bet.amount), 0).toLocaleString()}</p>
                  <p>Número de apuestas: {betList.length}</p>
                  <p>Cliente: {customerName || 'Sin nombre'}</p>
                  <p>Teléfono: +57{customerPhone}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={generateTicket}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-300"
                  >
                    Confirmar y Enviar
                  </button>
                </div>
              </div>
            </div>
          )}

          {showResendModal && resendTicketData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Reenviar Ticket</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Cliente</label>
                  <input
                    type="text"
                    value={resendTicketData.customerName}
                    onChange={(e) => setResendTicketData({...resendTicketData, customerName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre del cliente"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de teléfono (original: +57{resendTicketData.originalPhone})
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +57
                    </span>
                    <input
                      type="tel"
                      value={resendTicketData.customerPhone}
                      onChange={(e) => setResendTicketData({...resendTicketData, customerPhone: e.target.value.replace(/\D/g, '')})}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="3001234567"
                      maxLength={10}
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowResendModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={resendTicket}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-300"
                  >
                    Reenviar
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDateRangeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Rango de Fechas para Cierre</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin</label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowDateRangeModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={generateDateRangeReport}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
                  >
                    Generar Reporte
                  </button>
                </div>
              </div>
            </div>
          )}

          {showPreviewModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">Vista Previa del Reporte</h3>
                  <p className="text-gray-600">Revise el reporte antes de enviarlo por WhatsApp</p>
                </div>
                <div className="p-6">
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto whitespace-pre-wrap">
                    {previewReportData.message}
                  </pre>
                </div>
                <div className="p-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={sendReport}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300"
                    >
                      Enviar por WhatsApp
                    </button>
                    <button
                      onClick={() => setShowPreviewModal(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition duration-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default App;