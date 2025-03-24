import React, { useState } from 'react';
import { Wifi, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

function NetworkInfo() {
  const [showQR, setShowQR] = useState(false);
  const networkUrl = 'https://totemariztia.netlify.app';

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Wifi className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Acceso al Sistema</h3>
        </div>
        <button
          onClick={() => setShowQR(!showQR)}
          className="p-2 hover:bg-gray-100 rounded-full transition"
          title={showQR ? "Ocultar código QR" : "Mostrar código QR"}
        >
          <QrCode className={`h-5 w-5 ${showQR ? 'text-blue-600' : 'text-gray-600'}`} />
        </button>
      </div>
      
      <p className="text-sm text-gray-600">
        Este sistema está disponible en:
      </p>
      
      <code className="block bg-gray-100 p-2 rounded mt-2 text-sm font-mono break-all">
        {networkUrl}
      </code>

      {showQR && (
        <div className="mt-4 flex flex-col items-center bg-white p-4 rounded-lg border border-gray-200">
          <QRCodeSVG
            value={networkUrl}
            size={200}
            level="H"
            includeMargin={true}
            className="mb-2"
          />
          <p className="text-xs text-gray-500 text-center">
            Escanee este código QR para acceder al sistema desde su dispositivo móvil
          </p>
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        Acceda al sistema desde cualquier dispositivo usando esta dirección
      </p>
    </div>
  );
}

export default NetworkInfo;