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
  const [currentBet, setCurrentBet] = useState({ lottery: '', digits: '2', number: '', amount: '', type: 'direct' });  const [betList, setBetList] = useState([]);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [adminPhone, setAdminPhone] = useState('3001234567');
  
  // 🔧 CORREGIDO: Nueva función para obtener la fecha en Colombia (UTC-5)
  const getColombiaDate = () => {
    return new Date().toLocaleDateString('sv-SE', {
      timeZone: 'America/Bogota'
    });
  };
  const [reportStartDate, setReportStartDate] = useState(getColombiaDate());
  const [reportEndDate, setReportEndDate] = useState(getColombiaDate());
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
  const [dateRange, setDateRange] = useState({ start: getColombiaDate(), end: getColombiaDate() });
  const [betMode, setBetMode] = useState('single');
  const [multiLotteries, setMultiLotteries] = useState([]);
  const [todayTickets, setTodayTickets] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewReportData, setPreviewReportData] = useState({ message: '', phone: '' });
  const [showSendMethodModal, setShowSendMethodModal] = useState(false);
  const [ticketToBeSent, setTicketToBeSent] = useState(null);
  const [showTicketDetailsModal, setShowTicketDetailsModal] = useState(false);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);
  
  // 🔴 NUEVO: Estados para resultados y ganadores
  const [lotteryResults, setLotteryResults] = useState([]);
  const [winningTickets, setWinningTickets] = useState([]);

  const BACKEND_URL = 'https://mi-suerte-online-backend.onrender.com';

  // 🔴 NUEVA FUNCIÓN: Eliminar ticket (solo para vendedores)
  const deleteTicket = async (ticketId) => {
    if (!window.confirm('¿Está seguro que desea eliminar este ticket? Solo se pueden eliminar tickets del día actual.')) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller: currentUser.username }),
      });
      if (response.ok) {
        setTodayTickets(todayTickets.filter(t => t._id !== ticketId));
        alert('Ticket eliminado exitosamente');
      } else {
        const error = await response.json();
        alert('Error: ' + (error.error || 'No se pudo eliminar el ticket'));
      }
    } catch (error) {
      console.error('Error al eliminar ticket:', error);
      alert('Error de conexión al intentar eliminar el ticket');
    }
  };

  

    // 🔴 NUEVO: Cargar loterías del día desde el backend (con actualización automática)
  useEffect(() => {
    const loadLotteries = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/lotteries/today`);
        if (response.ok) {
          const data = await response.json();
          setLotteries(data);
        }
      } catch (error) {
        console.error('Error al cargar loterías del día:', error);
      }
    };

    loadLotteries(); // Carga inicial
    const interval = setInterval(loadLotteries, 60000); // Actualiza cada minuto
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
if (betMode === 'single') {
if (!currentBet.lottery || !currentBet.number || !currentBet.amount) {
alert('Complete todos los campos');
return;
}

const digits = parseInt(currentBet.digits);
if (currentBet.number.length !== digits) {
alert(`El número debe tener exactamente ${digits} dígito${digits !== 1 ? 's' : ''}`);
return;
}

// Validar según modalidad
if (currentBet.digits === '1' && (parseInt(currentBet.number) < 0 || parseInt(currentBet.number) > 9)) {
alert('Para 1 cifra, el número debe estar entre 0 y 9');
return;
}

const amount = parseInt(currentBet.amount);
const maxAmount = getMaxBetAmount(currentBet.digits, currentBet.type);

if (amount > maxAmount) {
alert(`El monto máximo para esta modalidad es $${maxAmount.toLocaleString()}`);
return;
}

// Para 5 cifras, validar tipos especiales
if (currentBet.digits === '5' && ['first4', 'first4combined'].includes(currentBet.type)) {
if (currentBet.number.length !== 5) {
alert('Para apuestas de 5 cifras con premios parciales, debes ingresar 5 dígitos completos');
return;
}
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
setCurrentBet({ lottery: '', digits: '2', number: '', amount: '', type: 'direct' });
} else {
if (multiLotteries.length === 0) {
alert('Seleccione al menos una lotería');
return;
}
const { digits, number, amount, type } = currentBet;
if (!number || !amount) {
alert('Complete el número y el monto');
return;
}
const numDigits = parseInt(digits);
if (number.length !== numDigits) {
alert(`El número debe tener exactamente ${numDigits} dígito${numDigits !== 1 ? 's' : ''}`);
return;
}

// Validar según modalidad para apuestas múltiples
if (digits === '1' && (parseInt(number) < 0 || parseInt(number) > 9)) {
alert('Para 1 cifra, el número debe estar entre 0 y 9');
return;
}

const betAmount = parseInt(amount);
const maxAmount = getMaxBetAmount(digits, type);

if (betAmount > maxAmount) {
alert(`El monto máximo para esta modalidad es $${maxAmount.toLocaleString()}`);
return;
}

const newBets = multiLotteries.map(lotteryName => ({
lottery: lotteryName,
digits,
number,
amount,
type,
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
alert('Apuestas pendientes de aprobación del administrador');
} else {
setBetList([...betList, ...newBets]);
}
setMultiLotteries([]);
setCurrentBet({ lottery: '', digits: '2', number: '', amount: '', type: 'direct' });
}
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

  const openWhatsApp = (phone, message) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
  
    // Primero intentar con el esquema nativo de WhatsApp
    const nativeUrl = `whatsapp://send?phone=57${cleanPhone}&text=${encodedMessage}`;
    const webUrl = `https://wa.me/57${cleanPhone}?text=${encodedMessage}`;
  
    // Crear enlace nativo
    const nativeLink = document.createElement('a');
    nativeLink.href = nativeUrl;
    nativeLink.style.display = 'none';
    nativeLink.setAttribute('target', '_top');
    nativeLink.setAttribute('rel', 'noopener noreferrer');
  
  // Crear enlace web como fallback
    const webLink = document.createElement('a');
    webLink.href = webUrl;
    webLink.style.display = 'none';
    webLink.setAttribute('target', '_blank');
    webLink.setAttribute('rel', 'noopener noreferrer');
  
    document.body.appendChild(nativeLink);
    document.body.appendChild(webLink);
  
  // Intentar abrir la app nativa primero
    try {
      nativeLink.click();
    // Si falla (WhatsApp no instalado), abrir la web en 1 segundo
      setTimeout(() => {
        webLink.click();
      }, 1000);
    } catch (e) {
    // Si el esquema nativo falla, abrir directamente la web
      webLink.click();
    }
  
    document.body.removeChild(nativeLink);
    document.body.removeChild(webLink);
  };

  const openSMS = (phone, message) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = `57${cleanPhone}`;
    const encodedMessage = encodeURIComponent(message)
      .replace(/%20/g, '+')
      .replace(/['"]/g, '');
    const smsUrl = `sms:${fullPhone}?body=${encodedMessage}`;
  
    const smsLink = document.createElement('a');
    smsLink.href = smsUrl;
    smsLink.style.display = 'none';
    smsLink.setAttribute('target', '_blank');
    smsLink.setAttribute('rel', 'noopener noreferrer');
  
    document.body.appendChild(smsLink);
    smsLink.click();
    document.body.removeChild(smsLink);
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
  const ticketId = `TKT${Date.now()}`;
  const total = betList.reduce((sum, bet) => sum + parseInt(bet.amount || 0), 0);

  // Sanitizar y validar datos antes de enviar
  try {
  // Validar apuestas
  if (betList.length === 0) {
  throw new Error('No hay apuestas para generar el ticket');
  }

  if (!customerPhone || customerPhone.trim() === '') {
  throw new Error('Por favor ingrese el número del cliente');
  }

  // Sanitizar cada apuesta
  const sanitizedBets = betList.map(bet => {
  // Validar que el número tenga la longitud correcta
  const digits = parseInt(bet.digits || '2');
  let cleanedNumber = bet.number.replace(/\D/g, '');
  if (cleanedNumber.length > digits) {
  cleanedNumber = cleanedNumber.substring(0, digits);
  }
  if (cleanedNumber.length < digits) {
  cleanedNumber = cleanedNumber.padStart(digits, '0');
  }

  // Asegurar que el tipo de apuesta exista
  const validTypes = ['direct', 'combined', 'first4', 'first4combined', 'single'];
  const betType = validTypes.includes(bet.type) ? bet.type : 'direct';

  return {
  lottery: bet.lottery.trim(),
  digits: digits.toString(),
  number: cleanedNumber,
  amount: parseInt(bet.amount || 0),
  type: betType
  };
  });

  // Sanitizar teléfono del cliente
  let cleanedPhone = customerPhone.replace(/\D/g, '');
  if (cleanedPhone.length < 10) {
  throw new Error('El número de teléfono debe tener al menos 10 dígitos');
  }
  if (cleanedPhone.length > 10) {
  cleanedPhone = cleanedPhone.substring(cleanedPhone.length - 10);
  }

  const response = await fetch(`${BACKEND_URL}/api/tickets`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  seller: currentUser.username,
  bets: sanitizedBets,
  total: total,
  customerPhone: cleanedPhone,
  customerName: customerName.trim() || 'Cliente'
  }),
  });

  if (!response.ok) {
  const errorData = await response.json();
  console.error('Error del servidor:', errorData);
  throw new Error(errorData.details || 'Error al guardar el ticket');
  }

  const savedTicket = await response.json();
  console.log('✅ Ticket guardado exitosamente:', savedTicket);

  // Generar mensaje para WhatsApp/SMS
  let message = `¡Gracias por jugar con Mi Suerte Online${customerName ? `, ${customerName}` : ''}! 🍀
  `;
  message += `Tiquete: ${savedTicket.ticketId}
  `;
  message += `Fecha: ${new Date(savedTicket.timestamp).toLocaleString('es-CO')}
  `;
  message += `Vendedor: ${savedTicket.seller}
  `;
  message += `Total: $${savedTicket.total.toLocaleString()}
  `;
  message += `Detalles de apuestas:
  `;

  savedTicket.bets.forEach((bet, index) => {
  let betType = '';
  if (bet.digits === '1') betType = ' (1 Cifra - Uña)';
  else if (bet.digits === '2') betType = ' (2 Cifras - Pata)';
  else if (bet.digits === '3') {
  betType = bet.type === 'combined' ? ' (3 Cifras - Combinado)' : ' (3 Cifras - Directo)';
  }
  else if (bet.digits === '4') {
  betType = bet.type === 'combined' ? ' (4 Cifras - Combinado)' : ' (4 Cifras - Directo)';
  }
  else if (bet.digits === '5') {
  betType = bet.type === 'direct' ? ' (5 Cifras - Directo)' : 
  bet.type === 'combined' ? ' (5 Cifras - Combinado)' :
  bet.type === 'first4' ? ' (4 Cifras Directas)' : 
  ' (4 Cifras Combinadas)';
  }

  message += `${index + 1}. ${bet.lottery} - ${bet.number}${betType} - $${bet.amount.toLocaleString()}
  `;
  });

  setTicketToBeSent({
  ticket: savedTicket,
  message,
  customerName: savedTicket.customerName,
  customerPhone: savedTicket.customerPhone
  });

  setShowSendMethodModal(true);

  // Actualizar el estado local con el ticket guardado
  setTodayTickets(prev => [...prev, savedTicket]);
  setBetList([]);
  setCustomerPhone('');
  setCustomerName('');

  alert('¡Ticket generado exitosamente!');
  } catch (error) {
  console.error('❌ Error completo al generar ticket:', error);
  let errorMessage = 'Error al guardar el ticket. Por favor verifica:';
  if (error.message.includes('telefono')) {
  errorMessage = 'El número de teléfono no es válido. Debe tener 10 dígitos.';
  } else if (error.message.includes('apuestas')) {
  errorMessage = 'No hay apuestas válidas en el ticket.';
  } else if (error.message.includes('monto')) {
  errorMessage = 'Uno o más montos son inválidos.';
  } else {
  errorMessage = error.message || 'Error desconocido. Intente nuevamente.';
  }
  alert(errorMessage);
  setShowConfirmModal(true); // Mostrar modal de confirmación nuevamente para corrección
  }
  };
  
  const sendTicketByMethod = (method) => {
    if (!ticketToBeSent) return;
    
    const { ticket, customerPhone } = ticketToBeSent;
    
    if (method === 'whatsapp') {
      openWhatsApp(customerPhone, ticketToBeSent.message);
    } else if (method === 'sms') {
      // SMS: mensaje CORTO y compatible
      let smsMessage = `Mi Suerte Online 🍀\n`;
      ticket.bets.forEach((bet, index) => {
        smsMessage += `${index + 1}. ${bet.lottery} - ${bet.number} - $${parseInt(bet.amount).toLocaleString()}\n`;
      });
      smsMessage += `Total: $${ticket.total.toLocaleString()}`;
    
      // Asegurar que el mensaje no exceda ~160 caracteres (ideal para SMS)
      if (smsMessage.length > 160) {
        // Versión ultra corta si hay muchas apuestas
        smsMessage = `Tiquete ${ticket.ticketId}: ${ticket.bets.length} apuestas. Total: $${ticket.total.toLocaleString()}`;
      }
    
      openSMS(customerPhone, smsMessage);
    }
    setShowSendMethodModal(false);
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

  const dailyClose = async () => {
    const today = getColombiaDate(); // ✅ Usar fecha de Colombia
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
      let reportMessage = `REPORTE DIARIO - Mi Suerte Online 📊
`;
      reportMessage += `Fecha: ${new Date().toLocaleDateString('es-CO')}
`;
      reportMessage += `Vendedor: ${currentUser.username}
`;
      reportMessage += `Total Ventas: $${totalSales.toLocaleString()}
`;
      reportMessage += `Número de Tiquetes: ${ticketCount}
`;
      reportMessage += `Comisión (${commissionRate}%): $${commissionAmount.toLocaleString()}
`;
      reportMessage += `Monto a Pagar: $${netAmount.toLocaleString()}
`;
      reportMessage += `Detalles de Ventas:
`;
      todayTickets.forEach((ticket, index) => {
        reportMessage += `
Tiquete #${index + 1}: ${ticket.ticketId}
`;
        reportMessage += `Total: $${ticket.total.toLocaleString()}
`;
        ticket.bets.forEach((bet, betIndex) => {
        let betType = '';
        if (bet.digits === '1') betType = ' (1 Cifra)';
        else if (bet.digits === '2') betType = ' (2 Cifras - Pata)';
        else if (bet.digits === '3') {
        betType = bet.type === 'combined' ? ' (3 Cifras - Combinado)' : ' (3 Cifras - Directo)';
        }
        else if (bet.digits === '4') {
        betType = bet.type === 'combined' ? ' (4 Cifras - Combinado)' : ' (4 Cifras - Directo)';
        }
        else if (bet.digits === '5') {
        betType = bet.type === 'direct' ? ' (5 Cifras - Directo)' : 
        bet.type === 'combined' ? ' (5 Cifras - Combinado)' :
        bet.type === 'first4' ? ' (4 Cifras Directas)' : 
        ' (4 Cifras Combinadas)';
        }

        reportMessage += `  ${betIndex + 1}. ${bet.lottery} - ${bet.number}${betType} - $${parseInt(bet.amount).toLocaleString()}
        `;
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
    const today = getColombiaDate(); // ✅
    setDateRange({ start: today, end: today });
    setShowDateRangeModal(true);
  };

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
      let reportMessage = `REPORTE DE CIERRE - Mi Suerte Online 📊
`;
      reportMessage += `Rango de Fechas: ${start} al ${end}
`;
      reportMessage += `Vendedor: ${currentUser.username}
`;
      reportMessage += `Total Ventas: $${totalSales.toLocaleString()}
`;
      reportMessage += `Número de Tiquetes: ${ticketCount}
`;
      reportMessage += `Comisión (${commissionRate}%): $${commissionAmount.toLocaleString()}
`;
      reportMessage += `Monto a Pagar: $${netAmount.toLocaleString()}
`;
      reportMessage += `Detalles de Ventas:
`;
      ticketsInRange.forEach((ticket, index) => {
        reportMessage += `
Tiquete #${index + 1}: ${ticket.ticketId}
`;
        reportMessage += `Fecha: ${new Date(ticket.timestamp).toLocaleDateString('es-CO')}
`;
        reportMessage += `Total: $${ticket.total.toLocaleString()}
`;
        ticket.bets.forEach((bet, betIndex) => {
          reportMessage += `  ${betIndex + 1}. ${bet.lottery} - ${bet.number} - $${parseInt(bet.amount).toLocaleString()}
`;
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
    let cleanedValue = value.replace(/\D/g, '');
    if (cleanedValue.length > digits) {
    cleanedValue = cleanedValue.substring(0, digits);
    }
    setCurrentBet({...currentBet, number: cleanedValue});
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
const today = getColombiaDate();
let url = `${BACKEND_URL}/api/tickets?date=${today}`;

// Para vendedores, filtrar por su usuario
if (userRole === 'seller' && currentUser) {
url += `&seller=${currentUser.username}`;
}

const response = await fetch(url);
if (!response.ok) {
throw new Error(`Error HTTP: ${response.status}`);
}

const ticketsData = await response.json();
console.log('_tickets cargados:', ticketsData.length);

if (userRole === 'admin') {
setTickets(ticketsData);
}

// Para ambos roles, establecer los tickets de hoy
setTodayTickets(ticketsData.map(t => ({
...t,
customerName: t.customerName || t.customerPhone || 'Cliente'
})));

} catch (error) {
console.error('❌ Error al cargar tickets:', error);
// Si falla, intentar con rango de fechas como fallback
try {
const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Bogota' });
const startDate = today;
const endDate = today;

let url = `${BACKEND_URL}/api/tickets?startDate=${startDate}&endDate=${endDate}`;
if (userRole === 'seller' && currentUser) {
url += `&seller=${currentUser.username}`;
}

const fallbackResponse = await fetch(url);
if (fallbackResponse.ok) {
const fallbackData = await fallbackResponse.json();
setTodayTickets(fallbackData.map(t => ({
...t,
customerName: t.customerName || t.customerPhone || 'Cliente'
})));
if (userRole === 'admin') {
setTickets(fallbackData);
}
console.log('✅ Carga fallback exitosa');
} else {
// Mostrar alerta solo en el frontend, no en consola
console.log('⚠️ No se pudieron cargar los tickets. Verifica tu conexión.');
}
} catch (fallbackError) {
console.error('❌ Error en carga fallback:', fallbackError);
alert('Error al cargar los tickets. Verifica tu conexión a internet.');
}
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

  // 🔴 NUEVAS FUNCIONES: Cargar resultados y ganadores
  const loadLotteryResults = async () => {
    try {
      // Calcular "ayer" en Colombia
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      const yesterdayColombia = yesterday.toLocaleDateString('sv-SE', {
        timeZone: 'America/Bogota'
      });
      
      const response = await fetch(`${BACKEND_URL}/api/lottery-results?date=${yesterdayColombia}`);
      if (response.ok) {
        const results = await response.json();
        setLotteryResults(results);
      }
    } catch (error) {
      console.error('Error al cargar resultados:', error);
    }
  };

  const loadWinningTickets = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/winning-tickets`);
      if (response.ok) {
        const wins = await response.json();
        setWinningTickets(wins);
        if (wins.length > 0) {
          alert(`🎉 ¡Hay ${wins.length} ticket(s) ganador(es) hoy! Revise la pestaña "Ganadores".`);
        }
      }
    } catch (error) {
      console.error('Error al cargar tickets ganadores:', error);
    }
  };

  useEffect(() => {
const loadData = async () => {
try {
if (userRole === 'admin') {
await Promise.all([
loadSellers(),
loadTickets(),
loadPayments(),
loadLotteryResults(),
loadWinningTickets()
]);
} else if (userRole === 'seller') {
await Promise.all([
loadSellers(),
loadTickets(),
loadLotteryResults(),
loadWinningTickets()
]);
}
} catch (error) {
console.error('Error al cargar datos del panel:', error);
alert('Error al cargar los datos del panel. Por favor recarga la página.');
}
};

if (userRole) {
loadData();
}
}, [userRole]);

// Agregar useEffect separado para recargar datos periódicamente
useEffect(() => {
if (userRole === 'admin') {
const interval = setInterval(() => {
loadSellers();
loadTickets();
loadPayments();
loadLotteryResults();
loadWinningTickets();
}, 30000); // Cada 30 segundos

return () => clearInterval(interval);
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
  
  const openTicketDetailsModal = (ticket) => {
    setSelectedTicketDetails(ticket);
    setShowTicketDetailsModal(true);
  };
 
  const resendTicket = () => {
    if (!resendTicketData) return;
    const { customerName: name, customerPhone: phone, bets, total, ticketId, seller, timestamp } = resendTicketData;
    let message = `¡Gracias por jugar con Mi Suerte Online${name ? `, ${name}` : ''}! 🍀
`;
    message += `Tiquete: ${ticketId}
`;
    message += `Fecha: ${new Date(timestamp).toLocaleString()}
`;
    message += `Vendedor: ${seller}
`;
    message += `Total: $${total.toLocaleString()}
`;
    message += `Detalles de apuestas:
`;
    bets.forEach((bet, index) => {
      message += `${index + 1}. ${bet.lottery} - ${bet.number} (${bet.digits} cifras) - $${parseInt(bet.amount).toLocaleString()}
`;
    });
    openWhatsApp(phone, message);
    setShowResendModal(false);
    alert('Ticket reenviado exitosamente');
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
    if (!window.confirm('¿Está seguro que desea eliminar este vendedor?')) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/sellers/${sellerId}`, { method: 'DELETE' });
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
        headers: { 'Content-Type': 'application/json' },
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

  const generateDetailedReport = async (type) => {
if (!type) {
alert('Seleccione un tipo de reporte');
return;
}

// Si se selecciona solo una fecha (hoy)
if (reportStartDate === reportEndDate) {
try {
const url = `${BACKEND_URL}/api/reports?type=${type}&startDate=${reportStartDate}` +
(selectedSeller ? `&seller=${selectedSeller}` : '');
const response = await fetch(url);
if (!response.ok) {
const errorData = await response.json();
throw new Error(errorData.error || 'Error al generar el reporte');
}
const reportData = await response.json();
setCurrentReport(reportData);
setReportType(type);
setShowReportModal(true);
} catch (error) {
console.error('Error en reporte de un día:', error);
alert(`Error al generar el reporte: ${error.message}`);
}
} else {
// Para rango de fechas
if (reportStartDate > reportEndDate) {
alert('La fecha de inicio no puede ser mayor que la fecha de fin');
return;
}
try {
const url = `${BACKEND_URL}/api/reports?type=${type}&startDate=${reportStartDate}&endDate=${reportEndDate}` +
(selectedSeller ? `&seller=${selectedSeller}` : '');
const response = await fetch(url);
if (!response.ok) {
const errorData = await response.json();
throw new Error(errorData.error || 'Error al generar el reporte');
}
const reportData = await response.json();
setCurrentReport(reportData);
setReportType(type);
setShowReportModal(true);
} catch (error) {
console.error('Error en reporte de rango:', error);
alert(`Error al generar el reporte: ${error.message}`);
}
}
};

  const downloadReport = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(currentReport, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = `reporte_${reportType}_${getColombiaDate()}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const sendByWhatsApp = () => {
    if (!currentReport) return;
    let message = '';
    if (reportType === 'sales') {
      message = `*${currentReport.title}*
Período: ${currentReport.period}
VENTAS TOTALES: $${currentReport.totalSales}
TIQUETES: ${currentReport.ticketCount}
`;
    } else if (reportType === 'payments') {
      message = `*${currentReport.title}*
Período: ${currentReport.period}
TOTAL PAGADO: $${currentReport.totalPaid}
COMISIÓN TOTAL: $${currentReport.totalCommission}
`;
    }
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    const waLink = document.createElement('a');
    waLink.href = waUrl;
    waLink.target = '_top';
    waLink.rel = 'noopener noreferrer';
    document.body.appendChild(waLink);
    waLink.click();
    document.body.removeChild(waLink);
  };

  const sendByEmail = () => {
    if (!currentReport || !emailToSend) return;
    let subject = `Reporte ${reportType === 'sales' ? 'de Ventas' : 'de Pagos'} - Mi Suerte Online`;
    let body = JSON.stringify(currentReport, null, 2);
    window.open(`mailto:${emailToSend}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  // Función para obtener el máximo permitido según modalidad
const getMaxBetAmount = (digits, type) => {
switch(digits) {
case '1': return 100000; // Límite alto para una cifra
case '2': return 200000; // Límite alto para dos cifras
case '3': 
return type === 'direct' ? 200000 : 200000;
case '4': 
return type === 'direct' ? 5000 : 200000; // Límite estricto para 4 cifras directo
case '5': 
return type === 'direct' ? 2000 : 200000;
default: return 200000;
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
          </form>
        </div>
      </div>
    );
  }

  if (userRole === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-900 text-white">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Mi Suerte Online - Panel Administrador</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Bienvenido, {currentUser.username}</span>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-2 rounded-lg transition duration-300 font-semibold shadow-md"
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Sidebar - Menú vertical */}
          <div className="border-b border-gray-200 mb-6">
            
            <nav className="-mb-px flex space-x-6 overflow-x-auto pb-2">
              {[
                { id: 'dashboard', name: '📊 Dashboard' },
                { id: 'reports', name: '📈 Reportes Avanzados' },
                { id: 'sellers', name: '👥 Gestión Vendedores' },
                { id: 'payments', name: '💰 Pagos a Vendedores' },
                { id: 'lotteries', name: '🎲 Loterías' },
                { id: 'results', name: '🏆 Resultados' },
                { id: 'winners', name: '🎉 Ganadores' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="bg-gradient-to-br from-gray-800 to-emerald-900/30 border border-emerald-500/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg shadow-emerald-500/10">
          {activeTab === 'dashboard' && (
<div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
{['admin'].includes(userRole) && (
<>
<div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
<h3 className="text-sm font-medium text-gray-500">Ventas de Hoy</h3>
<p className="mt-2 text-3xl font-bold text-green-700">
${todayTickets.reduce((sum, ticket) => sum + ticket.total, 0).toLocaleString()}
</p>
<p className="text-sm text-gray-500 mt-1">Tiquetes: {todayTickets.length}</p>
</div>
<div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
<h3 className="text-sm font-medium text-gray-500">Tiquetes de Hoy</h3>
<p className="mt-2 text-3xl font-bold text-blue-700">
{todayTickets.length}
</p>
<p className="text-sm text-gray-500 mt-1">Promedio: ${todayTickets.length > 0 ? Math.round(todayTickets.reduce((sum, ticket) => sum + ticket.total, 0) / todayTickets.length).toLocaleString() : '0'}
</p>
</div>
<div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
<h3 className="text-sm font-medium text-gray-500">Vendedores Activos</h3>
<p className="mt-2 text-3xl font-bold text-orange-700">
{sellers.filter(s => s.active).length}
</p>
<p className="text-sm text-gray-500 mt-1">de {sellers.length} totales</p>
</div>
<div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
<h3 className="text-sm font-medium text-gray-500">Balance del Día</h3>
<p className="mt-2 text-3xl font-bold text-purple-700">
${todayTickets.reduce((sum, ticket) => sum + ticket.total, 0).toLocaleString()}
</p>
<p className="text-sm text-gray-500 mt-1">Última actualización: {new Date().toLocaleTimeString('es-CO')}</p>
</div>
</>
)}
</div>

{/* Tabla de ventas recientes */}
<div className="bg-white rounded-xl shadow-sm p-6 mt-6">
<h2 className="text-xl font-bold text-gray-900 mb-4">Últimas Ventas</h2>
{todayTickets.length === 0 ? (
<p className="text-gray-500 text-center py-8">No hay ventas registradas hoy.</p>
) : (
<div className="overflow-x-auto">
<table className="min-w-full divide-y divide-gray-200">
<thead className="bg-gray-50">
<tr>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ticket</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Vendedor</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Cliente</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hora</th>
</tr>
</thead>
<tbody className="divide-y divide-gray-200">
{todayTickets.slice(0, 10).map((ticket, index) => (
<tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.ticketId}</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ticket.seller}</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ticket.customerName || 'Sin nombre'}</td>
<td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">${ticket.total.toLocaleString()}</td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
{new Date(ticket.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
</td>
</tr>
))}
</tbody>
</table>
</div>
)}
</div>
</div>
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
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
>
<option value="">Seleccione un tipo de reporte</option>
<option value="sales">Reporte de Ventas</option>
<option value="payments">Reporte de Pagos a Vendedores</option>
</select>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
<input
type="date"
value={reportStartDate}
onChange={(e) => setReportStartDate(e.target.value)}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
<input
type="date"
value={reportEndDate}
onChange={(e) => setReportEndDate(e.target.value)}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
/>
</div>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Vendedor (Opcional)</label>
<select
value={selectedSeller}
onChange={(e) => setSelectedSeller(e.target.value)}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
>
<option value="">Todos los vendedores</option>
{sellers.map(seller => (
<option key={seller._id} value={seller.username} className="text-gray-800">{seller.name}</option>
))}
</select>
</div>
</div>
<button
onClick={() => generateDetailedReport(reportType)}
disabled={!reportType}
className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
>
Generar Reporte
</button>
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
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nombre</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Usuario</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contraseña</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Comisión</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Estado</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Acciones</th>
</tr>
</thead>
<tbody className="bg-white divide-y divide-gray-200">
{sellers.map(seller => (
<tr key={seller._id} className="text-gray-800">
<td className="px-6 py-4 whitespace-nowrap font-medium">{seller.name}</td>
<td className="px-6 py-4 whitespace-nowrap">{seller.username}</td>
<td className="px-6 py-4 whitespace-nowrap font-mono bg-gray-100 text-gray-900">{seller.password}</td>
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

{activeTab === 'payments' && (
<div className="bg-white rounded-xl shadow-sm p-6">
<h2 className="text-xl font-bold text-gray-900 mb-4">Pagos a Vendedores</h2>
<div className="overflow-x-auto">
<table className="min-w-full divide-y divide-gray-200">
<thead className="bg-gray-50">
<tr>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Vendedor</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Ventas Totales</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Comisión Total</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Monto a Pagar</th>
</tr>
</thead>
<tbody className="bg-white divide-y divide-gray-200 text-gray-800">
{getSellerPayments().map((payment, index) => (
<tr key={index}>
<td className="px-6 py-4 whitespace-nowrap font-medium">{payment.name}</td>
<td className="px-6 py-4 whitespace-nowrap text-green-700 font-medium">${payment.totalSales.toLocaleString()}</td>
<td className="px-6 py-4 whitespace-nowrap text-orange-700 font-medium">${payment.totalCommission.toLocaleString()}</td>
<td className="px-6 py-4 whitespace-nowrap text-blue-700 font-bold">${payment.totalNet.toLocaleString()}</td>
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
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nombre</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hora</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Estado</th>
</tr>
</thead>
<tbody className="bg-white divide-y divide-gray-200 text-gray-800">
{lotteries.map(lottery => (
<tr key={lottery.id}>
<td className="px-6 py-4 whitespace-nowrap font-medium">{lottery.name}</td>
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

          {/* 🔴 NUEVO: Resultados */}
          {activeTab === 'results' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Números Ganadores de Hoy</h2>
              {lotteryResults.length === 0 ? (
                <p className="text-gray-500">Cargando resultados...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lotteryResults.map((result, i) => (
                    <div key={i} className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <p className="font-bold text-green-800">{result.lottery}</p>
                      <p className="text-2xl font-mono text-green-700 mt-2">{result.winningNumber}</p>
                      <p className="text-sm text-gray-600">Fecha: {result.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* 🔴 NUEVO: Ganadores */}
          {activeTab === 'winners' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tickets Ganadores de Hoy</h2>
              {winningTickets.length === 0 ? (
                <p className="text-gray-500">No hay tickets ganadores hoy.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lotería</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jugado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ganador</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendedor</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {winningTickets.map((win, i) => (
                        <tr key={i} className="bg-yellow-50">
                          <td className="px-4 py-3 font-medium">{win.ticketId}</td>
                          <td className="px-4 py-3">{win.lottery}</td>
                          <td className="px-4 py-3 text-green-700 font-bold">{win.playedNumber}</td>
                          <td className="px-4 py-3 text-blue-700 font-mono">{win.winningNumber}</td>
                          <td className="px-4 py-3">{win.seller}</td>
                          <td className="px-4 py-3">+57{win.customerPhone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
        {showReportModal && currentReport && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-xl">
<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
<h3 className="text-2xl font-bold text-gray-800">{currentReport.title}</h3>
<p className="text-gray-600 font-medium mt-1">{currentReport.period}</p>
</div>
<div className="p-6">
{reportType === 'sales' ? (
<div className="space-y-6">
<div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
<div>
<p className="text-sm font-medium text-gray-600">Ventas Totales</p>
<p className="text-2xl font-bold text-green-700 mt-1">${currentReport.totalSales}</p>
</div>
<div>
<p className="text-sm font-medium text-gray-600">Tiquetes</p>
<p className="text-2xl font-bold text-blue-700 mt-1">{currentReport.ticketCount}</p>
</div>
<div>
<p className="text-sm font-medium text-gray-600">Promedio por Tiquete</p>
<p className="text-2xl font-bold text-purple-700 mt-1">
${currentReport.ticketCount > 0 ? 
Math.round(parseInt(currentReport.totalSales.replace(/,/g, '')) / currentReport.ticketCount).toLocaleString() 
: '0'}
</p>
</div>
</div>
</div>

<div className="mt-6">
<h4 className="text-lg font-bold text-gray-800 mb-3">Detalle por Vendedor</h4>
<div className="overflow-x-auto">
<table className="min-w-full divide-y divide-gray-200">
<thead className="bg-gray-50">
<tr>
<th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Vendedor</th>
<th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ventas</th>
<th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tiquetes</th>
<th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Promedio</th>
</tr>
</thead>
<tbody className="divide-y divide-gray-200">
{currentReport.sellers && currentReport.sellers.map((seller, index) => (
<tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
<td className="px-4 py-3 text-sm font-medium text-gray-800">{seller.seller}</td>
<td className="px-4 py-3 text-sm text-green-700 font-bold">${seller.sales}</td>
<td className="px-4 py-3 text-sm text-gray-700">{seller.tickets}</td>
<td className="px-4 py-3 text-sm text-blue-700 font-medium">${seller.average}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>

{currentReport.details && currentReport.details.length > 0 && (
<div className="mt-6">
<h4 className="text-lg font-bold text-gray-800 mb-3">Ventas de Hoy (Detallado)</h4>
<div className="space-y-3 max-h-96 overflow-y-auto">
{currentReport.details.map((ticket, index) => (
<div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
<div className="flex justify-between">
<div>
<p className="font-medium text-gray-800">Ticket: {ticket.ticketId}</p>
<p className="text-sm text-gray-600">Cliente: {ticket.customerName || 'Sin nombre'}</p>
<p className="text-xs text-gray-500 mt-1">Vendedor: {ticket.seller}</p>
</div>
<div className="text-right">
<p className="font-bold text-green-700">${ticket.total.toLocaleString()}</p>
<p className="text-xs text-gray-500">{new Date(ticket.timestamp).toLocaleTimeString('es-CO')}</p>
</div>
</div>
<div className="mt-2 pl-4 border-l-2 border-blue-200">
{ticket.bets.map((bet, betIndex) => (
<p key={betIndex} className="text-xs text-gray-700">
{betIndex + 1}. {bet.lottery} - {bet.number} 
{bet.digits === '1' ? '(1 Cifra - Uña)' :
bet.digits === '2' ? '(2 Cifras - Pata)' :
bet.digits === '3' ? (bet.type === 'combined' ? '(3 Cifras - Combinado)' : '(3 Cifras - Directo)') :
bet.digits === '4' ? (bet.type === 'combined' ? '(4 Cifras - Combinado)' : '(4 Cifras - Directo)') :
'(5 Cifras)'
} - ${bet.amount.toLocaleString()}
</p>
))}
</div>
</div>
))}
</div>
</div>
)}
</div>
) : reportType === 'payments' ? (
<div className="space-y-6">
<div className="bg-green-50 rounded-xl p-4 border border-green-100">
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
<div>
<p className="text-sm font-medium text-gray-600">Total Pagado</p>
<p className="text-2xl font-bold text-green-700 mt-1">${currentReport.totalPaid}</p>
</div>
<div>
<p className="text-sm font-medium text-gray-600">Comisión Total</p>
<p className="text-2xl font-bold text-orange-700 mt-1">${currentReport.totalCommission}</p>
</div>
<div>
<p className="text-sm font-medium text-gray-600">Pagos Realizados</p>
<p className="text-2xl font-bold text-blue-700 mt-1">{currentReport.paymentCount}</p>
</div>
</div>
</div>

<div className="mt-6">
<h4 className="text-lg font-bold text-gray-800 mb-3">Detalle de Pagos</h4>
<div className="overflow-x-auto">
<table className="min-w-full divide-y divide-gray-200">
<thead className="bg-gray-50">
<tr>
<th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Vendedor</th>
<th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Monto Pagado</th>
<th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Comisión</th>
<th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Fecha</th>
</tr>
</thead>
<tbody className="divide-y divide-gray-200">
{currentReport.sellers && currentReport.sellers.map((seller, index) => (
<tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
<td className="px-4 py-3 text-sm font-medium text-gray-800">{seller.name}</td>
<td className="px-4 py-3 text-sm text-green-700 font-bold">${seller.paid}</td>
<td className="px-4 py-3 text-sm text-orange-700">${seller.commission}</td>
<td className="px-4 py-3 text-sm text-gray-600">{seller.date}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>

{currentReport.details && currentReport.details.length > 0 && (
<div className="mt-6">
<h4 className="text-lg font-bold text-gray-800 mb-3">Pagos de Hoy (Detallado)</h4>
<div className="space-y-3 max-h-96 overflow-y-auto">
{currentReport.details.map((payment, index) => (
<div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
<div className="grid grid-cols-2 gap-2">
<div>
<p className="font-medium text-gray-800">{payment.seller}</p>
<p className="text-sm text-gray-600">Ventas Totales: ${payment.totalSales.toLocaleString()}</p>
<p className="text-sm text-gray-600">Comisión: {payment.commissionRate}%</p>
</div>
<div className="text-right">
<p className="font-bold text-green-700">Neto: ${payment.netAmount.toLocaleString()}</p>
<p className="text-sm text-orange-700">Comisión: ${payment.commissionAmount.toLocaleString()}</p>
<p className="text-xs text-gray-500">{payment.ticketCount} tiquetes</p>
</div>
</div>
</div>
))}
</div>
</div>
)}
</div>
) : (
<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
<h4 className="font-bold text-gray-800 mb-2">Datos del Reporte:</h4>
<pre className="text-gray-800 font-mono text-sm overflow-auto whitespace-pre-wrap">
{JSON.stringify(currentReport, null, 2)}
</pre>
</div>
)}
</div>
<div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-wrap gap-3 justify-end">
<button
onClick={downloadReport}
className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300 shadow-sm hover:shadow-md"
>
📥 Descargar JSON
</button>
<button
onClick={sendByWhatsApp}
className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300 shadow-sm hover:shadow-md"
>
📱 Enviar por WhatsApp
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
    const today = getColombiaDate(); // ✅
    const totalSalesToday = todayTickets.reduce((sum, ticket) => sum + (ticket.total || 0), 0);
    const seller = sellers.find(s => s.username === currentUser.username);
    const commissionRate = seller ? seller.commission : 10;
    const commissionAmount = Math.round(totalSalesToday * commissionRate / 100);
    const netAmount = totalSalesToday - commissionAmount;
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-900">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]">
  Mi Suerte Online - Panel de Venta
</h1>
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
              <button
                onClick={() => setActiveTab('results')}
                className={`py-2 px-1 font-medium text-sm ${
                  activeTab === 'results'
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Resultados
              </button>
              <button
                onClick={() => setActiveTab('winners')}
                className={`py-2 px-1 font-medium text-sm ${
                  activeTab === 'winners'
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ganadores
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
                <p className="text-gray-500 text-center py-8">No hay ventas registradas hoy.</p>
              ) : (
                <div className="space-y-4">
                  {todayTickets.map((ticket, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Ticket: {ticket.ticketId}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(ticket.timestamp).toLocaleDateString('es-CO')} • 
                              {new Date(ticket.timestamp).toLocaleTimeString('es-CO')}
                            </p>
                          </div>
                          <span className="text-lg font-bold text-green-700">${ticket.total.toLocaleString()}</span>
                        </div>
                        <div className="mt-3 space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Cliente:</span> {ticket.customerName || 'Sin nombre'}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Teléfono:</span> +57{ticket.customerPhone}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2 justify-end">
                          <button
                            onClick={() => openTicketDetailsModal(ticket)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs"
                          >
                            Detalles
                          </button>
                          <button
                            onClick={() => openResendModal(ticket)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs"
                          >
                            Reenviar
                          </button>
                          <button
                            onClick={() => deleteTicket(ticket._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'create' && (
<div className="bg-gray-800 text-white rounded-xl shadow-sm p-6">
<h2 className="text-xl font-bold mb-4">Crear Nueva Apuesta</h2>
<div className="mb-4 flex space-x-4">
<button
onClick={() => setBetMode('single')}
className={`px-4 py-2 rounded-lg text-sm font-medium ${
betMode === 'single'
? 'bg-blue-600 text-white'
: 'bg-gray-200 text-gray-700'
}`}
>
Apuesta Individual
</button>
<button
onClick={() => setBetMode('multiple')}
className={`px-4 py-2 rounded-lg text-sm font-medium ${
betMode === 'multiple'
? 'bg-blue-600 text-white'
: 'bg-gray-200 text-gray-700'
}`}
>
Apuesta Múltiple
</button>
</div>
{betMode === 'single' ? (
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="block text-sm font-medium text-white mb-2">Seleccionar Lotería</label>
<select
value={currentBet.lottery}
onChange={(e) => setCurrentBet({...currentBet, lottery: e.target.value})}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
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
<div className="space-y-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Modalidad de Apuesta</label>
<select
value={currentBet.digits}
onChange={(e) => {
const newDigits = e.target.value;
// Resetear tipo de apuesta cuando cambia la cantidad de cifras
let newType = 'direct';
if (newDigits === '1') newType = 'single'; // Una cifra no tiene tipo combinado
if (newDigits === '3' || newDigits === '4' || newDigits === '5') newType = 'direct';

setCurrentBet({
...currentBet,
digits: newDigits,
type: newType,
number: currentBet.number.slice(0, parseInt(newDigits))
});
}}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
>
<option value="1">1 Cifra (Uña)</option>
<option value="2">2 Cifras (Pata)</option>
<option value="3">3 Cifras</option>
<option value="4">4 Cifras</option>
<option value="5">5 Cifras (Nueva)</option>
</select>
</div>

{/* Tipos de apuesta según cifras seleccionadas */}
{(currentBet.digits === '3' || currentBet.digits === '4' || currentBet.digits === '5') && (
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Apuesta</label>
<select
value={currentBet.type || 'direct'}
onChange={(e) => setCurrentBet({...currentBet, type: e.target.value})}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
>
<option value="direct">Directo (orden exacto)</option>
<option value="combined">Combinado (cualquier orden)</option>
{currentBet.digits === '5' && (
<>
<option value="first4">4 Cifras Directas</option>
<option value="first4combined">4 Cifras Combinadas</option>
</>
)}
</select>
</div>
)}

<div>
<label className="block text-sm font-medium text-white mb-2">
{currentBet.digits === '1' && 'Número Apostado (0-9)'}
{currentBet.digits === '2' && 'Número Apostado (00-99)'}
{currentBet.digits === '3' && 'Número Apostado (000-999)'}
{currentBet.digits === '4' && 'Número Apostado (0000-9999)'}
{currentBet.digits === '5' && 'Número Apostado (00000-99999)'}
</label>
<input
type="text"
value={currentBet.number}
onChange={(e) => handleNumberChange(e.target.value.replace(/\D/g, ''))}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
placeholder={`Ej: ${'12345'.substring(0, parseInt(currentBet.digits))}`}
maxLength={parseInt(currentBet.digits)}
/>
<p className="text-sm text-white mt-1">
{currentBet.digits === '1' && 'Ingresa un solo dígito (0-9)'}
{currentBet.digits === '2' && 'Ingresa exactamente 2 dígitos'}
{currentBet.digits === '3' && 'Ingresa exactamente 3 dígitos'}
{currentBet.digits === '4' && 'Ingresa exactamente 4 dígitos'}
{currentBet.digits === '5' && 'Ingresa exactamente 5 dígitos'}
</p>
</div>

<div>
<label className="block text-sm font-medium text-white mb-2">Valor de la Apuesta (COP)</label>
<input
type="number"
value={currentBet.amount}
onChange={(e) => setCurrentBet({...currentBet, amount: e.target.value})}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
placeholder="Ej: 5000"
min="100"
/>
{/* Mensajes de validación específicos por modalidad */}
{parseInt(currentBet.amount) > getMaxBetAmount(currentBet.digits, currentBet.type) && (
<p className="text-red-600 text-sm mt-2">
Máximo permitido: ${getMaxBetAmount(currentBet.digits, currentBet.type).toLocaleString()} para esta modalidad
</p>
)}
{currentBet.digits === '1' && parseInt(currentBet.amount) >= 100 && (
<p className="text-yellow-600 text-sm mt-2">💡 Premio aproximado: ${Math.round(parseInt(currentBet.amount) * 5).toLocaleString()} si ganas</p>
)}
{currentBet.digits === '2' && parseInt(currentBet.amount) >= 100 && (
<p className="text-yellow-600 text-sm mt-2">💡 Premio aproximado: ${Math.round(parseInt(currentBet.amount) * 50).toLocaleString()} si ganas</p>
)}
{currentBet.digits === '3' && currentBet.type === 'direct' && parseInt(currentBet.amount) >= 100 && (
<p className="text-yellow-600 text-sm mt-2">💡 Premio aproximado: ${Math.round(parseInt(currentBet.amount) * 400).toLocaleString()} si ganas</p>
)}
{currentBet.digits === '3' && currentBet.type === 'combined' && parseInt(currentBet.amount) >= 100 && (
<p className="text-yellow-600 text-sm mt-2">💡 Premio aproximado: ${Math.round(parseInt(currentBet.amount) * 83).toLocaleString()} si ganas</p>
)}
{currentBet.digits === '4' && currentBet.type === 'direct' && parseInt(currentBet.amount) >= 100 && (
<p className="text-yellow-600 text-sm mt-2">💡 Premio aproximado: ${Math.round(parseInt(currentBet.amount) * 4500).toLocaleString()} si ganas</p>
)}
{currentBet.digits === '4' && currentBet.type === 'combined' && parseInt(currentBet.amount) >= 100 && (
<p className="text-yellow-600 text-sm mt-2">💡 Premio aproximado: ${Math.round(parseInt(currentBet.amount) * 208).toLocaleString()} si ganas</p>
)}
{currentBet.digits === '5' && currentBet.type === 'direct' && parseInt(currentBet.amount) >= 100 && (
<p className="text-yellow-600 text-sm mt-2">💡 Premio aproximado: ${Math.round(parseInt(currentBet.amount) * 38000).toLocaleString()} si ganas</p>
)}
{currentBet.digits === '5' && ['first4', 'first4combined'].includes(currentBet.type) && parseInt(currentBet.amount) >= 100 && (
<p className="text-yellow-600 text-sm mt-2">💡 Premio aproximado: ${
currentBet.type === 'first4' ? 
Math.round(parseInt(currentBet.amount) * 4500).toLocaleString() : 
Math.round(parseInt(currentBet.amount) * 208).toLocaleString()
} si ganas</p>
)}
</div>
</div>
</div>
) : (
<div className="space-y-4">
<div className="mb-4">
<label className="block text-sm font-medium text-white mb-2">Seleccionar Loterías</label>
<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
{lotteries.filter(l => l.active).map(lottery => (
<label key={lottery.name} className="flex items-center p-2 hover:bg-gray-700 rounded">
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
className="mr-2 h-4 w-4 text-blue-600"
/>
<span className="text-sm text-white">{lottery.name} - {lottery.time}</span>
</label>
))}
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Modalidad de Apuesta</label>
<select
value={currentBet.digits}
onChange={(e) => {
const newDigits = e.target.value;
let newType = 'direct';
if (newDigits === '1') newType = 'single';
if (newDigits === '3' || newDigits === '4' || newDigits === '5') newType = 'direct';

setCurrentBet({
...currentBet,
digits: newDigits,
type: newType,
number: currentBet.number.slice(0, parseInt(newDigits))
});
}}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
>
<option value="1">1 Cifra (Uña)</option>
<option value="2">2 Cifras (Pata)</option>
<option value="3">3 Cifras</option>
<option value="4">4 Cifras</option>
<option value="5">5 Cifras (Nueva)</option>
</select>
</div>

{/* Tipos de apuesta para modo múltiple */}
{(currentBet.digits === '3' || currentBet.digits === '4' || currentBet.digits === '5') && (
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Apuesta</label>
<select
value={currentBet.type || 'direct'}
onChange={(e) => setCurrentBet({...currentBet, type: e.target.value})}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
>
<option value="direct">Directo (orden exacto)</option>
<option value="combined">Combinado (cualquier orden)</option>
{currentBet.digits === '5' && (
<>
<option value="first4">4 Cifras Directas</option>
<option value="first4combined">4 Cifras Combinadas</option>
</>
)}
</select>
</div>
)}

<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
<input
type="text"
value={currentBet.number}
onChange={(e) => {
const val = e.target.value.replace(/\D/g, '');
if (val.length <= parseInt(currentBet.digits)) {
setCurrentBet({...currentBet, number: val});
}
}}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
placeholder={`Ej: ${'12345'.substring(0, parseInt(currentBet.digits))}`}
maxLength={parseInt(currentBet.digits)}
/>
<p className="text-xs text-gray-500 mt-1">
Ingresa exactamente {currentBet.digits} {currentBet.digits === '1' ? 'dígito' : 'dígitos'}
</p>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Monto por Lotería (COP)</label>
<input
type="number"
value={currentBet.amount}
onChange={(e) => setCurrentBet({...currentBet, amount: e.target.value})}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
placeholder="Ej: 2000"
min="100"
/>
{/* Validación para modo múltiple */}
{parseInt(currentBet.amount) > getMaxBetAmount(currentBet.digits, currentBet.type) && (
<p className="text-red-600 text-xs mt-1">
Máximo: ${getMaxBetAmount(currentBet.digits, currentBet.type).toLocaleString()} por lotería
</p>
)}
<p className="text-xs text-gray-500 mt-1">
Total para {multiLotteries.length} loterías: ${multiLotteries.length * parseInt(currentBet.amount || 0).toLocaleString()}
</p>
</div>
</div>
</div>
)}
<div className="mt-6">
<button
onClick={handleAddBet}
className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300 font-semibold"
>
{betMode === 'single' ? 'Añadir Apuesta' : `Añadir ${multiLotteries.length} Apuestas`}
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
          {/* 🔴 NUEVO: Resultados para vendedor */}
          {activeTab === 'results' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Números Ganadores de Hoy</h2>
              {lotteryResults.length === 0 ? (
                <p className="text-gray-500">Cargando resultados...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lotteryResults.map((result, i) => (
                    <div key={i} className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <p className="font-bold text-green-800">{result.lottery}</p>
                      <p className="text-2xl font-mono text-green-700 mt-2">{result.winningNumber}</p>
                      <p className="text-sm text-gray-600">Fecha: {result.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* 🔴 NUEVO: Ganadores para vendedor */}
          {activeTab === 'winners' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tickets Ganadores de Hoy</h2>
              {winningTickets.length === 0 ? (
                <p className="text-gray-500">No hay tickets ganadores hoy.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lotería</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jugado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ganador</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {winningTickets
                        .filter(w => w.seller === currentUser.username)
                        .map((win, i) => (
                          <tr key={i} className="bg-yellow-50">
                            <td className="px-4 py-3 font-medium">{win.ticketId}</td>
                            <td className="px-4 py-3">{win.lottery}</td>
                            <td className="px-4 py-3 text-green-700 font-bold">{win.playedNumber}</td>
                            <td className="px-4 py-3 text-blue-700 font-mono">{win.winningNumber}</td>
                            <td className="px-4 py-3">+57{win.customerPhone}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {betList.length > 0 && activeTab === 'create' && (
            <div className="bg-gray-800 text-gray-800 rounded-xl shadow-sm p-6 mt-6">
              <h3 className="text-lg font-bold mb-4">Apuestas en el Tiquete</h3>
              <div className="space-y-3">
                {betList.map(bet => (
                <div key={bet.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between">
                <div>
                <p className="font-medium">{bet.lottery}</p>
                <p>
                Número: {bet.number} 
                {bet.digits === '1' && ' (1 Cifra - Uña)'}
                {bet.digits === '2' && ' (2 Cifras - Pata)'}
                {bet.digits === '3' && (bet.type === 'combined' ? ' (3 Cifras - Combinado)' : ' (3 Cifras - Directo)')}
                {bet.digits === '4' && (bet.type === 'combined' ? ' (4 Cifras - Combinado)' : ' (4 Cifras - Directo)')}
                {bet.digits === '5' && (
                bet.type === 'direct' ? ' (5 Cifras - Directo)' :
                bet.type === 'combined' ? ' (5 Cifras - Combinado)' :
                bet.type === 'first4' ? ' (4 Cifras Directas)' : ' (4 Cifras Combinadas)'
                )}
                </p>
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
          {activeTab === 'create' && (
            <div className="bg-gray-800 text-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="text-lg font-bold mb-4">Información del Cliente</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">Nombre del Cliente</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">Número del Cliente (solo dígitos)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +57
                  </span>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
		  
          {/* Modal para elegir método de envío */}
          {showSendMethodModal && ticketToBeSent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Enviar Ticket</h3>
                <p className="text-gray-600 mb-6">
                  ¿Cómo deseas enviar el ticket al cliente?
                </p>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => sendTicketByMethod('whatsapp')}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
                  >
                    Enviar por WhatsApp
                  </button>
                  <button
                    onClick={() => sendTicketByMethod('sms')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
                  >
                    Enviar por SMS
                  </button>
                  <button
                    onClick={() => setShowSendMethodModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-300"
                  >
                    Cancelar
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
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"

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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="3001234568"
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
		  {showTicketDetailsModal && selectedTicketDetails && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
<div className="p-6 border-b border-gray-200 flex justify-between items-center">
<h3 className="text-xl font-bold text-gray-900">Detalles del Ticket</h3>
<button
onClick={() => setShowTicketDetailsModal(false)}
className="text-gray-500 hover:text-gray-700 font-bold"
>
×
</button>
</div>
<div className="p-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
<div>
<p className="text-sm text-gray-600">ID del Ticket</p>
<p className="font-mono font-bold">{selectedTicketDetails.ticketId}</p>
</div>
<div>
<p className="text-sm text-gray-600">Fecha y Hora</p>
<p>{new Date(selectedTicketDetails.timestamp).toLocaleString('es-CO')}</p>
</div>
<div>
<p className="text-sm text-gray-600">Vendedor</p>
<p>{selectedTicketDetails.seller}</p>
</div>
<div>
<p className="text-sm text-gray-600">Cliente</p>
<p>{selectedTicketDetails.customerName || 'Sin nombre'}</p>
</div>
<div>
<p className="text-sm text-gray-600">Teléfono</p>
<p>+57{selectedTicketDetails.customerPhone}</p>
</div>
<div>
<p className="text-sm text-gray-600">Total</p>
<p className="text-lg font-bold text-green-700">${selectedTicketDetails.total.toLocaleString()}</p>
</div>
</div>
<h4 className="font-bold text-gray-800 mb-3">Apuestas:</h4>
<div className="space-y-2">
{selectedTicketDetails.bets && selectedTicketDetails.bets.map((bet, idx) => {
let betType = '';
if (bet.digits === '1') betType = ' (1 Cifra - Uña)';
else if (bet.digits === '2') betType = ' (2 Cifras - Pata)';
else if (bet.digits === '3') {
betType = bet.type === 'combined' ? ' (3 Cifras - Combinado)' : ' (3 Cifras - Directo)';
}
else if (bet.digits === '4') {
betType = bet.type === 'combined' ? ' (4 Cifras - Combinado)' : ' (4 Cifras - Directo)';
}
else if (bet.digits === '5') {
betType = bet.type === 'direct' ? ' (5 Cifras - Directo)' : 
bet.type === 'combined' ? ' (5 Cifras - Combinado)' :
bet.type === 'first4' ? ' (4 Cifras Directas)' : 
' (4 Cifras Combinadas)';
}

return (
<div key={idx} className="border border-gray-200 rounded p-3 bg-gray-50">
<p className="font-medium">{bet.lottery}</p>
<p>Número: <span className="font-mono">{bet.number}</span>{betType}</p>
<p>Monto: ${parseInt(bet.amount).toLocaleString()}</p>
</div>
);
})}
</div>
</div>
<div className="p-6 border-t border-gray-200 text-right">
<button
onClick={() => setShowTicketDetailsModal(false)}
className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
>
Cerrar
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