import MainLayout from '@/components/layout/main-layout';

export default function PoliticasEnvio() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Políticas de Envío</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Áreas de Cobertura</h2>
            <p className="mb-6 text-gray-700">
              Realizamos envíos a todo el territorio nacional. Para envíos internacionales, 
              favor contactarnos directamente para verificar disponibilidad y costos.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Tiempos de Entrega</h2>
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3">Envío Estándar</h3>
              <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1">
                <li>Área metropolitana: 2-3 días hábiles</li>
                <li>Interior del país: 3-5 días hábiles</li>
                <li>Zonas rurales: 5-7 días hábiles</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">Envío Express</h3>
              <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1">
                <li>Área metropolitana: 24-48 horas</li>
                <li>Interior del país: 2-3 días hábiles</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Costos de Envío</h2>
            <p className="mb-4 text-gray-700">
              Los costos de envío se calculan automáticamente según:
            </p>
            <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
              <li>Peso y dimensiones del paquete</li>
              <li>Destino de entrega</li>
              <li>Tipo de envío seleccionado</li>
            </ul>
            <p className="mb-6 text-gray-700">
              <strong>Envío gratis:</strong> En pedidos superiores a $50.00 dentro del área metropolitana.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Preparación del Pedido</h2>
            <p className="mb-6 text-gray-700">
              Los pedidos se procesan en el orden recibido. El tiempo de preparación es de 1-2 días hábiles 
              antes del envío. Los productos perecederos reciben prioridad en el procesamiento.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Seguimiento del Envío</h2>
            <p className="mb-6 text-gray-700">
              Una vez despachado su pedido, recibirá un número de seguimiento por email y SMS para 
              rastrear su paquete en tiempo real. También puede consultar el estado desde su cuenta 
              en nuestro sitio web.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Entrega</h2>
            <p className="mb-4 text-gray-700">
              Nuestros repartidores realizan entregas de lunes a viernes de 8:00 AM a 6:00 PM, 
              y sábados de 8:00 AM a 2:00 PM.
            </p>
            <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
              <li>Se requiere la presencia del destinatario o persona autorizada</li>
              <li>Se solicita identificación oficial</li>
              <li>En caso de ausencia, se dejará aviso para reagendar</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">Productos Perecederos</h2>
            <p className="mb-6 text-gray-700">
              Los productos que requieren refrigeración son enviados en empaques especiales con 
              gel refrigerante. Es importante recibir estos productos el mismo día de la entrega 
              para garantizar su calidad.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Problemas con el Envío</h2>
            <p className="mb-6 text-gray-700">
              Si su pedido llega dañado, incompleto o no llega en el tiempo estimado, 
              contáctenos inmediatamente:
            </p>
            <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
              <li>Email: info@deliciaspatria.com</li>
              <li>Teléfono: (123) 456-789</li>
              <li>WhatsApp: +123 456 7890</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">Cambios en la Dirección</h2>
            <p className="text-gray-700">
              Los cambios de dirección solo pueden realizarse antes del despacho del pedido. 
              Una vez enviado, no es posible modificar el destino.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}