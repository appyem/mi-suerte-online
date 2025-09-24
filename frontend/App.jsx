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
  const [reportFilter, setReportFilter] = useState('daily');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [payments, setPayments] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [reportType, setReportType] = useState('');
  const [emailToSend, setEmailToSend] = useState('');
  const [showAddSellerModal, setShowAddSellerModal] = useState(false);
  const [newSeller, setNewSeller] = useState({ name: '', username: '', password: '', commission: 10 });
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
    // Esta es una simulación. En una aplicación real, se conectaría a una API de festivos
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
    const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const holiday = isHoliday();
    
    if (holiday && lottery.holidayTime) {
      return lottery.holidayTime;
    } else if (dayOfWeek === 6 && lottery.saturdayTime) { // Sábado
      return lottery.saturdayTime;
    } else if (dayOfWeek === 0 && lottery.sundayTime) { // Domingo
      return lottery.sundayTime;
    } else if (lottery.days.includes(dayOfWeek)) {
      return lottery.time;
    }
    return null; // No se juega hoy
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
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Llamada al backend para autenticación
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

  // Función para cargar vendedores del backend (base de datos)
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

  // Cargar datos cuando el usuario inicia sesión
  useEffect(() => {
    if (userRole === 'admin') {
      loadSellers();
      loadTickets();
    } else if (userRole === 'seller') {
      loadTickets();
    }
  }, [userRole]);

  const handleAddBet = () => {
    if (!currentBet.lottery || !currentBet.number || !currentBet.amount) {
      alert('Por favor complete todos los campos');
      return;
    }
    
    // Validar que el número tenga la cantidad correcta de dígitos
    const digits = parseInt(currentBet.digits);
    if (currentBet.number.length !== digits) {
      alert(`El número debe tener exactamente ${digits} dígitos`);
      return;
    }
    
    const amount = parseInt(currentBet.amount);
    
    // 🔒 NUEVA REGLA: Chance de 4 cifras máximo $5,000
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
      // Simular notificación sonora
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
      audio.play();
    }
  };

  const handleRejectBet = (betId) => {
    setPendingBets(pendingBets.filter(b => b.id !== betId));
    // Simular notificación sonora
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
      // Guardar en base de datos
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
      
      // También actualizar el estado local para mostrar en el dashboard
      setTickets(prev => [...prev, savedTicket]);
      
      // Generar mensaje para WhatsApp
      let whatsappMessage = `¡Gracias por jugar con Mi Suerte Online! 🍀\n\n`;
      whatsappMessage += `Tiquete: ${ticket.ticketId}\n`;
      whatsappMessage += `Fecha: ${new Date(ticket.timestamp).toLocaleString()}\n`;
      whatsappMessage += `Vendedor: ${ticket.seller}\n`;
      whatsappMessage += `Total: $${ticket.total.toLocaleString()}\n\n`;
      whatsappMessage += `Detalles de apuestas:\n`;
      
      ticket.bets.forEach((bet, index) => {
        whatsappMessage += `${index + 1}. ${bet.lottery} - ${bet.number} (${bet.digits} cifras) - $${parseInt(bet.amount).toLocaleString()}\n`;
      });
      
      const fullPhoneNumber = customerPhone.startsWith('3') ? `57${customerPhone}` : `573${customerPhone}`;
      window.open(`https://wa.me/${fullPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
      
      setBetList([]);
      setCustomerPhone('');
      
      alert('¡Ticket generado y guardado exitosamente!');
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al guardar el ticket. Por favor intenta nuevamente.');
    }
  };

  const dailyClose = () => {
    const today = new Date().toLocaleDateString();
    const todayTickets = tickets.filter(t => t.timestamp.includes(today) && t.seller === currentUser.username);
    const totalSales = todayTickets.reduce((sum, ticket) => sum + ticket.total, 0);
    const ticketCount = todayTickets.length;
    
    // Obtener comisión del vendedor
    const seller = sellers.find(s => s.username === currentUser.username);
    const commissionRate = seller ? seller.commission : 10;
    const commissionAmount = Math.round(totalSales * commissionRate / 100);
    const netAmount = totalSales - commissionAmount;
    
    // Generar reporte detallado para el administrador
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
    
    // Registrar pago
    const payment = {
      id: Date.now(),
      seller: currentUser.username,
      date: today,
      totalSales,
      commissionRate,
      commissionAmount,
      netAmount,
      ticketCount
    };
    setPayments([...payments, payment]);
    
    // Enviar por WhatsApp
    const adminFullPhone = adminPhone.startsWith('3') ? `57${adminPhone}` : `573${adminPhone}`;
    window.open(`https://wa.me/${adminFullPhone}?text=${encodeURIComponent(reportMessage)}`, '_blank');
    
    alert('Reporte diario enviado exitosamente');
  };

  const logout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setShowLogin(true);
    setUsername('');
    setPassword('');
  };

  // Manejar cambios en el número apostado para limitar dígitos
  const handleNumberChange = (value) => {
    const digits = parseInt(currentBet.digits);
    if (value.length <= digits) {
      setCurrentBet({...currentBet, number: value});
    }
  };

  // Función para actualizar comisión de vendedor
  const updateSellerCommission = (sellerId, commission) => {
    setSellers(sellers.map(seller => 
      seller.id === sellerId ? {...seller, commission: parseInt(commission)} : seller
    ));
    alert(`Comisión actualizada a ${commission}% para ${sellers.find(s => s.id === sellerId)?.name}`);
  };

  // Reporte de números más jugados
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

  // Reporte de vendedores con más ventas
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

  // Reporte de pagos a vendedores
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

  // Generar reporte según tipo y filtro
  const generateDetailedReport = (type, filter = 'daily') => {
    let reportData = {};
    const today = new Date();
    let startDate = new Date();
    
    // Calcular fecha de inicio según filtro
    switch(filter) {
      case 'daily':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        break;
      case 'weekly':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        break;
      case 'biweekly':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15);
        break;
      case 'monthly':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        break;
      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
    
    const formattedStartDate = startDate.toLocaleDateString('es-CO');
    const formattedEndDate = today.toLocaleDateString('es-CO');
    
    switch(type) {
      case 'sales':
        const filteredTickets = tickets.filter(ticket => {
          const ticketDate = new Date(ticket.timestamp);
          return ticketDate >= startDate;
        });
        
        const totalSales = filteredTickets.reduce((sum, ticket) => sum + ticket.total, 0);
        const ticketCount = filteredTickets.length;
        
        reportData = {
          title: 'REPORTE DE VENTAS',
          period: `${formattedStartDate} - ${formattedEndDate}`,
          totalSales: totalSales.toLocaleString(),
          ticketCount,
          sellers: getTopSellers().map(seller => {
            const sellerTickets = filteredTickets.filter(t => t.seller === seller.seller);
            const sellerSales = sellerTickets.reduce((sum, ticket) => sum + ticket.total, 0);
            return {
              ...seller,
              sales: sellerSales.toLocaleString(),
              tickets: sellerTickets.length
            };
          }),
          mostPlayedNumbers: getMostPlayedNumbers().slice(0, 5)
        };
        break;
        
      case 'payments':
        const filteredPayments = payments.filter(payment => {
          const paymentDate = new Date(payment.date);
          return paymentDate >= startDate;
        });
        
        const totalPaid = filteredPayments.reduce((sum, payment) => sum + payment.netAmount, 0);
        const totalCommission = filteredPayments.reduce((sum, payment) => sum + payment.commissionAmount, 0);
        
        reportData = {
          title: 'REPORTE DE PAGOS A VENDEDORES',
          period: `${formattedStartDate} - ${formattedEndDate}`,
          totalPaid: totalPaid.toLocaleString(),
          totalCommission: totalCommission.toLocaleString(),
          paymentCount: filteredPayments.length,
          sellers: getSellerPayments().map(seller => {
            const sellerPayments = filteredPayments.filter(p => p.seller === seller.seller);
            const sellerPaid = sellerPayments.reduce((sum, payment) => sum + payment.netAmount, 0);
            const sellerCommission = sellerPayments.reduce((sum, payment) => sum + payment.commissionAmount, 0);
            return {
              ...seller,
              paid: sellerPaid.toLocaleString(),
              commission: sellerCommission.toLocaleString(),
              payments: sellerPayments.length
            };
          })
        };
        break;
    }
    
    setCurrentReport(reportData);
    setReportType(type);
    setShowReportModal(true);
  };

  // Descargar reporte como imagen
  const downloadReport = () => {
    // En un entorno real, usaríamos html2canvas para convertir el reporte a imagen
    // Aquí simulamos la descarga con un enlace
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(currentReport, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Enviar por WhatsApp
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

  // Enviar por correo electrónico
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

  // Añadir nuevo vendedor (guardar en base de datos)
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
            
            {/* Información de acceso */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Credenciales de acceso:</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>🎯 <strong>Administrador:</strong> usuario=superadmin, contraseña=Appy2025</p>
                <p>👤 <strong>Vendedor 1:</strong> usuario=vendedor1, contraseña=pass123</p>
                <p>👤 <strong>Vendedor 2:</strong> usuario=vendedor2, contraseña=pass456</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (userRole === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
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
          {/* Tabs de navegación */}
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
            <>
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-500">Ventas Totales</h3>
                  <p className="mt-2 text-3xl font-bold text-green-600">${tickets.reduce((sum, ticket) => sum + ticket.total, 0).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-500">Tiquetes Vendidos</h3>
                  <p className="mt-2 text-3xl font-bold text-blue-600">{tickets.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-500">Premios por Pagar</h3>
                  <p className="mt-2 text-3xl font-bold text-orange-600">$0</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-500">Balance General</h3>
                  <p className="mt-2 text-3xl font-bold text-purple-600">${tickets.reduce((sum, ticket) => sum + ticket.total, 0).toLocaleString()}</p>
                </div>
              </div>

              {/* Pending Bets */}
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

          {/* Reportes Avanzados */}
          {activeTab === 'reports' && (
            <div className="space-y-8">
              {/* Generador de Reportes */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Generador de Reportes</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                    <select
                      value={reportFilter}
                      onChange={(e) => setReportFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="daily">Diario</option>
                      <option value="weekly">Semanal</option>
                      <option value="biweekly">Quincenal</option>
                      <option value="monthly">Mensual</option>
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

              {/* Números más jugados */}
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

              {/* Vendedores con más ventas */}
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

          {/* Gestión de Vendedores */}
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
                            <option value="5">5%</option>
                            <option value="10">10%</option>
                            <option value="12">12%</option>
                            <option value="15">15%</option>
                            <option value="20">20%</option>
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

          {/* Pagos a Vendedores */}
          {activeTab === 'payments' && (
            <div className="space-y-8">
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

              {/* Generar Reporte de Pagos */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Generar Reporte de Pagos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                    <select
                      value={reportFilter}
                      onChange={(e) => setReportFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="daily">Diario</option>
                      <option value="weekly">Semanal</option>
                      <option value="biweekly">Quincenal</option>
                      <option value="monthly">Mensual</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => generateDetailedReport('payments', reportFilter)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
                >
                  Generar Reporte de Pagos
                </button>
              </div>

              {/* Detalle de Pagos */}
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

          {/* Lottery Management */}
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

        {/* Modal de Reporte */}
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

        {/* Modal para añadir nuevo vendedor */}
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
                  <select
                    value={newSeller.commission}
                    onChange={(e) => setNewSeller({...newSeller, commission: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="5">5%</option>
                    <option value="10">10%</option>
                    <option value="12">12%</option>
                    <option value="15">15%</option>
                    <option value="20">20%</option>
                  </select>
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
        {/* Header */}
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
                      number: currentBet.number.slice(0, parseInt(newDigits)) // Limitar dígitos al cambiar
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

          {/* Bet List */}
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

          {/* Customer Info and Send Ticket */}
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
              Generar y Enviar Tiquete por WhatsApp
            </button>
          </div>

          {/* Daily Close */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Cierre de Caja Diario</h3>
            <p className="text-gray-600 mb-4">Envía un reporte resumido del día al administrador por WhatsApp con el desglose de comisiones.</p>
            
            {/* Mostrar comisión del vendedor */}
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

          {/* Modal de Confirmación */}
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