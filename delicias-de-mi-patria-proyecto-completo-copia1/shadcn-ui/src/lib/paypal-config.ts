// Configuración de PayPal
export const PAYPAL_CONFIG = {
  clientId: 'YOUR_PAYPAL_CLIENT_ID_HERE', // Necesitarás obtener esto de PayPal
  currency: 'USD',
  intent: 'capture',
  // Para pruebas usa sandbox: true, para producción usa sandbox: false
  sandbox: true, // Cambia a false cuando tengas las credenciales de producción
};

// Configuración para el entorno
export const PAYPAL_PAYMENT_CONFIG = {
  style: {
    layout: 'vertical',
    color: 'gold',
    shape: 'rect',
    label: 'paypal',
  },
  createOrderUrl: '/api/paypal/create-order', // Tu endpoint del backend
  captureOrderUrl: '/api/paypal/capture-order', // Tu endpoint del backend
};