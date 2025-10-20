import { useState, useEffect } from 'react';
import { getWhatsAppSettings } from '../services/storage';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const whatsappSettings = getWhatsAppSettings();
    setSettings(whatsappSettings);
  }, []);

  if (!settings || !settings.enabled || !settings.phoneNumber) {
    return null;
  }

  const handleClick = () => {
    const phoneNumber = settings.phoneNumber.replace(/\D/g, ''); // Remove non-numeric characters
    const message = encodeURIComponent(settings.defaultMessage || 'Merhaba');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button className="whatsapp-floating-button" onClick={handleClick} aria-label="WhatsApp Destek">
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="currentColor"
          d="M16 0C7.164 0 0 7.163 0 16c0 2.828.736 5.58 2.137 7.996L.134 30.33a.75.75 0 0 0 .936.936l6.334-2.003A15.938 15.938 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.5a13.44 13.44 0 0 1-6.854-1.86.75.75 0 0 0-.67-.054l-4.174 1.319 1.319-4.174a.75.75 0 0 0-.054-.67A13.437 13.437 0 0 1 2.5 16C2.5 8.544 8.544 2.5 16 2.5S29.5 8.544 29.5 16 23.456 29.5 16 29.5z"
        />
        <path
          fill="currentColor"
          d="M23.146 19.313c-.285-.143-1.688-.833-1.95-.928-.262-.095-.452-.143-.643.143-.19.285-.738.928-.904 1.119-.167.19-.333.214-.619.071-.285-.143-1.205-.444-2.296-1.416-.849-.757-1.422-1.692-1.589-1.977-.166-.286-.017-.44.125-.582.128-.128.285-.333.428-.5.143-.166.19-.285.286-.476.095-.19.047-.357-.024-.5-.071-.143-.643-1.548-.881-2.119-.232-.557-.467-.481-.643-.49-.166-.008-.357-.01-.547-.01-.19 0-.5.071-.762.357-.262.285-1 .976-1 2.38s1.024 2.762 1.167 2.952c.143.19 2.012 3.07 4.875 4.305.681.294 1.213.47 1.627.602.684.217 1.307.186 1.799.113.549-.082 1.688-.69 1.926-1.357.238-.666.238-1.238.167-1.357-.071-.119-.262-.19-.547-.333z"
        />
      </svg>
    </button>
  );
};

export default WhatsAppButton;
