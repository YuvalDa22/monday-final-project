import { useEffect, useState } from 'react';
import { eventBusService } from '../services/event-bus.service';
import { Check, XCircle } from 'lucide-react'; // Lightweight icons

export function UserMsg() {
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const unsubscribe = eventBusService.on('show-user-msg', (msg) => {
      setMsg(msg);
      setTimeout(closeMsg, 1500);
    });

    return () => unsubscribe();
  }, []);

  function closeMsg() {
    setMsg(null);
  }

  if (!msg) return null;

  const bgColor =
    {
      success: '#00854d',
      error: '#d83a52',
      warning: '#FFCB00',
      info: '#579BFC',
    }[msg.type] || '#579BFC';

  return (
    <div className="user-msg-container" style={{ backgroundColor: bgColor }}>
      <svg className="alert-icon" width="20" height="20" viewBox="0 0 24 24">
        <path fill="white" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
      </svg>
      <span className="user-msg-text">{msg.txt}</span>
      <svg
        className="close-icon"
        onClick={closeMsg}
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        <path
          d="M18 6 L6 18 M6 6 L18 18"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
