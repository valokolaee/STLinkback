// config/cors.options.js

// List of explicitly allowed domains
const allowedDomains = [
  'https://banks.trade',
  'https://www.banks.trade',
  'https://sbank.sbs',
  'https://www.sbank.sbs',
  'https://w.bankon.click',
  'http://w.bankon.click',
  'https://bank1.insuranc.top',
  'https://bank2.insuranc.top',
  'https://bank3.insuranc.top',
  'https://bank4.insuranc.top',
  'https://bank5.insuranc.top',
  'https://bank6.insuranc.top',
  'https://bank7.insuranc.top',
  'https://bank8.insuranc.top',
  'https://bank9.insuranc.top',
  'https://www.bank1.insuranc.top',
  'https://www.bank2.insuranc.top',
  'https://www.bank3.insuranc.top',
  'https://www.bank4.insuranc.top',
  'https://www.bank5.insuranc.top',
  'https://www.bank6.insuranc.top',
  'https://www.bank7.insuranc.top',
  'https://www.bank8.insuranc.top',
  'https://www.bank9.insuranc.top',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://localhost:3001',
  'https://localhost:3000',
  'http://127.0.0.1:3000'
];

// Regex patterns for dynamic subdomain matching
const regexPatterns = [
  /^https:\/\/(www\.)?banks\.trade$/,
  /^https:\/\/(www\.)?sbank\.sbs$/,
  /^https:\/\/(www\.|bank[1-9]\.)?insuranc\.top$/,
  /^https?:\/\/w\.bankon\.click$/
];

export default{
  // Custom origin validation function
  origin: function (origin:any, callback:any) {
    // Allow requests with no origin (like curl, postman)
    if (!origin) return callback(null, true);

    // Check against explicit domain list
    if (allowedDomains.includes(origin)) {
      return callback(null, true);
    }

    // Check against regex patterns for dynamic subdomains
    if (regexPatterns.some(pattern => pattern.test(origin))) {
      return callback(null, true);
    }

    // Reject all other origins
    callback(new Error('Not allowed by CORS'));
  },

  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  // Allowed request headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'lang',
    'x-api-key'
  ],

  // Headers exposed to client
  exposedHeaders: [
    'Content-Length',
    'X-Request-ID'
  ],

  // Allow credentials (cookies, auth headers)
  credentials: true,

  // Cache CORS preflight results for 24 hours
  maxAge: 86400,

  // Disable passing CORS preflight to next handler
  preflightContinue: false,

  // HTTP status for successful OPTIONS requests
  optionsSuccessStatus: 200
};