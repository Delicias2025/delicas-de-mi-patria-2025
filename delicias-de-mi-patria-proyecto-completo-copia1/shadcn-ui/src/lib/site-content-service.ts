import { SiteContent, ContactInfo } from '@/types';

// Clave para almacenar el contenido del sitio en localStorage
const SITE_CONTENT_KEY = 'site-content';

// Contenido predeterminado del sitio
const defaultSiteContent: SiteContent = {
  privacyPolicy: `
# Política de Privacidad

## Introducción
Bienvenido a la política de privacidad de Delicias de mi Patria. Esta política explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando utiliza nuestro sitio web y nuestros servicios.

## Información que recopilamos
- **Información personal**: Nombre, dirección de correo electrónico, dirección de envío, número de teléfono y detalles de pago cuando realiza una compra.
- **Información de uso**: Datos sobre cómo interactúa con nuestro sitio web, preferencias de productos y historial de compras.
- **Información técnica**: Dirección IP, tipo de navegador, proveedor de servicios de Internet, páginas de referencia/salida y registros de fecha/hora.

## Cómo utilizamos su información
- Para procesar y cumplir con sus pedidos
- Para comunicarnos con usted sobre su cuenta o pedidos
- Para enviarle actualizaciones y ofertas promocionales (si ha optado por recibirlas)
- Para mejorar nuestro sitio web y servicio al cliente
- Para proteger nuestros derechos y prevenir actividades fraudulentas

## Divulgación de su información
No vendemos ni alquilamos su información personal a terceros. Podemos compartir su información con:
- Proveedores de servicios que nos ayudan a operar nuestro negocio
- Autoridades legales cuando sea necesario para cumplir con la ley

## Seguridad de datos
Implementamos medidas de seguridad para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción.

## Sus derechos
Usted tiene derecho a:
- Acceder a la información personal que tenemos sobre usted
- Corregir cualquier información inexacta
- Solicitar la eliminación de su información personal
- Oponerse al procesamiento de sus datos para marketing directo

## Cambios a esta política
Podemos actualizar nuestra política de privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva política de privacidad en esta página.

## Contacto
Si tiene preguntas sobre esta política de privacidad, contáctenos a través de nuestro formulario de contacto o envíenos un correo electrónico a info@deliciasmipatria.com
  `,
  shippingPolicy: `
# Política de Envío

## Tiempos de procesamiento
Todos los pedidos son procesados dentro de 1-2 días hábiles. Los pedidos realizados durante fines de semana o días festivos se procesarán el siguiente día hábil.

## Opciones de envío
Ofrecemos varias opciones de envío:
- **Envío estándar**: 3-5 días hábiles
- **Envío express**: 1-2 días hábiles (no disponible para todas las ubicaciones)
- **Recogida en tienda**: Disponible para recogida al día siguiente del procesamiento

## Tarifas de envío
Las tarifas de envío se calculan en el momento de la compra y dependen del peso del paquete, destino y método de envío seleccionado.

## Seguimiento de pedidos
Una vez que su pedido haya sido enviado, recibirá un correo electrónico con la información de seguimiento. Puede rastrear su pedido utilizando el número proporcionado.

## Envíos internacionales
Actualmente ofrecemos envíos a países seleccionados. Los envíos internacionales pueden estar sujetos a aranceles e impuestos adicionales que deberán ser pagados por el cliente.

## Problemas con la entrega
Si su pedido parece estar retrasado o no ha llegado dentro del tiempo estimado, por favor contáctenos inmediatamente para que podamos investigar y resolver el problema.

## Política de devoluciones
Por favor, consulte nuestra Política de Devoluciones para obtener información detallada sobre cómo devolver productos.

## Contacto
Para cualquier pregunta relacionada con su envío, por favor contáctenos a través de nuestro formulario de contacto o envíenos un correo electrónico a envios@deliciasmipatria.com
  `,
  aboutUs: `
# Sobre Nosotros

## Nuestra Historia
Delicias de mi Patria nació de la pasión por compartir los sabores auténticos y productos tradicionales de nuestra tierra. Fundada en 2015 por un grupo de entusiastas de la gastronomía, nuestra empresa comenzó como un pequeño puesto en ferias locales y ha crecido hasta convertirse en un referente de productos gourmet auténticos y de alta calidad.

## Nuestra Misión
Nuestra misión es acercar los sabores y tradiciones culinarias más auténticas a hogares de todo el país, manteniendo la calidad artesanal y apoyando a productores locales que preservan métodos tradicionales de elaboración.

## Nuestros Valores
- **Calidad**: Seleccionamos cuidadosamente cada producto para garantizar la mejor experiencia a nuestros clientes.
- **Autenticidad**: Valoramos las recetas tradicionales y los métodos de producción artesanal.
- **Sostenibilidad**: Nos comprometemos con prácticas comerciales responsables que respeten el medio ambiente.
- **Comunidad**: Apoyamos a productores locales y fomentamos el comercio justo.

## Nuestro Equipo
Somos un equipo diverso de apasionados por la gastronomía, expertos en alimentos y profesionales del servicio al cliente, todos compartiendo el mismo amor por nuestra herencia culinaria.

## Compromiso con la Calidad
Cada producto que ofrecemos es cuidadosamente seleccionado y probado para asegurar que cumple con nuestros altos estándares de calidad. Trabajamos directamente con productores para garantizar la frescura y autenticidad de nuestros productos.

## Contacte con Nosotros
Nos encantaría saber de usted. Si tiene alguna pregunta, sugerencia o simplemente quiere saludar, no dude en ponerse en contacto con nosotros a través de nuestro formulario de contacto o envíenos un correo electrónico a contacto@deliciasmipatria.com
  `,
  contactInfo: {
    phone: '+34 912 345 678',
    email: 'info@deliciasmipatria.com',
    address: 'Calle Principal 123, 28001 Madrid, España',
    hours: 'Lunes a Viernes: 9:00 - 20:00, Sábados: 10:00 - 15:00',
    facebook: 'https://facebook.com/deliciasmipatria',
    instagram: 'https://instagram.com/deliciasmipatria',
    whatsapp: '+34 600 123 456'
  },
  heroImage: '/images/latino-groceries.jpg'
};

// Inicializa el contenido del sitio en localStorage si no existe
export const initializeSiteContent = (): void => {
  if (!localStorage.getItem(SITE_CONTENT_KEY)) {
    localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(defaultSiteContent));
  }
};

// Obtiene todo el contenido del sitio
export const getSiteContent = (): SiteContent => {
  const content = localStorage.getItem(SITE_CONTENT_KEY);
  return content ? JSON.parse(content) : defaultSiteContent;
};

// Actualiza todo el contenido del sitio
export const updateSiteContent = (content: SiteContent): void => {
  localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(content));
};

// Obtiene solo la política de privacidad
export const getPrivacyPolicy = (): string => {
  return getSiteContent().privacyPolicy;
};

// Actualiza solo la política de privacidad
export const updatePrivacyPolicy = (policy: string): void => {
  const content = getSiteContent();
  content.privacyPolicy = policy;
  updateSiteContent(content);
};

// Obtiene solo la política de envío
export const getShippingPolicy = (): string => {
  return getSiteContent().shippingPolicy;
};

// Actualiza solo la política de envío
export const updateShippingPolicy = (policy: string): void => {
  const content = getSiteContent();
  content.shippingPolicy = policy;
  updateSiteContent(content);
};

// Obtiene solo la información de "Sobre Nosotros"
export const getAboutUs = (): string => {
  return getSiteContent().aboutUs;
};

// Actualiza solo la información de "Sobre Nosotros"
export const updateAboutUs = (aboutUs: string): void => {
  const content = getSiteContent();
  content.aboutUs = aboutUs;
  updateSiteContent(content);
};

// Obtiene solo la información de contacto
export const getContactInfo = () => {
  return getSiteContent().contactInfo;
};

// Actualiza solo la información de contacto
export const updateContactInfo = (contactInfo: Partial<ContactInfo>): void => {
  const content = getSiteContent();
  content.contactInfo = { ...content.contactInfo, ...contactInfo };
  updateSiteContent(content);
};

// Obtiene solo la imagen de hero
export const getHeroImage = (): string => {
  return getSiteContent().heroImage;
};

// Actualiza solo la imagen de hero
export const updateHeroImage = (imagePath: string): void => {
  const content = getSiteContent();
  content.heroImage = imagePath;
  updateSiteContent(content);
};