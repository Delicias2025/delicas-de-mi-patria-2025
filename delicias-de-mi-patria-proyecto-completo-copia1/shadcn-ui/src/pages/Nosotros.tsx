import MainLayout from '@/components/layout/main-layout';

export default function NosotrosPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Sobre Nosotros</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            En Delicias de Mi Patria, nos dedicamos a traer lo mejor de la gastronomía mexicana directamente a tu hogar. 
            Nuestra pasión es compartir los sabores auténticos que han pasado de generación en generación.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Nuestra Historia</h2>
          <p>
            Fundada en 2015, Delicias de Mi Patria comenzó como un pequeño emprendimiento familiar con el sueño de 
            compartir las recetas tradicionales que habían sido el centro de nuestras reuniones familiares por décadas. 
            Lo que comenzó como un pequeño local ha crecido hasta convertirse en una tienda online que lleva 
            productos auténticos a todo el país.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Nuestra Misión</h2>
          <p>
            Nos dedicamos a preservar la autenticidad de la cocina mexicana ofreciendo productos de la más alta calidad. 
            Trabajamos directamente con productores locales para garantizar que cada producto que vendemos cumpla 
            con nuestros estándares de excelencia y autenticidad.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Nuestro Compromiso</h2>
          <p>
            Nos comprometemos a ofrecer:
          </p>
          <ul className="list-disc pl-6 space-y-2 my-4">
            <li>Productos de la más alta calidad</li>
            <li>Ingredientes frescos y auténticos</li>
            <li>Servicio al cliente excepcional</li>
            <li>Envíos seguros y rápidos a todo el país</li>
            <li>Prácticas sostenibles y respetuosas con el medio ambiente</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Nuestro Equipo</h2>
          <p>
            Detrás de Delicias de Mi Patria hay un equipo apasionado de personas dedicadas a compartir 
            la rica tradición culinaria mexicana. Desde nuestros chefs hasta nuestro equipo de atención al cliente, 
            todos compartimos el amor por la comida auténtica y el servicio excepcional.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}