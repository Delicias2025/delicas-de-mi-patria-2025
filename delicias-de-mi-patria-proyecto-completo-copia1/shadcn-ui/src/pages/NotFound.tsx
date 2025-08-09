import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/main-layout';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold mt-6">Página No Encontrada</h2>
        <p className="text-xl text-gray-600 mt-4 max-w-lg mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button asChild className="mt-8">
          <Link to="/">Volver al Inicio</Link>
        </Button>
      </div>
    </MainLayout>
  );
}