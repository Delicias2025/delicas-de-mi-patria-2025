import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getContactInfo } from '@/lib/site-content-service';
import { ContactInfo } from '@/types';

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    const loadContactInfo = () => {
      const info = getContactInfo();
      setContactInfo(info);
    };

    loadContactInfo();

    // Listen for updates from admin panel
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'site-content') {
        loadContactInfo();
      }
    };

    const handleContentUpdate = () => {
      loadContactInfo();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('contentUpdated', handleContentUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('contentUpdated', handleContentUpdate);
    };
  }, []);

  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* About Column */}
          <div>
            <h3 className="text-lg font-bold mb-4">DELICIAS DE MI PATRIA</h3>
            <p className="text-gray-600 mb-4">
              Ofrecemos los mejores productos típicos y tradicionales directamente a tu hogar. Sabores auténticos para todos los gustos.
            </p>
            {contactInfo && (
              <div className="flex space-x-4">
                {contactInfo.facebook && (
                  <a 
                    href={contactInfo.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {contactInfo.instagram && (
                  <a 
                    href={contactInfo.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {contactInfo.tiktok && (
                  <a 
                    href={contactInfo.tiktok} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.16 20.5a6.34 6.34 0 0 0 10.86-4.43V7.83a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.2-.26z" />
                    </svg>
                  </a>
                )}
                {contactInfo.twitter && (
                  <a 
                    href={contactInfo.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-gray-600 hover:text-primary">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-600 hover:text-primary">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-lg font-bold mb-4">Políticas</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/politicas-privacidad" className="text-gray-600 hover:text-primary">
                  Políticas de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/politicas-envio" className="text-gray-600 hover:text-primary">
                  Políticas de Envío
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} DELICIAS DE MI PATRIA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}