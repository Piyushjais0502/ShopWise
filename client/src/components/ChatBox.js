import React, { useState } from 'react';
import axios from 'axios';
import MessageBubble from './MessageBubble';
import ProductCard from './ProductCard';

const ChatBox = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/chat', { message: input });

      const botMessage = { sender: 'bot', text: res.data.reply };
      setMessages(prev => [...prev, botMessage]);
      setProducts(res.data.results);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: '⚠️ Server not responding. Please try again later.' }
      ]);
    }

    setLoading(false);
  };

  const handleAddToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  const suggestions = ['Show me jackets', 'Under 2000', 'Red sneakers'];

  return (
    <div className="chat-container">
      {/* Message Area */}
      <div className="messages">
        {messages.map((msg, i) => (
          <MessageBubble key={i} {...msg} />
        ))}
      </div>

      {/* Quick Replies */}
      <div className="quick-replies">
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => setInput(s)}>
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Ask something like: red sneakers under 3000"
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>

      {/* Loader */}
      {loading && (
        <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'gray' }}>
          Thinking...
        </p>
      )}

      {/* Products */}
      <div className="product-grid">
        {products.map(p => (
          <ProductCard key={p.id} product={p} addToCart={handleAddToCart} />
        ))}
      </div>

      {/* Cart */}
      {cart.length > 0 && (
        <div className="cart-section">
          <h3>🛒 Your Cart</h3>
          {cart.map((item, i) => (
            <div key={i} className="cart-item">
              <span>{item.name}</span>
              <span>Rs. {item.price}</span>
              <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
            </div>
          ))}
          <h4>Total: Rs. {getTotal()}</h4>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
