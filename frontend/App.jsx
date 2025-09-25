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
  const [adminPhone, setAdminPhone] = useState('3001234567');
  const [showReport, setShowReport] = useState(false);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [payments, setPayments] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [reportType, setReportType] = useState('');
  const [emailToSend, setEmailToSend] = useState('');
  const [showAddSellerModal, setShowAddSellerModal] = useState(false);
  const [newSeller, setNewSeller] = useState({ name: '', username: '', password: '', commission: 10 });
  const [selectedSeller, setSelectedSeller] = useState('');
  const reportRef = useRef();

  // URL del backend (AJUSTA ESTA URL CON TU URL REAL DE RENDER)
  const BACKEND_URL = 'https://mi-suerte-online-backend.onrender.com';

  // Definir todas las loterías con sus horarios
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

  // Función para determinar si hoy es festivo (simulado)
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

  // Función para obtener el horario correcto según el día y si es festivo
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

  // Inicializar loterías
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

  // Simular verificación de tiempo para cerrar loterías
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

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUserRole(data.role);
        setCurrentUser({ username: data.username, role: data.role });
        setShowLogin(false);
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
      alert('Por favor complete todos los campos');
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
    
    if (amount > 20000) {
      const newPendingBet = {
        id: Date.now(),
        seller: currentUser.username,
        ...currentBet,
        status: 'pending',
        timestamp: new Date().toLocaleString()
      };
      setPendingBets([...pendingBets, newPendingBet]);
      alert('Apuesta pendiente de aprobación del administrador');
    } else {
      setBetList([...betList, { ...currentBet, id: Date.now() }]);
    }
    
    setCurrentBet({ lottery: '', digits: '2', number: '', amount: '' });
  };

  const handleRemoveBet = (betId) => {
    if (window.confirm('¿Está seguro que desea eliminar esta apuesta?')) {
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
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
      });
      
      if (!response.ok) {
        throw new Error('Error al guardar el ticket');
      }
      
      const savedTicket = await response.json();
      setTickets(prev => [...prev, savedTicket]);
      
      const sendMethod = window.confirm('¿Enviar ticket por WhatsApp (Aceptar) o por SMS (Cancelar)?');
      
      let message = `¡Gracias por jugar con Mi Suerte Online! 🍀\n\n`;
      message += `Tiquete: ${ticket.ticketId}\n`;
      message += `Fecha: ${new Date(ticket.timestamp).toLocaleString()}\n`;
      message += `Vendedor: ${ticket.seller}\n`;
      message += `Total: $${ticket.total.toLocaleString()}\n\n`;
      message += `Detalles de apuestas:\n`;
      
      ticket.bets.forEach((bet, index) => {
        message += `${index + 1}. ${bet.lottery} - ${bet.number} (${bet.digits} cifras) - $${parseInt(bet.amount).toLocaleString()}\n`;
      });
      
      const cleanPhone = customerPhone.replace(/\D/g, '');
      
      if (sendMethod) {
        window.open(`https://wa.me/57${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
      } else {
        // SMS para móviles
        const smsLink = document.createElement('a');
        smsLink.href = `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;
        smsLink.style.display = 'none';
        document.body.appendChild(smsLink);
        smsLink.click();
        document.body.removeChild(smsLink);
      }
      
      setBetList([]);
      setCustomerPhone('');
      alert('¡Ticket generado y guardado exitosamente!');
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al guardar el ticket. Por favor intenta nuevamente.');
    }
  };

  const dailyClose = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/tickets?date=${today}&seller=${currentUser.username}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const todayTickets = await response.json();
      const totalSales = todayTickets.reduce((sum, ticket) => sum + ticket.total, 0);
      const ticketCount = todayTickets.length;
      
      if (ticketCount === 0) {
        alert('No hay ventas para el día de hoy');
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
        alert('Por favor ingrese un número de teléfono válido (mínimo 10 dígitos)');
        return;
      }
      
      let reportMessage = `REPORTE DIARIO - Mi Suerte Online 📊\n\n`;
      reportMessage += `Fecha: ${new Date().toLocaleDateString('es-CO')}\n`;
      reportMessage += `Vendedor: ${currentUser.username}\n`;
      reportMessage += `Total Ventas: $${totalSales.toLocaleString()}\n`;
      reportMessage += `Número de Tiquetes: ${ticketCount}\n`;
      reportMessage += `Comisión (${commissionRate}%): $${commissionAmount.toLocaleString()}\n`;
      reportMessage += `Monto a Pagar: $${netAmount.toLocaleString()}\n\n`;
      reportMessage += `Detalles de Ventas:\n`;
      
      todayTickets.forEach((ticket, index) => {
        reportMessage += `\nTiquete #${index + 1}: ${ticket.ticketId}\n`;
        reportMessage += `Total: $${ticket.total.toLocaleString()}\n`;
        ticket.bets.forEach((bet, betIndex) => {
          reportMessage += `  ${betIndex + 1}. ${bet.lottery} - ${bet.number} - $${parseInt(bet.amount).toLocaleString()}\n`;
        });
      });
      
      try {
        await fetch(`${BACKEND_URL}/api/payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
      
      window.open(`https://wa.me/57${cleanPhone}?text=${encodeURIComponent(reportMessage)}`, '_blank');
      alert('Reporte diario enviado exitosamente');
    } catch (error) {
      console.error('Error en cierre diario:', error);
      alert(`Error al generar el reporte diario: ${error.message || 'Verifique la conexión'}`);
    }
  };

  const logout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setShowLogin(true);
    setUsername('');
    setPassword('');
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
      const response = await fetch(`${BACKEND_URL}/api/tickets`);
      if (response.ok) {
        const ticketsData = await response.json();
        setTickets(ticketsData);
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
  }, [userRole]);

  // FUNCIONES CORREGIDAS PARA VENDEDORES
  const toggleSellerStatus = async (sellerId, currentStatus) => {
    try {
      const seller = sellers.find(s => s._id === sellerId);
      if (!seller) return;
      
      const updatedSeller = { ...seller, active: !currentStatus };
      
      const response = await fetch(`${BACKEND_URL}/api/sellers/${sellerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSeller),
      });
      
      if (response.ok) {
        setSellers(sellers.map(s => 
          s._id === sellerId ? { ...s, active: !currentStatus } : s
        ));
        alert(`Vendedor ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`);
      }
    } catch (error) {
      console.error('Error al actualizar vendedor:', error);
      alert('Error al actualizar el vendedor');
    }
  };

  const deleteSeller = async (sellerId) => {
    if (!window.confirm('¿Está seguro que desea eliminar este vendedor?')) {
      return;
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/sellers/${sellerId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSellers(sellers.filter(s => s._id !== sellerId));
        alert('Vendedor eliminado exitosamente');
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
      alert('Por favor complete todos los campos');
      return;
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/sellers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSeller),
      });
      
      if (response.ok) {
        const savedSeller = await response.json();
        setSellers([...sellers, savedSeller]);
        setNewSeller({ name: '', username: '', password: '', commission: 10 });
        setShowAddSellerModal(false);
        alert('Vendedor añadido exitosamente');
      } else {
        const error = await response.json();
        alert('Error al crear vendedor: ' + error.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al crear vendedor');
    }
  };

  // FUNCIONES DE REPORTES CORREGIDAS
  const getMostPlayedNumbers = () => {
    const numberCount = {};
    tickets.forEach(ticket => {
      ticket.bets.forEach(bet => {
        const key = `${bet.number} (${bet.digits} cifras)`;
        numberCount[key] = (numberCount[key] || 0) + 1;
      });
    });
    return Object.entries(numberCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([number, count]) => ({ number, count }));
  };

  const getTopSellers = () => {
    const sellerSales = {};
    tickets.forEach(ticket => {
      sellerSales[ticket.seller] = (sellerSales[ticket.seller] || 0) + ticket.total;
    });
    return Object.entries(sellerSales)
      .sort((a, b) => b[1] - a[1])
      .map(([seller, sales]) => ({
        seller,
        sales,
        name: sellers.find(s => s.username === seller)?.name || seller
      }));
  };

  const getSellerPayments = () => {
    const paymentSummary = {};
    payments.forEach(payment => {
      if (!paymentSummary[payment.seller]) {
        paymentSummary[payment.seller] = {
          seller: payment.seller,
          name: sellers.find(s => s.username === payment.seller)?.name || payment.seller,
          totalSales: 0,
          totalCommission: 0,
          totalNet: 0,
          payments: 0
        };
      }
      paymentSummary[payment.seller].totalSales += payment.totalSales;
      paymentSummary[payment.seller].totalCommission += payment.commissionAmount;
      paymentSummary[payment.seller].totalNet += payment.netAmount;
      paymentSummary[payment.seller].payments += 1;
    });
    return Object.values(paymentSummary);
  };

  const generateDetailedReport = async (type, date = new Date().toISOString().split('T')[0]) => {
    if (!type) {
      alert('Seleccione un tipo de reporte');
      return;
    }
    
    try {
      let url = `${BACKEND_URL}/api/reports?type=${type}&date=${date}`;
      if (selectedSeller) {
        url += `&seller=${selectedSeller}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al generar el reporte');
      }
      
      const reportData = await response.json();
      setCurrentReport(reportData);
      setReportType(type);
      setShowReportModal(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el reporte: ' + error.message);
    }
  };

  const downloadReport = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(currentReport, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const sendByWhatsApp = () => {
    if (!currentReport) return;
    
    let message = '';
    if (reportType === 'sales') {
      message = `*${currentReport.title}*\nPeríodo: ${currentReport.period}\n\nVENTAS TOTALES: $${currentReport.totalSales}\nTIQUETES: ${currentReport.ticketCount}\n`;
    } else if (reportType === 'payments') {
      message = `*${currentReport.title}*\nPeríodo: ${currentReport.period}\n\nTOTAL PAGADO: $${currentReport.totalPaid}\nCOMISIÓN TOTAL: $${currentReport.totalCommission}\n`;
    }
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const sendByEmail = () => {
    if (!currentReport || !emailToSend) return;
    
    let subject = `Reporte ${reportType === 'sales' ? 'de Ventas' : 'de Pagos'} - Mi Suerte Online`;
    let body = JSON.stringify(currentReport, null, 2);
    
    window.open(`mailto:${emailToSend}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  // COMPONENTES DE LOGIN Y PANEL
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
            <nav className="flex space-x-8">
              {[
                { id: 'dashboard', name: 'Dashboard' },
                { id: 'reports', name: 'Reportes Avanzados' },
                { id: 'sellers', name: 'Gestión Vendedores' },
                { id: 'payments', name: 'Pagos a Vendedores' },
                { id: 'lotteries', name: 'Loterías' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500">Ventas de Hoy</h3>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  ${tickets.filter(t => 
                    new Date(t.timestamp).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                  ).reduce((sum, ticket) => sum + ticket.total, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500">Tiquetes de Hoy</h3>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {tickets.filter(t => 
                    new Date(t.timestamp).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                  ).length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500">Premios por Pagar</h3>
                <p className="mt-2 text-3xl font-bold text-orange-600">$0</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500">Balance de Hoy</h3>
                <p className="mt-2 text-3xl font-bold text-purple-600">
                  ${tickets.filter(t => 
                    new Date(t.timestamp).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                  ).reduce((sum, ticket) => sum + ticket.total, 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Reportes Avanzados */}
          {activeTab === 'reports' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Generador de Reportes</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Reporte</label>
                    <select
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccione un tipo de reporte</option>
                      <option value="sales">Reporte de Ventas</option>
                      <option value="payments">Reporte de Pagos a Vendedores</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Específica</label>
                    <input
                      type="date"
                      value={reportDate}
                      onChange={(e) => setReportDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendedor (Opcional)</label>
                    <select
                      value={selectedSeller}
                      onChange={(e) => setSelectedSeller(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todos los vendedores</option>
                      {sellers.map(seller => (
                        <option key={seller._id} value={seller.username}>{seller.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => generateDetailedReport(reportType, reportDate)}
                  disabled={!reportType}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
                >
                  Generar Reporte
                </button>
              </div>
            </div>
          )}

          {/* Gestión de Vendedores - CORREGIDO */}
          {activeTab === 'sellers' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Gestión de Vendedores</h2>
                <button
                  onClick={() => setShowAddSellerModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                  + Añadir Nuevo Vendedor
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
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
                        <td className="px-6 py-4 whitespace-nowrap">{seller.commission}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            seller.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {seller.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => alert('Función de edición en desarrollo')}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => toggleSellerStatus(seller._id, seller.active)}
                            className={`px-3 py-1 rounded text-sm transition duration-300 ${
                              seller.active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                            } text-white`}
                          >
                            {seller.active ? 'Desactivar' : 'Activar'}
                          </button>
                          <button 
                            onClick={() => deleteSeller(seller._id)}
                            className="text-red-600 hover:text-red-900 ml-3"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Resto de componentes... */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pagos a Vendedores</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ventas Totales</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comisión Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto a Pagar</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getSellerPayments().map((payment, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{payment.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-green-600">${payment.totalSales.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-orange-600">${payment.totalCommission.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-bold">${payment.totalNet.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'lotteries' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Gestión de Loterías (Hoy)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lotteries.map(lottery => (
                      <tr key={lottery.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{lottery.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{lottery.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            lottery.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {lottery.active ? 'Activa' : 'Cerrada'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modales */}
        {showReportModal && currentReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">{currentReport.title}</h3>
                <p className="text-gray-600">Período: {currentReport.period}</p>
              </div>
              <div className="p-6">
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(currentReport, null, 2)}
                </pre>
              </div>
              <div className="p-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={downloadReport}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
                  >
                    Descargar
                  </button>
                  <button
                    onClick={sendByWhatsApp}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300"
                  >
                    Enviar por WhatsApp
                  </button>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition duration-300"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddSellerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Añadir Nuevo Vendedor</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    value={newSeller.name}
                    onChange={(e) => setNewSeller({...newSeller, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingrese el nombre del vendedor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de Usuario</label>
                  <input
                    type="text"
                    value={newSeller.username}
                    onChange={(e) => setNewSeller({...newSeller, username: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingrese el nombre de usuario"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={newSeller.password}
                    onChange={(e) => setNewSeller({...newSeller, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0-50"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddSellerModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition duration-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={addNewSeller}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
                >
                  Añadir Vendedor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Panel de vendedor (similar al anterior, omitido por brevedad)
  if (userRole === 'seller') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Mi Suerte Online - Panel de Venta</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Vendedor: {currentUser.username}</span>
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Sale Panel */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Crear Nueva Apuesta</h2>
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
                {parseInt(currentBet.amount) > 20000 && (
                  <p className="text-yellow-600 text-sm mt-2">Esta apuesta requiere aprobación del administrador</p>
                )}
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
                Añadir Apuesta al Tiquete
              </button>
            </div>
          </div>

          {betList.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
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
                        {bet.status === 'pending' && (
                          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pendiente
                          </span>
                        )}
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

          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Información del Cliente</h3>
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

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Cierre de Caja Diario</h3>
            <p className="text-gray-600 mb-4">Envía un reporte resumido del día al administrador por WhatsApp con el desglose de comisiones.</p>
            {(() => {
              const seller = sellers.find(s => s.username === currentUser.username);
              if (seller) {
                return (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Tu comisión: {seller.commission}%</p>
                  </div>
                );
              }
              return null;
            })()}
            <button
              onClick={dailyClose}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Realizar Cierre del Día
            </button>
          </div>

          {showConfirmModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Tiquete</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2">Resumen del Tiquete:</h4>
                  <p>Total: ${betList.reduce((sum, bet) => sum + parseInt(bet.amount), 0).toLocaleString()}</p>
                  <p>Número de apuestas: {betList.length}</p>
                  <p>Número de cliente: +57{customerPhone}</p>
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
        </div>
      </div>
    );
  }

  return null;
};

export default App;