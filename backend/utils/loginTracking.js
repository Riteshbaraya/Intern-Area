const axios = require('axios');
const moment = require('moment-timezone');

/**
 * Get IP address and location information
 */
async function getIPInfo(req) {
  try {
    // Get IP from request
    const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket?.remoteAddress;
    
    // Try to get location info from ipapi.co (free service)
    try {
      const response = await axios.get(`https://ipapi.co/${ip}/json/`);
      return {
        ip: ip,
        location: `${response.data.city}, ${response.data.country_name}`,
        country: response.data.country_name
      };
    } catch (ipError) {
      console.log('IP API failed, trying fallback...');
      
      // Fallback to ipinfo.io if API key is provided
      if (process.env.IP_API_KEY) {
        try {
          const ipinfoResponse = await axios.get(`https://ipinfo.io/${ip}?token=${process.env.IP_API_KEY}`);
          return {
            ip: ip,
            location: ipinfoResponse.data.loc ? `${ipinfoResponse.data.city}, ${ipinfoResponse.data.country}` : 'Unknown',
            country: ipinfoResponse.data.country || 'Unknown'
          };
        } catch (ipinfoError) {
          console.log('IPInfo API also failed');
        }
      }
      
      // Final fallback
      return {
        ip: ip,
        location: 'Unknown',
        country: 'Unknown'
      };
    }
  } catch (error) {
    console.error('Error getting IP info:', error);
    return {
      ip: req.ip || 'Unknown',
      location: 'Unknown',
      country: 'Unknown'
    };
  }
}

/**
 * Check if current time is within allowed hours for mobile devices
 */
function checkMobileTimeRestriction() {
  const currentIST = moment().tz('Asia/Kolkata');
  const hour = currentIST.hour();
  
  // Mobile access only between 10 AM to 1 PM IST
  if (hour < 10 || hour > 13) {
    return {
      allowed: false,
      message: 'Mobile access is only allowed between 10 AM to 1 PM IST',
      currentTime: currentIST.format('HH:mm:ss'),
      currentDate: currentIST.format('YYYY-MM-DD')
    };
  }
  
  return { allowed: true };
}

/**
 * Check if payment time is within allowed hours
 */
function checkPaymentTimeRestriction() {
  const currentIST = moment().tz('Asia/Kolkata');
  const hour = currentIST.hour();
  
  // Payment only between 10 AM to 11 AM IST
  // COMMENTED OUT FOR TESTING - Allow payments at any time
  // if (hour !== 10) {
  //   return {
  //     allowed: false,
  //     message: 'Payments are only allowed between 10 AM to 11 AM IST',
  //     currentTime: currentIST.format('HH:mm:ss'),
  //     currentDate: currentIST.format('YYYY-MM-DD')
  //   };
  // }
  
  return { allowed: true };
}

/**
 * Generate 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Parse user agent information
 */
function parseUserAgent(userAgent) {
  return {
    browser: userAgent.browser || 'Unknown',
    os: userAgent.os || 'Unknown',
    device: userAgent.isMobile ? 'Mobile' : userAgent.isTablet ? 'Tablet' : 'Desktop',
    isMobile: userAgent.isMobile,
    isTablet: userAgent.isTablet,
    isDesktop: !userAgent.isMobile && !userAgent.isTablet
  };
}

module.exports = {
  getIPInfo,
  checkMobileTimeRestriction,
  checkPaymentTimeRestriction,
  generateOTP,
  parseUserAgent
}; 