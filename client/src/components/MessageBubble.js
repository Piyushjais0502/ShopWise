import React from 'react';
import { FiUser } from 'react-icons/fi';
import { BiBot } from 'react-icons/bi'; // Replacing FiBot with BiBot

const MessageBubble = ({ sender, text, timestamp }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message-bubble ${sender}`}>
      <div className="message-content">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: sender === 'user' ? 'rgba(255,255,255,0.2)' : 'rgba(102, 126, 234, 0.1)',
              flexShrink: 0,
            }}
          >
            {sender === 'user' ? <FiUser size={12} /> : <BiBot size={12} />}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: '0.75rem',
                opacity: 0.7,
                marginBottom: '0.25rem',
                fontWeight: 500,
              }}
            >
              {sender === 'user' ? 'You' : 'ShopWise AI'}
            </div>
            <div style={{ lineHeight: '1.5' }}>{text}</div>
            {timestamp && (
              <div
                style={{
                  fontSize: '0.7rem',
                  opacity: 0.6,
                  marginTop: '0.5rem',
                  textAlign: sender === 'user' ? 'right' : 'left',
                }}
              >
                {formatTime(timestamp)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
