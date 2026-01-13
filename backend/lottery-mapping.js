// 🎲 ARCHIVO DE MAPEO EXPLÍCITO - SOLUCIÓN 1
// Este archivo contiene toda la lógica para corregir el problema de nombres de loterías

// Tabla de mapeo explícito (Nombres en tickets -> Nombres en API)
const lotteryNameMapping = {
  // Chontico
  'chontico noche': 'CHONTICO NOCHE',
  'chontico': 'CHONTICO NOCHE',
  'chontico': 'CHONTICO NOCHE',
  
  // Dorado
  'dorado tarde': 'DORADO TARDE',
  'dorado': 'DORADO TARDE',
  'dorado mañana': 'DORADO MAÑANA',
  'dorado noche': 'DORADO NOCHE',
  
  // Sinuano
  'sinuano noche': 'SINUANO NOCHE',
  'sinuano día': 'SINUANO DÍA',
  'sinuano': 'SINUANO NOCHE',
  
  // Caribeña
  'la caribeña noche': 'LA CARIBEÑA NOCHE',
  'caribeña noche': 'LA CARIBEÑA NOCHE',
  'caribeña': 'LA CARIBEÑA NOCHE',
  'la caribeña día': 'LA CARIBEÑA DÍA',
  
  // Super Astro
  'super astro luna': 'SUPER ASTRO LUNA',
  'astro luna': 'SUPER ASTRO LUNA',
  'super astro sol': 'SUPER ASTRO SOL',
  'astro sol': 'SUPER ASTRO SOL',
  
  // Fantástica
  'fantástica día': 'FANTÁSTICA DÍA',
  'fantastica día': 'FANTÁSTICA DÍA',
  'fantástica': 'FANTÁSTICA DÍA',
  'fantástica noche': 'FANTÁSTICA NOCHE',
  'fantastica noche': 'FANTÁSTICA NOCHE',
  
  // Antioqueñita
  'antioqueñita día': 'ANTIOQUEÑITA DÍA',
  'antioqueñita': 'ANTIOQUEÑITA DÍA',
  'antioqueñita tarde': 'ANTIOQUEÑITA TARDE',
  
  // Samán
  'el samán de la suerte': 'EL SAMÁN DE LA SUERTE',
  'saman de la suerte': 'EL SAMÁN DE LA SUERTE',
  'samán': 'EL SAMÁN DE LA SUERTE',
  
  // Paisita
  'paisita día': 'PAISITA DÍA',
  'paisita': 'PAISITA DÍA',
  'paisita noche': 'PAISITA NOCHE',
  
  // Pijao
  'pijao de oro': 'PIJAO DE ORO',
  'pijao': 'PIJAO DE ORO',
  
  // Motilón
  'motilón tarde': 'MOTILÓN TARDE',
  'motilon tarde': 'MOTILÓN TARDE',
  'motilón': 'MOTILÓN TARDE',
  'motilón noche': 'MOTILÓN NOCHE',
  'motilon noche': 'MOTILÓN NOCHE',
  
  // Cafeterito
  'cafeterito tarde': 'CAFETERITO TARDE',
  'cafeterito': 'CAFETERITO TARDE',
  'cafeterito noche': 'CAFETERITO NOCHE',
  
  // Otras loterías principales
  'paisa lotto': 'PAISA LOTTO',
  'la culona día': 'LA CULONA DÍA',
  'culona día': 'LA CULONA DÍA',
  'la culona': 'LA CULONA DÍA',
  'la culona noche': 'LA CULONA NOCHE',
  'culona noche': 'LA CULONA NOCHE',
  'supermillonaria': 'SUPERMILLONARIA',
  
  // Loterías departamentales
  'lotería de cundinamarca': 'LOTERÍA DE CUNDINAMARCA',
  'loteria de cundinamarca': 'LOTERÍA DE CUNDINAMARCA',
  'cundinamarca': 'LOTERÍA DE CUNDINAMARCA',
  
  'lotería de tolima': 'LOTERÍA DE TOLIMA',
  'loteria de tolima': 'LOTERÍA DE TOLIMA',
  'tolima': 'LOTERÍA DE TOLIMA',
  
  'lotería cruz roja': 'LOTERÍA CRUZ ROJA',
  'loteria cruz roja': 'LOTERÍA CRUZ ROJA',
  'cruz roja': 'LOTERÍA CRUZ ROJA',
  
  'lotería de huila': 'LOTERÍA DE HUILA',
  'loteria de huila': 'LOTERÍA DE HUILA',
  'huila': 'LOTERÍA DE HUILA',
  
  'lotería de manizales': 'LOTERÍA DE MANIZALES',
  'loteria de manizales': 'LOTERÍA DE MANIZALES',
  'manizales': 'LOTERÍA DE MANIZALES',
  
  'lotería del meta': 'LOTERÍA DEL META',
  'loteria del meta': 'LOTERÍA DEL META',
  'meta': 'LOTERÍA DEL META',
  
  'lotería del valle': 'LOTERÍA DEL VALLE',
  'loteria del valle': 'LOTERÍA DEL VALLE',
  'valle': 'LOTERÍA DEL VALLE',
  
  'lotería quindío': 'LOTERÍA QUINDÍO',
  'loteria quindio': 'LOTERÍA QUINDÍO',
  'quindío': 'LOTERÍA QUINDÍO',
  'quindio': 'LOTERÍA QUINDÍO',
  
  'lotería de bogotá': 'LOTERÍA DE BOGOTÁ',
  'loteria de bogota': 'LOTERÍA DE BOGOTÁ',
  'bogotá': 'LOTERÍA DE BOGOTÁ',
  'bogota': 'LOTERÍA DE BOGOTÁ',
  
  'lotería de santander': 'LOTERÍA DE SANTANDER',
  'loteria de santander': 'LOTERÍA DE SANTANDER',
  'santander': 'LOTERÍA DE SANTANDER',
  
  'lotería de medellín': 'LOTERÍA DE MEDELLÍN',
  'loteria de medellin': 'LOTERÍA DE MEDELLÍN',
  'medellín': 'LOTERÍA DE MEDELLÍN',
  'medellin': 'LOTERÍA DE MEDELLÍN',
  
  'lotería risaralda': 'LOTERÍA RISARALDA',
  'loteria risaralda': 'LOTERÍA RISARALDA',
  'risaralda': 'LOTERÍA RISARALDA',
  
  'lotería de boyacá': 'LOTERÍA DE BOYACÁ',
  'loteria de boyaca': 'LOTERÍA DE BOYACÁ',
  'boyacá': 'LOTERÍA DE BOYACÁ',
  'boyaca': 'LOTERÍA DE BOYACÁ',
  
  'lotería de cauca': 'LOTERÍA DE CAUCA',
  'loteria de cauca': 'LOTERÍA DE CAUCA',
  'cauca': 'LOTERÍA DE CAUCA',
  
  'extra de colombia': 'EXTRA DE COLOMBIA',
  'extra colombia': 'EXTRA DE COLOMBIA',
  'extra': 'EXTRA DE COLOMBIA'
};

// Función de normalización con mapeo explícito
function normalizeLotteryName(name) {
  const normalized = name.toLowerCase()
    .replace(/\s+/g, '') // Eliminar espacios
    .replace(/[áàäâãå]/g, 'a') // Normalizar vocales acentuadas
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöôõø]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9]/g, '') // Eliminar caracteres no alfanuméricos
    .trim();
  
  return lotteryNameMapping[normalized] || null;
}

// Función principal de comparación (reemplaza al código problemático)
function findBestLotteryMatch(ticketLottery, officialResults) {
  const normalizedTicket = normalizeLotteryName(ticketLottery);
  
  // Primero intentar con mapeo explícito
  if (normalizedTicket) {
    const exactMatch = officialResults.find(r => r.lottery === normalizedTicket);
    if (exactMatch) return exactMatch;
  }
  
  // Fallback: coincidencia exacta normalizada (método mejorado)
  const ticketName = ticketLottery.toLowerCase().replace(/[^a-z0-9]/g, '');
  let bestMatch = null;
  let bestScore = 0;
  
  for (const result of officialResults) {
    const resultName = result.lottery.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Coincidencia exacta
    if (resultName === ticketName) {
      return result;
    }
    
    // Coincidencia parcial (si contiene el nombre)
    if (resultName.includes(ticketName) || ticketName.includes(resultName)) {
      const similarity = Math.max(
        resultName.includes(ticketName) ? ticketName.length / resultName.length : 0,
        ticketName.includes(resultName) ? resultName.length / ticketName.length : 0
      );
      
      if (similarity > bestScore && similarity > 0.5) { // Umbral del 50%
        bestScore = similarity;
        bestMatch = result;
      }
    }
  }
  
  return bestMatch;
}

// Exportar las funciones para usar en server.js
module.exports = {
  normalizeLotteryName,
  findBestLotteryMatch,
  lotteryNameMapping
};