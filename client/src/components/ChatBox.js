import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import './ChatBox.css';

const ChatBox = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I'm your AI-powered retail assistant for Sparkathon 2025! 🛍️\n\nI can help you with:\n• Shopping and product recommendations\n• General knowledge questions\n• Technology, science, history explanations\n• Casual conversation\n• Shopping advice and comparisons\n\nTry asking me anything like:\n• \"Show me blue jeans under Rs.1800\"\n• \"What's the weather in Mumbai?\"\n• \"Tell me a joke\"\n• \"What are the latest tech trends?\"",
      timestamp: new Date().toISOString(),
      products: [],
      isTyping: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Quick reply suggestions for Sparkathon
  const quickReplies = [
    "Show me blue jeans under Rs.1800",
    "What's the weather in Mumbai?",
    "Tell me a joke",
    "Show me eco-friendly products",
    "What are the latest tech trends?",
    "Find red sneakers for men",
    "Show me women's dresses",
    "iPhone 15 Pro price",
    "Similar products to Nike Air Max",
    "Add to cart"
  ];

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('new_message', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: data.sender,
        text: data.text,
        timestamp: data.timestamp,
        products: data.products || [],
        isTyping: false
      }]);
    });

    newSocket.on('user_typing', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: '...',
        timestamp: new Date().toISOString(),
        products: [],
        isTyping: true
      }]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toISOString(),
      products: [],
      isTyping: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:5000'}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          userId: 'user_' + Date.now()
        }),
      });

      const data = await response.json();

      if (data.reply) {
        const botMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          text: data.reply,
          timestamp: data.timestamp,
          products: data.results || [],
          isTyping: false
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "Sorry, I'm having trouble connecting right now. Please try again!",
        timestamp: new Date().toISOString(),
        products: [],
        isTyping: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    
    // Show toast notification
    showToast(`${product.name} added to cart! 🛒`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    showToast('Item removed from cart!');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev => prev.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const showToast = (message) => {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getDiscountPercentage = (originalPrice, currentPrice) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">🛍️</div>
            <div className="title">
              <h2>ShopWise</h2>
              <p>AI-Powered Retail Assistant</p>
              <span className="sparkathon-badge">Sparkathon 2025</span>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="cart-button"
              onClick={() => setShowCart(!showCart)}
            >
              🛒 <span className="cart-count">{cart.length}</span>
            </button>
            <div className="connection-status">
              <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-container">
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <div className="message-text">
                  {message.isTyping ? (
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    <div className="text-content">
                      {message.text.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
                
                {message.products && message.products.length > 0 && (
                  <div className="products-grid">
                    {message.products.slice(0, 6).map((product) => (
                      <div key={product.id} className="product-card">
                        <div className="product-image">
                          <img src={product.image} alt={product.name} />
                          {product.ecoFriendly && (
                            <div className="eco-badge">🌱 Eco</div>
                          )}
                          {product.discount > 0 && (
                            <div className="discount-badge">
                              -{product.discount}%
                            </div>
                          )}
                        </div>
                        <div className="product-info">
                          <h4 className="product-name">{product.name}</h4>
                          <div className="product-brand">{product.brand}</div>
                          <div className="product-rating">
                            ⭐ {product.rating} ({product.reviews} reviews)
                          </div>
                          <div className="product-price">
                            <span className="current-price">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="original-price">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <div className="product-actions">
                            <button 
                              className="add-to-cart-btn"
                              onClick={() => addToCart(product)}
                            >
                              Add to Cart
                            </button>
                            <button className="buy-now-btn">
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="message-timestamp">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Replies */}
      <div className="quick-replies">
        <div className="quick-replies-scroll">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              className="quick-reply-btn"
              onClick={() => handleQuickReply(reply)}
              disabled={isLoading}
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything... (e.g., 'Show me blue jeans under Rs.1800')"
            disabled={isLoading}
            rows="1"
          />
          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="cart-sidebar">
          <div className="cart-header">
            <h3>Shopping Cart</h3>
            <button 
              className="close-cart"
              onClick={() => setShowCart(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <p>Add some products to get started!</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>{item.brand}</p>
                    <div className="item-price">
                      {formatPrice(item.price)} × {item.quantity}
                    </div>
                  </div>
                  <div className="item-actions">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="remove-btn"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span className="total-price">{formatPrice(getTotalPrice())}</span>
              </div>
              <button className="checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Toast Notifications */}
      <style jsx>{`
        .toast-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #4CAF50;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transform: translateX(100%);
          transition: transform 0.3s ease;
          z-index: 1000;
        }
        
        .toast-notification.show {
          transform: translateX(0);
        }
      `}</style>
    </div>
  );
};

export default ChatBox;
