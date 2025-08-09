import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StripeTestCard() {
  return (
    <Card className="mb-4 bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800">🧪 Modo de Prueba - Tarjetas de Prueba</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-blue-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">✅ Tarjeta que funciona:</p>
            <p>4242 4242 4242 4242</p>
            <p>Fecha: Cualquier fecha futura</p>
            <p>CVC: Cualquier 3 dígitos</p>
          </div>
          <div>
            <p className="font-semibold">❌ Tarjeta que falla:</p>
            <p>4000 0000 0000 0002</p>
            <p>Fecha: Cualquier fecha futura</p>
            <p>CVC: Cualquier 3 dígitos</p>
          </div>
        </div>
        <p className="text-xs italic">
          Nota: Estas son tarjetas de prueba. No se realizarán cargos reales.
        </p>
      </CardContent>
    </Card>
  );
}