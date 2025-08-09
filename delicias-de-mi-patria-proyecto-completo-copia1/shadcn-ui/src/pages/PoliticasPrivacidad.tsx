import MainLayout from '@/components/layout/main-layout';

export default function PoliticasPrivacidad() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Políticas de Privacidad</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Información que Recopilamos</h2>
            <p className="mb-6 text-gray-700">
              En DELICIAS DE MI PATRIA recopilamos información personal que usted nos proporciona voluntariamente 
              cuando se registra en nuestro sitio web, realiza una compra, se suscribe a nuestro boletín 
              informativo o se comunica con nosotros.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Uso de la Información</h2>
            <p className="mb-6 text-gray-700">
              Utilizamos la información recopilada para los siguientes propósitos:
            </p>
            <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
              <li>Procesar y cumplir con sus pedidos</li>
              <li>Mejorar nuestro servicio al cliente</li>
              <li>Enviarle comunicaciones relacionadas con sus pedidos</li>
              <li>Personalizar su experiencia en nuestro sitio web</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">Protección de Datos</h2>
            <p className="mb-6 text-gray-700">
              Implementamos medidas de seguridad apropiadas para proteger su información personal contra 
              acceso no autorizado, alteración, divulgación o destrucción. Sus datos de pago son 
              procesados a través de proveedores seguros como Stripe y PayPal.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Compartir Información</h2>
            <p className="mb-6 text-gray-700">
              No vendemos, intercambiamos ni transferimos su información personal a terceros, excepto:
            </p>
            <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
              <li>Para completar transacciones y entregas</li>
              <li>Cuando sea requerido por ley</li>
              <li>Para proteger nuestros derechos y seguridad</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p className="mb-6 text-gray-700">
              Utilizamos cookies para mejorar su experiencia de navegación, recordar sus preferencias 
              y analizar el tráfico de nuestro sitio web.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Sus Derechos</h2>
            <p className="mb-6 text-gray-700">
              Usted tiene derecho a:
            </p>
            <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
              <li>Acceder a su información personal</li>
              <li>Corregir información inexacta</li>
              <li>Solicitar la eliminación de sus datos</li>
              <li>Retirar su consentimiento en cualquier momento</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
            <p className="text-gray-700">
              Si tiene preguntas sobre estas políticas de privacidad, puede contactarnos en:
              <br />
              Email: info@deliciaspatria.com
              <br />
              Teléfono: (123) 456-789
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}