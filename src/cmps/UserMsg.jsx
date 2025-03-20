import { useEffect, useState } from 'react';
import { eventBusService } from '../services/event-bus.service';
import { AlertBanner, AlertBannerText, Icon } from '@vibe/core';
import { Check } from '@vibe/icons';

export function UserMsg() {
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const unsubscribe = eventBusService.on('show-user-msg', (msg) => {
      setMsg(msg);
      setTimeout(closeMsg, 3000);
    });

    return () => unsubscribe();
  }, []);

  function closeMsg() {
    setMsg(null);
  }

  if (!msg) return null;

  const backgroundColorMap = {
    success: 'positive',
    error: 'negative',
    warning: 'warning',
    info: 'dark',
  };

  return (
    <div className="user-msg-container">
      <Icon
        iconSize={40}
        icon={Check}
        style={{
          zIndex: '1000',
          color: 'black',
          top: '30px',
          position: 'absolute',
          //left: '45%',
          // marginLeft: 'calc(100% - 13px)',
          marginTop: '15px',
        }}
      />
      <AlertBanner
        backgroundColor={backgroundColorMap[msg.type] || 'dark'}
        onClose={closeMsg}
        canDismiss
      >
        <AlertBannerText text={msg.txt} className="user-msg-text" />
      </AlertBanner>
    </div>
  );
}
