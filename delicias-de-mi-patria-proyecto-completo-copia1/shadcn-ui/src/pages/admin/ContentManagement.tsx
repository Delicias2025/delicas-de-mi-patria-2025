import { useState, useEffect } from 'react';
// Removed AdminLayout import as we're using Outlet now
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { getSiteContent, updatePrivacyPolicy, updateShippingPolicy, updateAboutUs, updateContactInfo, updateHeroImage } from '@/lib/site-content-service';
import { SiteContent, ContactInfo } from '@/types';

export default function ContentManagement() {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<string>('contacto');
  const [loading, setLoading] = useState<boolean>(false);

  // Cargar el contenido del sitio
  useEffect(() => {
    const content = getSiteContent();
    setSiteContent(content);
  }, []);

  const handleSavePrivacyPolicy = () => {
    if (!siteContent) return;
    
    setLoading(true);
    try {
      updatePrivacyPolicy(siteContent.privacyPolicy);
      toast.success('Política de privacidad actualizada correctamente');
    } catch (error) {
      toast.error('Error al actualizar la política de privacidad');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveShippingPolicy = () => {
    if (!siteContent) return;
    
    setLoading(true);
    try {
      updateShippingPolicy(siteContent.shippingPolicy);
      toast.success('Política de envío actualizada correctamente');
    } catch (error) {
      toast.error('Error al actualizar la política de envío');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAboutUs = () => {
    if (!siteContent) return;
    
    setLoading(true);
    try {
      updateAboutUs(siteContent.aboutUs);
      toast.success('Información "Sobre Nosotros" actualizada correctamente');
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('contentUpdated'));
    } catch (error) {
      toast.error('Error al actualizar la información "Sobre Nosotros"');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContactInfo = () => {
    if (!siteContent) return;
    
    setLoading(true);
    try {
      updateContactInfo(siteContent.contactInfo);
      toast.success('Información de contacto actualizada correctamente');
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('contentUpdated'));
    } catch (error) {
      toast.error('Error al actualizar la información de contacto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactInfoChange = (field: keyof ContactInfo, value: string) => {
    if (!siteContent) return;
    
    setSiteContent({
      ...siteContent,
      contactInfo: {
        ...siteContent.contactInfo,
        [field]: value
      }
    });
  };

  if (!siteContent) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestión de Contenido</h1>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Contenido</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="contacto">Información de Contacto</TabsTrigger>
          <TabsTrigger value="privacidad">Política de Privacidad</TabsTrigger>
          <TabsTrigger value="envios">Política de Envíos</TabsTrigger>
          <TabsTrigger value="nosotros">Sobre Nosotros</TabsTrigger>
          <TabsTrigger value="hero">Imagen Principal</TabsTrigger>
        </TabsList>

        {/* Información de Contacto */}
        <TabsContent value="contacto">
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Teléfono</label>
                <Input 
                  id="phone"
                  value={siteContent.contactInfo.phone}
                  onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                  placeholder="Ej: +34 912 345 678"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Correo Electrónico</label>
                <Input 
                  id="email"
                  value={siteContent.contactInfo.email}
                  onChange={(e) => handleContactInfoChange('email', e.target.value)}
                  placeholder="Ej: info@deliciasmipatria.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">Dirección</label>
                <Input 
                  id="address"
                  value={siteContent.contactInfo.address}
                  onChange={(e) => handleContactInfoChange('address', e.target.value)}
                  placeholder="Ej: Calle Principal 123, 28001 Madrid, España"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="hours" className="text-sm font-medium">Horario de Atención</label>
                <Input 
                  id="hours"
                  value={siteContent.contactInfo.hours}
                  onChange={(e) => handleContactInfoChange('hours', e.target.value)}
                  placeholder="Ej: Lunes a Viernes: 9:00 - 20:00, Sábados: 10:00 - 15:00"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="facebook" className="text-sm font-medium">Facebook (opcional)</label>
                <Input 
                  id="facebook"
                  value={siteContent.contactInfo.facebook || ''}
                  onChange={(e) => handleContactInfoChange('facebook', e.target.value)}
                  placeholder="Ej: https://facebook.com/deliciasmipatria"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="instagram" className="text-sm font-medium">Instagram (opcional)</label>
                <Input 
                  id="instagram"
                  value={siteContent.contactInfo.instagram || ''}
                  onChange={(e) => handleContactInfoChange('instagram', e.target.value)}
                  placeholder="Ej: https://instagram.com/deliciasmipatria"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp (opcional)</label>
                <Input 
                  id="whatsapp"
                  value={siteContent.contactInfo.whatsapp || ''}
                  onChange={(e) => handleContactInfoChange('whatsapp', e.target.value)}
                  placeholder="Ej: +34 600 123 456"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="tiktok" className="text-sm font-medium">TikTok (opcional)</label>
                <Input 
                  id="tiktok"
                  value={siteContent.contactInfo.tiktok || ''}
                  onChange={(e) => handleContactInfoChange('tiktok', e.target.value)}
                  placeholder="Ej: https://tiktok.com/@deliciasmipatria"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="twitter" className="text-sm font-medium">Twitter/X (opcional)</label>
                <Input 
                  id="twitter"
                  value={siteContent.contactInfo.twitter || ''}
                  onChange={(e) => handleContactInfoChange('twitter', e.target.value)}
                  placeholder="Ej: https://twitter.com/deliciasmipatria"
                />
              </div>

              <Button 
                onClick={handleSaveContactInfo} 
                disabled={loading}
                className="w-full mt-4"
              >
                {loading ? 'Guardando...' : 'Guardar Información de Contacto'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Política de Privacidad */}
        <TabsContent value="privacidad">
          <Card>
            <CardHeader>
              <CardTitle>Política de Privacidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label htmlFor="privacy-policy" className="text-sm font-medium">
                  Contenido de la Política de Privacidad
                </label>
                <Textarea 
                  id="privacy-policy"
                  value={siteContent.privacyPolicy}
                  onChange={(e) => setSiteContent({...siteContent, privacyPolicy: e.target.value})}
                  placeholder="Escribe aquí la política de privacidad..."
                  className="min-h-[400px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  * Puedes utilizar formato Markdown para dar estilo al texto (títulos, listas, enlaces, etc.)
                </p>
              </div>
              <Button 
                onClick={handleSavePrivacyPolicy} 
                disabled={loading}
                className="mt-4"
              >
                {loading ? 'Guardando...' : 'Guardar Política de Privacidad'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Política de Envíos */}
        <TabsContent value="envios">
          <Card>
            <CardHeader>
              <CardTitle>Política de Envíos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label htmlFor="shipping-policy" className="text-sm font-medium">
                  Contenido de la Política de Envíos
                </label>
                <Textarea 
                  id="shipping-policy"
                  value={siteContent.shippingPolicy}
                  onChange={(e) => setSiteContent({...siteContent, shippingPolicy: e.target.value})}
                  placeholder="Escribe aquí la política de envíos..."
                  className="min-h-[400px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  * Puedes utilizar formato Markdown para dar estilo al texto (títulos, listas, enlaces, etc.)
                </p>
              </div>
              <Button 
                onClick={handleSaveShippingPolicy} 
                disabled={loading}
                className="mt-4"
              >
                {loading ? 'Guardando...' : 'Guardar Política de Envíos'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sobre Nosotros */}
        <TabsContent value="nosotros">
          <Card>
            <CardHeader>
              <CardTitle>Sobre Nosotros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label htmlFor="about-us" className="text-sm font-medium">
                  Contenido de la sección "Sobre Nosotros"
                </label>
                <Textarea 
                  id="about-us"
                  value={siteContent.aboutUs}
                  onChange={(e) => setSiteContent({...siteContent, aboutUs: e.target.value})}
                  placeholder="Escribe aquí la información sobre tu negocio..."
                  className="min-h-[400px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  * Puedes utilizar formato Markdown para dar estilo al texto (títulos, listas, enlaces, etc.)
                </p>
              </div>
              <Button 
                onClick={handleSaveAboutUs} 
                disabled={loading}
                className="mt-4"
              >
                {loading ? 'Guardando...' : 'Guardar Sobre Nosotros'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Imagen Principal */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Imagen Principal</CardTitle>
              <CardDescription>
                Cambia la imagen principal que se muestra en la página de inicio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="hero-image" className="text-sm font-medium">
                    Ruta de la imagen principal
                  </label>
                  <Input 
                    id="hero-image"
                    value={siteContent.heroImage}
                    onChange={(e) => setSiteContent({...siteContent, heroImage: e.target.value})}
                    placeholder="/images/nombre-de-imagen.jpg"
                  />
                  <p className="text-xs text-gray-500">
                    Introduce la ruta de la imagen. Las imágenes deben estar en la carpeta /images/
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Imagen actual:</p>
                  <div className="border rounded-md overflow-hidden h-[200px]">
                    <img
                      src={siteContent.heroImage}
                      alt="Imagen principal"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Imágenes disponibles:</p>
                  <div className="grid grid-cols-3 gap-4">
                    <ImageOption 
                      src="/images/latino-groceries.jpg" 
                      alt="Latino Groceries" 
                      onClick={() => setSiteContent({...siteContent, heroImage: '/images/latino-groceries.jpg'})}
                      selected={siteContent.heroImage === '/images/latino-groceries.jpg'}
                    />
                    <ImageOption 
                      src="/images/Food.jpg" 
                      alt="Food" 
                      onClick={() => setSiteContent({...siteContent, heroImage: '/images/Food.jpg'})}
                      selected={siteContent.heroImage === '/images/Food.jpg'}
                    />
                    <ImageOption 
                      src="/images/exampleimage.jpg" 
                      alt="Example Image" 
                      onClick={() => setSiteContent({...siteContent, heroImage: '/images/exampleimage.jpg'})}
                      selected={siteContent.heroImage === '/images/exampleimage.jpg'}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    setLoading(true);
                    try {
                      updateHeroImage(siteContent.heroImage);
                      toast.success('Imagen principal actualizada correctamente');
                    } catch (error) {
                      toast.error('Error al actualizar la imagen principal');
                      console.error(error);
                    } finally {
                      setLoading(false);
                    }
                  }} 
                  disabled={loading}
                  className="w-full mt-4"
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente para mostrar una opción de imagen
interface ImageOptionProps {
  src: string;
  alt: string;
  onClick: () => void;
  selected: boolean;
}

function ImageOption({ src, alt, onClick, selected }: ImageOptionProps) {
  return (
    <div 
      className={`cursor-pointer border-2 rounded-md overflow-hidden h-[80px] ${selected ? 'border-primary' : 'border-gray-200'}`}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/images/placeholder.jpg';
        }}
      />
    </div>
  );
}