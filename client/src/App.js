import React from 'react';
import ChatBox from './components/ChatBox';
import './App.css';

function App() {
  return (
    <div className="App">
      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>🛍️ ShopWise – Your Smart Shopping Assistant</h2>
      <ChatBox />
    </div>
  );
}

export default App;
