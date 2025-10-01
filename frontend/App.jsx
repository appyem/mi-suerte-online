import React, { useState, useEffect, useRef } from 'react';

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
  const [adminPhone, setAdminPhone] = useState('3001234567');
  const [showReport, setShowReport] = useState(false);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [payments, setPayments] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [reportType, setReportType] = useState('');
  const [emailToSend, setEmailToSend] = useState('');
  const [showAddSellerModal, setShowAddSellerModal] = useState(false);
  const [newSeller, setNewSeller] = useState({ name: '', username: '', password: '', commission: 10 });
  const [selectedSeller, setSelectedSeller] = useState('');
  const [showResendModal, setShowResendModal] = useState(false);
  const [resendTicketData, setResendTicketData] = useState(null);
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [dateRange, setDateRange] = useState({ start: new Date().toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] });
  const [betMode, setBetMode] = useState('single');
  const [multiLotteries, setMultiLotteries] = useState([]);
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
    const holidays = [
      '01-01', '01-06', '03-19', '05-01', '06-29', '08-15', '10-12', '11-01', '11-11', '12-08', '12-25'
    ];
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const todayStr = `${month}-${day}`;
    return holidays.includes(todayStr);
  };

  const getLotteryTime = (lottery) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const holiday = isHoliday();
    if (holiday && lottery.holidayTime) {
      return lottery.holidayTime;
    } else if (dayOfWeek === 6 && lottery.saturdayTime) {
      return lottery.saturdayTime;
    } else if (dayOfWeek === 0 && lottery.sundayTime) {
      return lottery.sundayTime;
    } else if (lottery.days.includes(dayOfWeek)) {
      return lottery.time;
    }
    return null;
  };

  useEffect(() => {
    const todayLotteries = lotterySchedule.map((lottery, index) => {
      const time = getLotteryTime(lottery);
      if (time) {
        return {
          id: index + 1,
          name: lottery.name,
          time: time,
          active: true
        };
      }
      return null;
    }).filter(lottery => lottery !== null);
    setLotteries(todayLotteries);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHour}:${currentMinute}`;
      setLotteries(prev => prev.map(lottery => {
        const [hour, minute] = lottery.time.split(':');
        const lotteryTime = new Date();
        lotteryTime.setHours(parseInt(hour), parseInt(minute), 0);
        const fiveMinutesBefore = new Date(lotteryTime.getTime() - 5 * 60000);
        const nowTime = new Date();
        return {
          ...lottery,
          active: nowTime < fiveMinutesBefore
        };
      }));
    }, 60000);
    return () => clearInterval(interval);
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
      } else {
        alert(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('Error de conexión. Verifica que el backend esté funcionando.');
    }
  };

  const handleAddBet = () => {
    if (betMode === 'single') {
      if (!currentBet.lottery || !currentBet.number || !currentBet.amount) {
        alert('Complete todos los campos 🎯');
        return;
      }
      const digits = parseInt(currentBet.digits);
      if (currentBet.number.length !== digits) {
        alert(`El número debe tener exactamente ${digits} dígitos 🔢`);
        return;
      }
      const amount = parseInt(currentBet.amount);
      if (digits === 4 && amount > 5000) {
        alert('El chance de 4 cifras tiene un límite máximo de $5,000 COP 💰');
        return;
      }
      if (amount > 20000) {
        const newPendingBet = {
          id: Date.now(),
          seller: currentUser.username,
          ...currentBet,
          status: 'pending',
          timestamp: new Date().toLocaleString()
        };
        setPendingBets([...pendingBets, newPendingBet]);
        alert('Apuesta pendiente de aprobación del administrador ⏳');
      } else {
        setBetList([...betList, { ...currentBet, id: Date.now() }]);
      }
      setCurrentBet({ lottery: '', digits: '2', number: '', amount: '' });
    } else {
      if (multiLotteries.length === 0) {
        alert('Seleccione al menos una lotería 🎫');
        return;
      }
      const { digits, number, amount } = currentBet;
      if (!number || !amount) {
        alert('Complete el número y el monto 💸');
        return;
      }
      const numDigits = parseInt(digits);
      if (number.length !== numDigits) {
        alert(`El número debe tener exactamente ${numDigits} dígitos 🔢`);
        return;
      }
      const betAmount = parseInt(amount);
      if (numDigits === 4 && betAmount > 5000) {
        alert('El chance de 4 cifras tiene un límite máximo de $5,000 COP 💰');
        return;
      }
      const newBets = multiLotteries.map(lotteryName => ({
        lottery: lotteryName,
        digits,
        number,
        amount,
        id: Date.now() + Math.random()
      }));
      if (betAmount > 20000) {
        const pendingBets = newBets.map(bet => ({
          ...bet,
          seller: currentUser.username,
          status: 'pending',
          timestamp: new Date().toLocaleString()
        }));
        setPendingBets([...pendingBets, ...pendingBets]);
        alert('Apuestas pendientes de aprobación del administrador ⏳');
      } else {
        setBetList([...betList, ...newBets]);
      }
      setMultiLotteries([]);
      setCurrentBet({ lottery: '', digits: '2', number: '', amount: '' });
    }
  };

  const handleRemoveBet = (betId) => {
    if (window.confirm('¿Eliminar esta apuesta? 🗑️')) {
      setBetList(betList.filter(bet => bet.id !== betId));
    }
  };

  const handleApproveBet = (betId) => {
    const bet = pendingBets.find(b => b.id === betId);
    if (bet) {
      setBetList([...betList, { ...bet, status: 'approved' }]);
      setPendingBets(pendingBets.filter(b => b.id !== betId));
    }
  };

  const handleRejectBet = (betId) => {
    setPendingBets(pendingBets.filter(b => b.id !== betId));
  };

  const openWhatsApp = (phone, message) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const waUrl = `https://wa.me/57${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const confirmTicket = () => {
    if (betList.length === 0) {
      alert('No hay apuestas para generar el tiquete 🎫');
      return;
    }
    if (!customerPhone) {
      alert('Por favor ingrese el número del cliente 📱');
      return;
    }
    setShowConfirmModal(true);
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
        body: JSON.stringify({
          ticketId: ticket.ticketId,
          seller: ticket.seller,
          bets: ticket.bets,
          total: ticket.total,
          customerPhone: ticket.customerPhone,
          timestamp: ticket.timestamp
        }),
      });
      if (!response.ok) throw new Error('Error al guardar el ticket');

      // ✨ Mensaje de WhatsApp con diseño premium y emoticones
      let message = `🎫 *¡TU TICKET DE LA SUERTE!* 🍀\n`;
      message += `✨ *Mi Suerte Online* ✨\n\n`;
      message += `🆔 *Tiquete:* ${ticket.ticketId}\n`;
      message += `👤 *Vendedor:* ${ticket.seller}\n`;
      message += `📅 *Fecha:* ${new Date(ticket.timestamp).toLocaleString('es-CO')}\n\n`;
      message += `💰 *TOTAL:* $${ticket.total.toLocaleString()} COP\n\n`;
      message += `🎯 *APUESTAS:*\n`;
      ticket.bets.forEach((bet, index) => {
        message += `${index + 1}. ${bet.lottery} - *${bet.number}* (${bet.digits} cifras) - $${parseInt(bet.amount).toLocaleString()}\n`;
      });
      message += `\n🌟 *¡MUCHA SUERTE!* Que los números te sonrían hoy 🍀`;

      openWhatsApp(customerPhone, message);
      setBetList([]);
      setCustomerPhone('');
      setCustomerName('');
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al guardar el ticket. Por favor intenta nuevamente.');
    }
  };

  const deleteTicket = async (ticketId) => {
    if (!window.confirm('¿Eliminar este ticket? Esta acción no se puede deshacer. 🗑️')) {
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
        alert('Ticket eliminado exitosamente ✅');
      } else {
        const errorData = await response.json();
        alert('Error: ' + (errorData.error || 'No se pudo eliminar el ticket'));
      }
    } catch (error) {
      console.error('Error al eliminar ticket:', error);
      alert('Error de conexión al intentar eliminar el ticket');
    }
  };

  const dailyClose = async () => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const response = await fetch(`${BACKEND_URL}/api/tickets?date=${today}&seller=${currentUser.username}`);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const todayTickets = await response.json();
      const totalSales = todayTickets.reduce((sum, ticket) => sum + ticket.total, 0);
      const ticketCount = todayTickets.length;
      if (ticketCount === 0) {
        alert('No hay ventas para el día de hoy 📉');
        return;
      }
      const seller = sellers.find(s => s.username === currentUser.username);
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
        alert('Por favor ingrese un número de teléfono válido (mínimo 10 dígitos) 📱');
        return;
      }
      let reportMessage = `📊 *REPORTE DIARIO - Mi Suerte Online* 📊\n`;
      reportMessage += `📅 *Fecha:* ${new Date().toLocaleDateString('es-CO')}\n`;
      reportMessage += `👤 *Vendedor:* ${currentUser.username}\n`;
      reportMessage += `💰 *Total Ventas:* $${totalSales.toLocaleString()}\n`;
      reportMessage += `🎫 *Número de Tiquetes:* ${ticketCount}\n`;
      reportMessage += `💸 *Comisión (${commissionRate}%):* $${commissionAmount.toLocaleString()}\n`;
      reportMessage += `✅ *Monto a Pagar:* $${netAmount.toLocaleString()}\n\n`;
      reportMessage += `📋 *Detalles de Ventas:*\n`;
      todayTickets.forEach((ticket, index) => {
        reportMessage += `\n🎫 *Tiquete #${index + 1}:* ${ticket.ticketId}\n`;
        reportMessage += `💰 *Total:* $${ticket.total.toLocaleString()}\n`;
        ticket.bets.forEach((bet, betIndex) => {
          reportMessage += `  ${betIndex + 1}. ${bet.lottery} - ${bet.number} - $${parseInt(bet.amount).toLocaleString()}\n`;
        });
      });
      try {
        await fetch(`${BACKEND_URL}/api/payments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            seller: currentUser.username,
            date: new Date().toLocaleDateString('es-CO'),
            totalSales,
            commissionRate,
            commissionAmount,
            netAmount,
            ticketCount
          }),
        });
      } catch (paymentError) {
        console.warn('No se pudo registrar el pago:', paymentError);
      }
      openWhatsApp(reportPhone, reportMessage);
      alert('Reporte diario enviado exitosamente ✅');
    } catch (error) {
      console.error('Error en cierre diario:', error);
      alert(`Error al generar el reporte diario: ${error.message || 'Verifique la conexión'}`);
    }
  };

  const openDateRangeModal = () => {
    const today = new Date().toISOString().split('T')[0];
    setDateRange({ start: today, end: today });
    setShowDateRangeModal(true);
  };

  const generateDateRangeReport = async () => {
    const { start, end } = dateRange;
    if (!start || !end) {
      alert('Seleccione ambas fechas 📅');
      return;
    }
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate > endDate) {
      alert('La fecha de inicio no puede ser mayor que la fecha de fin ⏳');
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/tickets?startDate=${start}&endDate=${end}&seller=${currentUser.username}`);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const ticketsInRange = await response.json();
      const totalSales = ticketsInRange.reduce((sum, ticket) => sum + ticket.total, 0);
      const ticketCount = ticketsInRange.length;
      if (ticketCount === 0) {
        alert(`No hay ventas en el rango de fechas: ${start} al ${end} 📉`);
        return;
      }
      const seller = sellers.find(s => s.username === currentUser.username);
      const commissionRate = seller ? seller.commission : 10;
      const commissionAmount = Math.round(totalSales * commissionRate / 100);
      const netAmount = totalSales - commissionAmount;
      const reportPhone = prompt('Ingrese el número de teléfono para enviar el reporte (solo dígitos):', '');
      if (!reportPhone || reportPhone.trim() === '') return;
      const cleanPhone = reportPhone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        alert('Por favor ingrese un número de teléfono válido (mínimo 10 dígitos) 📱');
        return;
      }
      let reportMessage = `📊 *REPORTE DE CIERRE - Mi Suerte Online* 📊\n`;
      reportMessage += `📅 *Rango:* ${new Date(start).toLocaleDateString('es-CO')} al ${new Date(end).toLocaleDateString('es-CO')}\n`;
      reportMessage += `👤 *Vendedor:* ${currentUser.username}\n`;
      reportMessage += `💰 *Total Ventas:* $${totalSales.toLocaleString()}\n`;
      reportMessage += `🎫 *Número de Tiquetes:* ${ticketCount}\n`;
      reportMessage += `💸 *Comisión (${commissionRate}%):* $${commissionAmount.toLocaleString()}\n`;
      reportMessage += `✅ *Monto a Pagar:* $${netAmount.toLocaleString()}\n\n`;
      reportMessage += `📋 *Detalles de Ventas:*\n`;
      ticketsInRange.forEach((ticket, index) => {
        reportMessage += `\n🎫 *Tiquete #${index + 1}:* ${ticket.ticketId}\n`;
        reportMessage += `📅 *Fecha:* ${new Date(ticket.timestamp).toLocaleDateString('es-CO')}\n`;
        reportMessage += `💰 *Total:* $${ticket.total.toLocaleString()}\n`;
        ticket.bets.forEach((bet, betIndex) => {
          reportMessage += `  ${betIndex + 1}. ${bet.lottery} - ${bet.number} - $${parseInt(bet.amount).toLocaleString()}\n`;
        });
      });
      openWhatsApp(reportPhone, reportMessage);
      alert(`Reporte de cierre generado exitosamente para el rango: ${start} al ${end} ✅`);
      setShowDateRangeModal(false);
    } catch (error) {
      console.error('Error en cierre por rango de fechas:', error);
      alert(`Error al generar el reporte: ${error.message || 'Verifique la conexión'}`);
    }
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
      if (userRole === 'seller') {
        url += `?seller=${currentUser.username}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const ticketsData = await response.json();
        if (userRole === 'admin') {
          setTickets(ticketsData);
        }
        const today = new Date().toISOString().split('T')[0];
        const todayTicketsFromDB = ticketsData
          .filter(t => new Date(t.timestamp).toISOString().split('T')[0] === today)
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
      loadTickets();
    }
  }, [userRole, currentUser]);

  const openResendModal = (ticket) => {
    setResendTicketData({
      ...ticket,
      originalPhone: ticket.customerPhone,
      originalName: ticket.customerName || ''
    });
    setShowResendModal(true);
  };

  const resendTicket = () => {
    if (!resendTicketData) return;
    const { customerName: name, customerPhone: phone, bets, total, ticketId, seller, timestamp } = resendTicketData;
    let message = `🎫 *¡TU TICKET DE LA SUERTE!* 🍀\n`;
    message += `✨ *Mi Suerte Online* ✨\n\n`;
    message += `🆔 *Tiquete:* ${ticketId}\n`;
    message += `👤 *Vendedor:* ${seller}\n`;
    message += `📅 *Fecha:* ${new Date(timestamp).toLocaleString('es-CO')}\n\n`;
    message += `💰 *TOTAL:* $${total.toLocaleString()} COP\n\n`;
    message += `🎯 *APUESTAS:*\n`;
    bets.forEach((bet, index) => {
      message += `${index + 1}. ${bet.lottery} - *${bet.number}* (${bet.digits} cifras) - $${parseInt(bet.amount).toLocaleString()}\n`;
    });
    message += `\n🌟 *¡MUCHA SUERTE!* Que los números te sonrían hoy 🍀`;
    openWhatsApp(phone, message);
    setShowResendModal(false);
    alert('Ticket reenviado exitosamente ✅');
  };

  const toggleSellerStatus = async (sellerId, currentStatus) => {
    try {
      const seller = sellers.find(s => s._id === sellerId);
      if (!seller) return;
      const updatedSeller = { ...seller, active: !currentStatus };
      const response = await fetch(`${BACKEND_URL}/api/sellers/${sellerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSeller),
      });
      if (response.ok) {
        setSellers(sellers.map(s => s._id === sellerId ? { ...s, active: !currentStatus } : s));
        alert(`Vendedor ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`);
      }
    } catch (error) {
      console.error('Error al actualizar vendedor:', error);
      alert('Error al actualizar el vendedor');
    }
  };

  const deleteSeller = async (sellerId) => {
    if (!window.confirm('¿Está seguro que desea eliminar este vendedor? 🗑️')) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/sellers/${sellerId}`, { method: 'DELETE' });
      if (response.ok) {
        setSellers(sellers.filter(s => s._id !== sellerId));
        alert('Vendedor eliminado exitosamente ✅');
      } else {
        alert('Error al eliminar el vendedor');
      }
    } catch (error) {
      console.error('Error al eliminar vendedor:', error);
      alert('Error de conexión al eliminar el vendedor');
    }
  };

  const addNewSeller = async () => {
    if (!newSeller.name || !newSeller.username || !newSeller.password) {
      alert('Por favor complete todos los campos 📝');
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/sellers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSeller),
      });
      if (response.ok) {
        const savedSeller = await response.json();
        setSellers([...sellers, savedSeller]);
        setNewSeller({ name: '', username: '', password: '', commission: 10 });
        setShowAddSellerModal(false);
        alert('Vendedor añadido exitosamente ✅');
      } else {
        const error = await response.json();
        alert('Error al crear vendedor: ' + error.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al crear vendedor');
    }
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🍀</div>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ingrese su contraseña"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-lg"
            >
              Iniciar Sesión 🔒
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (userRole === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-2">📊</span> Mi Suerte Online - Panel Administrador
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Bienvenido, {currentUser.username}</span>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition duration-300 shadow"
                >
                  Cerrar Sesión 🔒
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'dashboard', name: 'Dashboard 📊' },
                { id: 'reports', name: 'Reportes Avanzados 📈' },
                { id: 'sellers', name: 'Gestión Vendedores 👥' },
                { id: 'payments', name: 'Pagos a Vendedores 💸' },
                { id: 'lotteries', name: 'Loterías 🎫' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm p-6 border border-emerald-100">
                <h3 className="text-sm font-medium text-emerald-700 flex items-center">
                  <span className="mr-2">💰</span> Ventas de Hoy
                </h3>
                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  ${tickets.filter(t => 
                    new Date(t.timestamp).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                  ).reduce((sum, ticket) => sum + ticket.total, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm p-6 border border-blue-100">
                <h3 className="text-sm font-medium text-blue-700 flex items-center">
                  <span className="mr-2">🎫</span> Tiquetes de Hoy
                </h3>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {tickets.filter(t => 
                    new Date(t.timestamp).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                  ).length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-sm p-6 border border-amber-100">
                <h3 className="text-sm font-medium text-amber-700 flex items-center">
                  <span className="mr-2">🎁</span> Premios por Pagar
                </h3>
                <p className="mt-2 text-3xl font-bold text-amber-600">$0</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl shadow-sm p-6 border border-fuchsia-100">
                <h3 className="text-sm font-medium text-fuchsia-700 flex items-center">
                  <span className="mr-2">✅</span> Balance de Hoy
                </h3>
                <p className="mt-2 text-3xl font-bold text-fuchsia-600">
                  ${tickets.filter(t => 
                    new Date(t.timestamp).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                  ).reduce((sum, ticket) => sum + ticket.total, 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          {/* Resto del panel de admin con estilo mejorado */}
          {activeTab === 'sellers' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <span className="mr-2">👥</span> Gestión de Vendedores
                </h2>
                <button
                  onClick={() => setShowAddSellerModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition duration-300 shadow"
                >
                  + Añadir Nuevo Vendedor ✨
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contraseña</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comisión</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sellers.map(seller => (
                      <tr key={seller._id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{seller.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{seller.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono bg-gray-50">{seller.password}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{seller.commission}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            seller.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {seller.active ? 'Activo ✅' : 'Inactivo ❌'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => alert('Función de edición en desarrollo')}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Editar ✏️
                          </button>
                          <button 
                            onClick={() => toggleSellerStatus(seller._id, seller.active)}
                            className={`px-3 py-1 rounded text-sm transition duration-300 ${
                              seller.active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                            } text-white`}
                          >
                            {seller.active ? 'Desactivar ⛔' : 'Activar ✅'}
                          </button>
                          <button 
                            onClick={() => deleteSeller(seller._id)}
                            className="text-red-600 hover:text-red-900 ml-3"
                          >
                            Eliminar 🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* Otros tabs del admin con estilo mejorado */}
        </div>
        {/* Modales con estilo mejorado */}
        {showAddSellerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">✨</span> Añadir Nuevo Vendedor
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    value={newSeller.name}
                    onChange={(e) => setNewSeller({...newSeller, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ingrese el nombre del vendedor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de Usuario</label>
                  <input
                    type="text"
                    value={newSeller.username}
                    onChange={(e) => setNewSeller({...newSeller, username: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ingrese el nombre de usuario"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={newSeller.password}
                    onChange={(e) => setNewSeller({...newSeller, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ingrese la contraseña"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comisión (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={newSeller.commission}
                    onChange={(e) => setNewSeller({...newSeller, commission: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0-50"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddSellerModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition duration-300"
                >
                  Cancelar ❌
                </button>
                <button
                  onClick={addNewSeller}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg transition duration-300 shadow"
                >
                  Añadir Vendedor ✅
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (userRole === 'seller') {
    const today = new Date().toISOString().split('T')[0];
    const totalSalesToday = todayTickets.reduce((sum, ticket) => sum + (ticket.total || 0), 0);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-2">🎫</span> Mi Suerte Online - Panel de Venta
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Vendedor: {currentUser.name || currentUser.username}</span>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition duration-300 shadow"
                >
                  Cerrar Sesión 🔒
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
                className={`py-2 px-1 font-medium text-sm flex items-center ${
                  activeTab === 'create'
                    ? 'text-purple-600 border-b-2 border-purple-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-1">🎯</span> Crear Apuesta
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`py-2 px-1 font-medium text-sm flex items-center ${
                  activeTab === 'sales'
                    ? 'text-purple-600 border-b-2 border-purple-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-1">🎫</span> Ventas del Día {todayTickets.length > 0 ? `($${totalSalesToday.toLocaleString()})` : `(0)`}
              </button>
              <button
                onClick={() => setActiveTab('close')}
                className={`py-2 px-1 font-medium text-sm flex items-center ${
                  activeTab === 'close'
                    ? 'text-purple-600 border-b-2 border-purple-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-1">📊</span> Cierre de Caja
              </button>
            </nav>
          </div>

          {activeTab === 'sales' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🎫</span> Ventas del Día
              </h2>
              {todayTickets.length === 0 ? (
                <p className="text-gray-500 flex items-center">
                  <span className="mr-2">📭</span> No hay ventas registradas hoy.
                </p>
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
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-emerald-600 font-bold">${ticket.total.toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{ticket.customerName || 'Sin nombre'}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">+57{ticket.customerPhone}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {new Date(ticket.timestamp).toLocaleTimeString('es-CO')}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openResendModal(ticket)}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-1 rounded text-xs shadow"
                              >
                                Reenviar 📤
                              </button>
                              <button
                                onClick={() => deleteTicket(ticket._id)}
                                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-3 py-1 rounded text-xs shadow"
                              >
                                Eliminar 🗑️
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
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🎯</span> Crear Nueva Apuesta
              </h2>
              <div className="mb-4 flex space-x-4">
                <button
                  onClick={() => setBetMode('single')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                    betMode === 'single'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className="mr-1">🎫</span> Apuesta Individual
                </button>
                <button
                  onClick={() => setBetMode('multiple')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                    betMode === 'multiple'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className="mr-1">🎟️</span> Apuesta Múltiple
                </button>
              </div>
              {/* Resto del formulario con estilo mejorado */}
              {betMode === 'single' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="mr-1">🎫</span> Seleccionar Lotería
                    </label>
                    <select
                      value={currentBet.lottery}
                      onChange={(e) => setCurrentBet({...currentBet, lottery: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled={lotteries.filter(l => l.active).length === 0}
                    >
                      <option value="">Seleccione una lotería</option>
                      {lotteries.filter(l => l.active).map(lottery => (
                        <option key={lottery.id} value={lottery.name}>{lottery.name} - {lottery.time}</option>
                      ))}
                    </select>
                    {lotteries.filter(l => l.active).length === 0 && (
                      <p className="text-red-600 text-sm mt-2 flex items-center">
                        <span className="mr-1">⏰</span> No hay loterías activas en este momento
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="mr-1">🔢</span> Modalidad (Cifras)
                    </label>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="2">2 Cifras</option>
                      <option value="3">3 Cifras</option>
                      <option value="4">4 Cifras</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="mr-1">🔢</span> Número Apostado
                    </label>
                    <input
                      type="text"
                      value={currentBet.number}
                      onChange={(e) => handleNumberChange(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={`Ej: ${'12'.substring(0, parseInt(currentBet.digits))}`}
                      maxLength={parseInt(currentBet.digits)}
                    />
                    <p className="text-sm text-gray-500 mt-1">Debe ingresar exactamente {currentBet.digits} dígito{parseInt(currentBet.digits) > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="mr-1">💰</span> Valor de la Apuesta (COP)
                    </label>
                    <input
                      type="number"
                      value={currentBet.amount}
                      onChange={(e) => setCurrentBet({...currentBet, amount: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ej: 5000"
                    />
                    {parseInt(currentBet.amount) > 20000 && (
                      <p className="text-yellow-600 text-sm mt-2 flex items-center">
                        <span className="mr-1">⏳</span> Esta apuesta requiere aprobación del administrador
                      </p>
                    )}
                    {parseInt(currentBet.digits) === 4 && parseInt(currentBet.amount) > 5000 && (
                      <p className="text-red-600 text-sm mt-2 flex items-center">
                        <span className="mr-1">⚠️</span> Máximo $5,000 para 4 cifras
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="mr-1">🎫</span> Seleccionar Loterías
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                      {lotteries.filter(l => l.active).map(lottery => (
                        <label key={lottery.name} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={multiLotteries.includes(lottery.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setMultiLotteries([...multiLotteries, lottery.name]);
                              } else {
                                setMultiLotteries(multiLotteries.filter(name => name !== lottery.name));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{lottery.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <span className="mr-1">🔢</span> Modalidad
                      </label>
                      <select
                        value={currentBet.digits}
                        onChange={(e) => setCurrentBet({...currentBet, digits: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="2">2 Cifras</option>
                        <option value="3">3 Cifras</option>
                        <option value="4">4 Cifras</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <span className="mr-1">🔢</span> Número
                      </label>
                      <input
                        type="text"
                        value={currentBet.number}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length <= parseInt(currentBet.digits)) {
                            setCurrentBet({...currentBet, number: val});
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                        placeholder="Ej: 12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <span className="mr-1">💰</span> Monto por Lotería
                      </label>
                      <input
                        type="number"
                        value={currentBet.amount}
                        onChange={(e) => setCurrentBet({...currentBet, amount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                        placeholder="Ej: 2000"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-6">
                <button
                  onClick={handleAddBet}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition duration-300 font-semibold shadow-lg"
                >
                  {betMode === 'single' ? 'Añadir Apuesta ✨' : `Añadir ${multiLotteries.length} Apuestas ✨`}
                </button>
              </div>
            </div>
          )}

          {betList.length > 0 && activeTab === 'create' && (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-sm p-6 mt-6 border border-purple-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🎫</span> Apuestas en el Tiquete
              </h3>
              <div className="space-y-3">
                {betList.map(bet => (
                  <div key={bet.id} className="border border-purple-200 rounded-lg p-4 bg-white/80 backdrop-blur-sm">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-purple-700">{bet.lottery}</p>
                        <p>Número: <span className="font-bold">{bet.number}</span> ({bet.digits} cifras)</p>
                        <p>Valor: <span className="font-bold text-emerald-600">$${parseInt(bet.amount).toLocaleString()}</span></p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {bet.status === 'pending' && (
                          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 flex items-center">
                            <span className="mr-1">⏳</span> Pendiente
                          </span>
                        )}
                        <button
                          onClick={() => handleRemoveBet(bet.id)}
                          className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-3 py-1 rounded text-sm transition duration-300 shadow"
                        >
                          Eliminar 🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-purple-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-purple-700 flex items-center">
                    <span className="mr-1">💰</span> Total: ${betList.reduce((sum, bet) => sum + parseInt(bet.amount), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📱</span> Información del Cliente
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span className="mr-1">👤</span> Nombre del Cliente
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span className="mr-1">📱</span> Número del Cliente (solo dígitos)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +57
                  </span>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="3001234567"
                    maxLength={10}
                  />
                </div>
              </div>
              <button
                onClick={confirmTicket}
                disabled={betList.length === 0}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-lg"
              >
                Generar y Enviar Tiquete 🎫
              </button>
            </div>
          )}

          {activeTab === 'close' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📊</span> Cierre de Caja
              </h2>
              <p className="text-gray-600 mb-6">Genera reportes de cierre por fechas específicas.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={dailyClose}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow"
                >
                  Cierre de Hoy 📅
                </button>
                <button
                  onClick={openDateRangeModal}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow"
                >
                  Cierre por Rango de Fechas 📆
                </button>
              </div>
            </div>
          )}

          {/* Modales con estilo mejorado */}
          {showConfirmModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🎫</span> Confirmar Tiquete
                </h3>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border border-emerald-100">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <span className="mr-1">📋</span> Resumen del Tiquete:
                  </h4>
                  <p><span className="font-bold">Total:</span> ${betList.reduce((sum, bet) => sum + parseInt(bet.amount), 0).toLocaleString()}</p>
                  <p><span className="font-bold">Número de apuestas:</span> {betList.length}</p>
                  <p><span className="font-bold">Cliente:</span> {customerName || 'Sin nombre'}</p>
                  <p><span className="font-bold">Teléfono:</span> +57{customerPhone}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition duration-300"
                  >
                    Cancelar ❌
                  </button>
                  <button
                    onClick={generateTicket}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 px-4 rounded-lg transition duration-300 shadow"
                  >
                    Confirmar y Enviar ✅
                  </button>
                </div>
              </div>
            </div>
          )}

          {showResendModal && resendTicketData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📤</span> Reenviar Ticket
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <span className="mr-1">👤</span> Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    value={resendTicketData.customerName}
                    onChange={(e) => setResendTicketData({...resendTicketData, customerName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nombre del cliente"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <span className="mr-1">📱</span> Número de teléfono (original: +57{resendTicketData.originalPhone})
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +57
                    </span>
                    <input
                      type="tel"
                      value={resendTicketData.customerPhone}
                      onChange={(e) => setResendTicketData({...resendTicketData, customerPhone: e.target.value.replace(/\D/g, '')})}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    Cancelar ❌
                  </button>
                  <button
                    onClick={resendTicket}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 px-4 rounded-lg transition duration-300 shadow"
                  >
                    Reenviar ✅
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDateRangeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📅</span> Rango de Fechas para Cierre
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="mr-1">📆</span> Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="mr-1">📆</span> Fecha de Fin
                    </label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowDateRangeModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition duration-300"
                  >
                    Cancelar ❌
                  </button>
                  <button
                    onClick={generateDateRangeReport}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-2 px-4 rounded-lg transition duration-300 shadow"
                  >
                    Generar Reporte ✅
                  </button>
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