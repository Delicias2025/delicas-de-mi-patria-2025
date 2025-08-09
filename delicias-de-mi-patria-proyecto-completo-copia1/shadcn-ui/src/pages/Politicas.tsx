import MainLayout from '@/components/layout/main-layout';

export default function PoliticasPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Políticas</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">Políticas de Privacidad</h2>
          
          <p className="mb-4">
            En Delicias de Mi Patria, respetamos tu privacidad y nos comprometemos a proteger tus datos personales.
            Esta política de privacidad explica cómo recopilamos, usamos y protegemos la información que nos proporcionas.
          </p>
          
          <h3 className="text-xl font-medium mt-6 mb-3">Información que recopilamos</h3>
          <p>Podemos recopilar la siguiente información:</p>
          <ul className="list-disc pl-6 space-y-1 my-3">
            <li>Nombre y apellidos</li>
            <li>Información de contacto, incluyendo dirección de correo electrónico y número de teléfono</li>
            <li>Dirección de envío</li>
            <li>Información demográfica como preferencias y intereses</li>
            <li>Otra información relevante para encuestas y ofertas</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-6 mb-3">Uso de la información</h3>
          <p>Utilizamos la información recopilada para:</p>
          <ul className="list-disc pl-6 space-y-1 my-3">
            <li>Procesar pedidos y envíos</li>
            <li>Mejorar nuestros productos y servicios</li>
            <li>Enviar comunicaciones promocionales</li>
            <li>Personalizar tu experiencia de usuario</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-6 mb-3">Seguridad</h3>
          <p>
            Estamos comprometidos a garantizar que tu información esté segura. Para prevenir accesos o divulgaciones no 
            autorizadas, hemos implementado procedimientos físicos, electrónicos y administrativos adecuados para 
            salvaguardar y asegurar la información que recopilamos.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Términos y Condiciones</h2>
          
          <h3 className="text-xl font-medium mt-6 mb-3">Uso del sitio web</h3>
          <p>
            El uso de este sitio web está sujeto a los siguientes términos y condiciones:
          </p>
          <ul className="list-disc pl-6 space-y-1 my-3">
            <li>El contenido de las páginas de este sitio web es para tu información general y uso personal únicamente.</li>
            <li>Está sujeto a cambios sin previo aviso.</li>
            <li>Ni nosotros ni terceros proporcionamos ninguna garantía sobre la exactitud, puntualidad, rendimiento, integridad o idoneidad de la información y los materiales encontrados u ofrecidos en este sitio web para cualquier propósito particular.</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-6 mb-3">Envíos y entregas</h3>
          <p>
            Todos los pedidos están sujetos a disponibilidad y confirmación del precio. El tiempo de entrega dependerá 
            de la ubicación y puede variar de 1 a 7 días hábiles. En caso de que un producto no esté disponible, 
            te contactaremos para ofrecerte alternativas o el reembolso correspondiente.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Política de Devoluciones</h2>
          
          <p>
            En Delicias de Mi Patria, queremos que estés completamente satisfecho con tu compra. Si no estás contento 
            con tu pedido por cualquier motivo, puedes devolverlo dentro de los 30 días siguientes a la recepción.
          </p>
          
          <h3 className="text-xl font-medium mt-6 mb-3">Condiciones para devoluciones</h3>
          <ul className="list-disc pl-6 space-y-1 my-3">
            <li>El producto debe estar sin usar y en su embalaje original</li>
            <li>Debe incluir todos los accesorios y etiquetas</li>
            <li>Se requiere el comprobante de compra</li>
          </ul>
          
          <h3 className="text-xl font-medium mt-6 mb-3">Proceso de devolución</h3>
          <ol className="list-decimal pl-6 space-y-1 my-3">
            <li>Contacta con nuestro servicio al cliente para notificar la devolución</li>
            <li>Envía el producto a la dirección proporcionada</li>
            <li>Una vez recibido y verificado el producto, procesaremos el reembolso</li>
          </ol>
          
          <p className="mt-8 text-sm text-gray-500">
            Última actualización: Agosto 2025
          </p>
        </div>
      </div>
    </MainLayout>
  );
}