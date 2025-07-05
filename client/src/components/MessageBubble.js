import React from 'react';

const MessageBubble = ({ sender, text }) => {
  const isUser = sender === 'user';
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      style={{
        textAlign: isUser ? 'right' : 'left',
        marginBottom: '10px'
      }}
    >
      <div
        style={{
          display: 'inline-block',
          background: isUser ? '#007bff' : '#e4e4e4',
          color: isUser ? '#fff' : '#000',
          padding: '10px',
          borderRadius: '15px',
          maxWidth: '70%'
        }}
      >
        {text}
        <div style={{ fontSize: '0.7rem', marginTop: '5px', textAlign: 'right', opacity: 0.7 }}>
          {time}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
