import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: 250,
        aspectRatio: 1.0
    });
    scanner.render(onScanSuccess, (err) => console.log(err));

    return () => {
        scanner.clear().catch(e => console.error(e));
    };
  }, [onScanSuccess]);

  return <div id="reader" className="w-full max-w-sm mx-auto"></div>;
};

export default QRScanner;
