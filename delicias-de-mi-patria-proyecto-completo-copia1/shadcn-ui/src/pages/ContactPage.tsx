import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { getContactInfo } from '@/lib/site-content-service';
import { ContactInfo } from '@/types';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadContactInfo = () => {
      // Force refresh by clearing any cached data
      const info = getContactInfo();
      console.log('🔄 Loading contact info:', info);
      setContactInfo(info);
    };

    // Load initial data
    loadContactInfo();

    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      console.log('📱 Storage changed:', e.key);
      if (e.key === 'site-content') {
        loadContactInfo();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from the admin panel
    const handleContentUpdate = () => {
      console.log('🔔 Content update event received');
      loadContactInfo();
    };
    
    window.addEventListener('contentUpdated', handleContentUpdate);

    // Force reload every 2 seconds to ensure updates are caught
    const intervalId = setInterval(() => {
      loadContactInfo();
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('contentUpdated', handleContentUpdate);
      clearInterval(intervalId);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "¡Mensaje enviado!",
        description: "Nos pondremos en contacto contigo pronto.",
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1500);
  };

  if (!contactInfo) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Contacto</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="subject">Asunto</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Enviando...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar mensaje
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Información de contacto</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Teléfono</h3>
                  <p className="text-gray-600">{contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Correo electrónico</h3>
                  <p className="text-gray-600">{contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Nuestra ubicación</h3>
                  <p className="text-gray-600 whitespace-pre-line">{contactInfo.address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Horarios de atención</h3>
                  <p className="text-gray-600 whitespace-pre-line">{contactInfo.hours}</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            {(contactInfo.facebook || contactInfo.instagram || contactInfo.whatsapp) && (
              <div className="mt-8">
                <h3 className="font-medium mb-4">Síguenos en redes sociales</h3>
                <div className="flex space-x-4">
                  {contactInfo.facebook && (
                    <a
                      href={contactInfo.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                  {contactInfo.instagram && (
                    <a
                      href={contactInfo.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  {contactInfo.whatsapp && (
                    <a
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/[^\d]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}