¡Claro! Aquí tienes el código completo de `App.jsx` con todas las funcionalidades y actualizaciones que hemos implementado:

```jsx
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
  const [reportFilter, setReportFilter] = useState(new Date().toISOString().split('T')[0]);
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

  // Inicializar loterías con sus horarios actuales
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

  // Simular verificación de tiempo para cerrar loterías 5 minutos antes
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
      const response = await fetch('https://mi-suerte-online-backend.onrender.com/api/login', {
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

  // Función para cargar vendedores del backend
  const loadSellers = async () => {
    try {
      const response = await fetch('https://mi-suerte-online-backend.onrender.com/api/sellers');
      if (response.ok) {
        const sellersData = await response.json();
        setSellers(sellersData);
      }
    } catch (error) {
      console.error('Error al cargar vendedores:', error);
    }
  };

  // Cargar tickets del backend
  const loadTickets = async () => {
    try {
      const response = await fetch('https://mi-suerte-online-backend.onrender.com/api/tickets');
      if (response.ok) {
        const ticketsData = await response.json();
        setTickets(ticketsData);
      }
    } catch (error) {
      console.error('Error al cargar tickets:', error);
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
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
      audio.play();
    }
  };

  const handleRejectBet = (betId) => {
    setPendingBets(pendingBets.filter(b => b.id !== betId));
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alert-quick-chime-766.mp3');
    audio.play();
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
      const response = await fetch('https://mi-suerte-online-backend.onrender.com/api/tickets', {
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
      
      let message = `¡Gracias por jugar con Mi Suerte Online! 🍀\n\n`;
      message += `Tiquete: ${ticket.ticketId}\n`;
      message += `Fecha: ${new Date(ticket.timestamp).toLocaleString()}\n`;
      message += `Vendedor: ${ticket.seller}\n`;
      message += `Total: $${ticket.total.toLocaleString()}\n\n`;
      message += `Detalles de apuestas:\n`;
      
      ticket.bets.forEach((bet, index) => {
        message += `${index + 1}. ${bet.lottery} - ${bet.number} (${bet.digits} cifras) - $${parseInt(bet.amount).toLocaleString()}\n`;
      });
      
      const fullPhoneNumber = customerPhone.startsWith('3') ? `57${customerPhone}` : `573${customerPhone}`;
      
      const sendMethod = window.confirm('¿Enviar ticket por WhatsApp (Aceptar) o por SMS (Cancelar)?');
      
      if (sendMethod) {
        window.open(`https://wa.me/${fullPhoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
      } else {
        window.open(`sms:${fullPhoneNumber}?body=${encodeURIComponent(message)}`, '_blank');
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
    const today = new Date().toLocaleDateString('es-CO');
    
    try {
      const response = await fetch(`https://mi-suerte-online-backend.onrender.com/api/tickets?date=${today}&seller=${currentUser.username}`);
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
      
      const reportPhone = prompt('Ingrese el número de teléfono para enviar el reporte (solo dígitos):', adminPhone.replace('+57', ''));
      if (!reportPhone) {
        alert('Operación cancelada');
        return;
      }
      
      let reportMessage = `REPORTE DIARIO - Mi Suerte Online 📊\n\n`;
      reportMessage += `Fecha: ${today}\n`;
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
      
      const paymentResponse = await fetch('https://mi-suerte-online-backend.onrender.com/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seller: currentUser.username,
          date: today,
          totalSales,
          commissionRate,
          commissionAmount,
          netAmount,
          ticketCount
        }),
      });
      
      if (paymentResponse.ok) {
        const payment = await paymentResponse.json();
        setPayments(prev => [...prev, payment]);
      }
      
      const adminFullPhone = reportPhone.startsWith('3') ? `57${reportPhone}` : `573${reportPhone}`;
      window.open(`https://wa.me/${adminFullPhone}?text=${encodeURIComponent(reportMessage)}`, '_blank');
      
      alert('Reporte diario enviado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el reporte diario');
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

  const updateSellerCommission = (sellerId, commission) => {
    setSellers(sellers.map(seller => 
      seller.id === sellerId ? {...seller, commission: parseInt(commission)} : seller
    ));
    alert(`Comisión actualizada a ${commission}% para ${sellers.find(s => s.id === sellerId)?.name}`);
  };

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
      let url = `https://mi-suerte-online-backend.onrender.com/api/reports?type=${type}&date=${date}`;
      if (selectedSeller) {
        url += `&seller=${selectedSeller}`;
      }
      
      const response = await fetch(url);
      const reportData = await response.json();
      
      setCurrentReport(reportData);
      setReportType(type);
      setShowReportModal(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el reporte');
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
    let message = '';
    
    if (reportType === 'sales') {
      message = `*${currentReport.title}*\n`;
      message += `Período: ${currentReport.period}\n\n`;
      message += `VENTAS TOTALES: $${currentReport.totalSales}\n`;
      message += `TIQUETES: ${currentReport.ticketCount}\n\n`;
      message += `*VENDEDORES TOP:*\n`;
      currentReport.sellers.forEach((seller, index) => {
        message += `${index + 1}. ${seller.name}: $${seller.sales} (${seller.tickets} tiquetes)\n`;
      });
      message += `\n*NÚMEROS MÁS JUGADOS:*\n`;
      currentReport.mostPlayedNumbers.forEach((item, index) => {
        message += `${index + 1}. ${item.number}: ${item.count} veces\n`;
      });
    } else if (reportType === 'payments') {
      message = `*${currentReport.title}*\n`;
      message += `Período: ${currentReport.period}\n\n`;
      message += `TOTAL PAGADO: $${currentReport.totalPaid}\n`;
      message += `COMISIÓN TOTAL: $${currentReport.totalCommission}\n`;
      message += `PAGOS REALIZADOS: ${currentReport.paymentCount}\n\n`;
      message += `*DETALLE POR VENDEDOR:*\n`;
      currentReport.sellers.forEach((seller, index) => {
        message += `${index + 1}. ${seller.name}:\n`;
        message += `   - Pagado: $${seller.paid}\n`;
        message += `   - Comisión: $${seller.commission}\n`;
        message += `   - Pagos: ${seller.payments}\n\n`;
      });
    }
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const sendByEmail = () => {
    let subject = `Reporte ${reportType === 'sales' ? 'de Ventas' : 'de Pagos'} - Mi Suerte Online`;
    let body = '';
    
    if (reportType === 'sales') {
      body = `Reporte de Ventas\n`;
      body += `Período: ${currentReport.period}\n\n`;
      body += `Ventas Totales: $${currentReport.totalSales}\n`;
      body += `Tiquetes: ${currentReport.ticketCount}\n\n`;
      body += `Vendedores Top:\n`;
      currentReport.sellers.forEach((seller, index) => {
        body += `${index + 1}. ${seller.name}: $${seller.sales} (${seller.tickets} tiquetes)\n`;
      });
      body += `\nNúmeros Más Jugados:\n`;
      currentReport.mostPlayedNumbers.forEach((item, index) => {
        body += `${index + 1}. ${item.number}: ${item.count} veces\n`;
      });
    } else if (reportType === 'payments') {
      body = `Reporte de Pagos a Vendedores\n`;
      body += `Período: ${currentReport.period}\n\n`;
      body += `Total Pagado: $${currentReport.totalPaid}\n`;
      body += `Comisión Total: $${currentReport.totalCommission}\n`;
      body += `Pagos Realizados: ${currentReport.paymentCount}\n\n`;
      body += `Detalle por Vendedor:\n`;
      currentReport.sellers.forEach((seller, index) => {
        body += `${index + 1}. ${seller.name}:\n`;
        body += `   - Pagado: $${seller.paid}\n`;
        body += `   - Comisión: $${seller.commission}\n`;
        body += `   - Pagos: ${seller.payments}\n\n`;
      });
    }
    
    window.open(`mailto:${emailToSend}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const addNewSeller = async () => {
    if (!newSeller.name || !newSeller.username || !newSeller.password) {
      alert('Por favor complete todos los campos');
      return;
    }
    
    try {
      const response = await fetch('https://mi-suerte-online-backend.onrender.com/api/sellers', {
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
        alert('Error al crear vendedor: ' + error.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al crear vendedor');
    }
  };

  useEffect(() => {
    if (userRole === 'admin') {
      loadSellers();
      loadTickets();
    } else if (userRole === 'seller') {
      loadTickets();
    }
  }, [userRole]);

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

          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-500">Ventas de Hoy</h3>
                  <p className="mt-2 text-3xl font-bold text-green-600">
                    ${tickets.filter(t => 
                      new Date(t.timestamp).toLocaleDateString('es-CO') === new Date().toLocaleDateString('es-CO')
                    ).reduce((sum, ticket) => sum + ticket.total, 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-500">Tiquetes de Hoy</h3>
                  <p className="mt-2 text-3xl font-bold text-blue-600">
                    {tickets.filter(t => 
                      new Date(t.timestamp).toLocaleDateString('es-CO') === new Date().toLocaleDateString('es-CO')
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
                      new Date(t.timestamp).toLocaleDateString('es-CO') === new Date().toLocaleDateString('es-CO')
                    ).reduce((sum, ticket) => sum + ticket.total, 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {pendingBets.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Apuestas Pendientes de Aprobación</h2>
                  <div className="space-y-4">
                    {pendingBets.map(bet => (
                      <div key={bet.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Vendedor: {bet.seller}</p>
                            <p>Lotería: {bet.lottery}</p>
                            <p>Número: {bet.number} ({bet.digits} cifras)</p>
                            <p className="text-red-600 font-bold">Valor: ${parseInt(bet.amount).toLocaleString()}</p>
                            <p className="text-sm text-gray-500">Fecha: {bet.timestamp}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveBet(bet.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300"
                            >
                              Aceptar
                            </button>
                            <button
                              onClick={() => handleRejectBet(bet.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
                            >
                              Rechazar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

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
                      value={reportFilter}
                      onChange={(e) => setReportFilter(e.target.value)}
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
                        <option key={seller.id} value={seller.username}>{seller.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={() => generateDetailedReport(reportType, reportFilter)}
                  disabled={!reportType}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
                >
                  Generar Reporte
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Números Más Jugados</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veces Jugado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getMostPlayedNumbers().map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{item.number}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.count}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{width: `${(item.count / Math.max(...getMostPlayedNumbers().map(i => i.count)) * 100)}%`}}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Vendedores con Más Ventas</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Ventas</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiquetes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promedio por Tiquete</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getTopSellers().map((seller, index) => {
                        const sellerTickets = tickets.filter(t => t.seller === seller.seller).length;
                        const avgPerTicket = sellerTickets > 0 ? Math.round(seller.sales / sellerTickets) : 0;
                        
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{seller.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-green-600 font-bold">${seller.sales.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{sellerTickets}</td>
                            <td className="px-6 py-4 whitespace-nowrap">${avgPerTicket.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

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
                      <tr key={seller.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{seller.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{seller.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={seller.commission}
                            onChange={(e) => updateSellerCommission(seller.id, e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1"
                          >
                            {[...Array(51)].map((_, i) => (
                              <option key={i} value={i}>{i}%</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            seller.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {seller.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                          <button className={`px-3 py-1 rounded text-sm transition duration-300 ${
                            seller.active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                          } text-white`}>
                            {seller.active ? 'Desactivar' : 'Activar'}
                          </button>
                          <button className="text-red-600 hover:text-red-900 ml-3">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Pagos a Vendedores</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Vendedor</label>
                  <select
                    value={selectedSeller}
                    onChange={(e) => setSelectedSeller(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccione un vendedor</option>
                    {sellers.map(seller => (
                      <option key={seller.id} value={seller.username}>{seller.name}</option>
                    ))}
                  </select>
                </div>
                
                {selectedSeller && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Resumen de Pagos - {sellers.find(s => s.username === selectedSeller)?.name}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Ventas Totales</p>
                        <p className="text-green-600 font-bold">$0</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Comisión Total</p>
                        <p className="text-orange-600 font-bold">$0</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monto Pagado</p>
                        <p className="text-blue-600 font-bold">$0</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Comisión (%)</p>
                        <p className="text-purple-600 font-bold">
                          {sellers.find(s => s.username === selectedSeller)?.commission || 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen de Pagos a Vendedores</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ventas Totales</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comisión Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto a Pagar</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Pagos</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getSellerPayments().map((payment, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{payment.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-green-600">${payment.totalSales.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-orange-600">${payment.totalCommission.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-bold">${payment.totalNet.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{payment.payments}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Historial de Pagos</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ventas del Día</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comisión (%)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto a Pagar</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiquetes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[...payments].reverse().map((payment, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">{payment.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{sellers.find(s => s.username === payment.seller)?.name || payment.seller}</td>
                          <td className="px-6 py-4 whitespace-nowrap">${payment.totalSales.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{payment.commissionRate}%</td>
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-600">${payment.netAmount.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{payment.ticketCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
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
                            {lottery.active ? 'Activa' : 'Cerrada (5 min antes)'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                          <button className="text-red-600 hover:text-red-900">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>📅 Hoy es {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                {isHoliday() && <p className="text-red-600 font-semibold">⚠️ Hoy es día festivo - Horarios especiales aplicados</p>}
              </div>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300">
                + Añadir Nueva Lotería
              </button>
            </div>
          )}
        </div>

        {showReportModal && currentReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">{currentReport.title}</h3>
                <p className="text-gray-600">Período: {currentReport.period}</p>
              </div>
              
              <div ref={reportRef} className="p-6">
                {reportType === 'sales' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">VENTAS TOTALES</p>
                          <p className="text-2xl font-bold text-green-600">${currentReport.totalSales}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">TIQUETES</p>
                          <p className="text-2xl font-bold text-blue-600">{currentReport.ticketCount}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Top Vendedores</h4>
                      <div className="space-y-2">
                        {currentReport.sellers.map((seller, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">{seller.name}</span>
                            <div className="text-right">
                              <p className="text-green-600 font-bold">${seller.sales}</p>
                              <p className="text-sm text-gray-500">{seller.tickets} tiquetes</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Números Más Jugados</h4>
                      <div className="space-y-2">
                        {currentReport.mostPlayedNumbers.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">{item.number}</span>
                            <span className="text-blue-600 font-bold">{item.count} veces</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {reportType === 'payments' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">TOTAL PAGADO</p>
                          <p className="text-2xl font-bold text-green-600">${currentReport.totalPaid}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">COMISIÓN TOTAL</p>
                          <p className="text-2xl font-bold text-orange-600">${currentReport.totalCommission}</p>
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <p className="text-sm text-gray-600">PAGOS REALIZADOS: {currentReport.paymentCount}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Detalle por Vendedor</h4>
                      <div className="space-y-3">
                        {currentReport.sellers.map((seller, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-bold text-gray-900 mb-2">{seller.name}</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Pagado:</span>
                                <span className="font-bold text-green-600">${seller.paid}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Comisión:</span>
                                <span className="font-bold text-orange-600">${seller.commission}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>N° de Pagos:</span>
                                <span className="font-bold">{seller.payments}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
                  <div className="flex gap-2 flex-1 min-w-[200px]">
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      value={emailToSend}
                      onChange={(e) => setEmailToSend(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendByEmail}
                      disabled={!emailToSend}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition duration-300"
                    >
                      Enviar por Email
                    </button>
                  </div>
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
              <p className="text-sm text-gray-500 mt-2">El sistema agregará automáticamente el prefijo +57</p>
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
                    {betList.length > 0 && (
                      <p className="text-sm text-blue-800">
                        Comisión estimada por este tiquete: ${Math.round(betList.reduce((sum, bet) => sum + parseInt(bet.amount), 0) * seller.commission / 100).toLocaleString()}
                      </p>
                    )}
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
                <p className="text-gray-600 mb-4">Por favor verifique que toda la información sea correcta antes de generar el tiquete.</p>
                
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