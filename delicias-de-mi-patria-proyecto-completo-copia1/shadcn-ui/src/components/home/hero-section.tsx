import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { getHeroImage } from '@/lib/site-content-service';

export default function HeroSection() {
  const [heroImage, setHeroImage] = useState('/images/latino-groceries.jpg');

  useEffect(() => {
    // Obtenemos la imagen del hero desde el servicio de contenido
    const image = getHeroImage();
    if (image) {
      setHeroImage(image);
    }
  }, []);

  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-sky-100 py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Sabores Auténticos de <span className="text-primary">Centroamérica</span>
            </h1>
            <p className="text-xl text-gray-700">
              Descubre nuestra selección de productos tradicionales y delicias artesanales entregadas directamente a tu hogar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="font-medium">
                <Link to="/categorias/todos">Ver Productos</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-medium">
                <Link to="/nosotros">Conócenos</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px]">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-lg shadow-lg border overflow-hidden">
              <img
                src={heroImage}
                alt="Productos Centroamericanos"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl"></div>
    </section>
  );
}