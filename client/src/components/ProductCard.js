import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiHeart, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductCard = ({ product, addToCart, formatPrice }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="stars">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="stars">☆</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} style={{ color: '#e2e8f0' }}>★</span>);
    }
    
    return stars;
  };

  const handleBuyNow = () => {
    // Simulate purchase process
    toast.success(`Processing purchase for ${product.name}...`);
    
    // In a real app, this would redirect to checkout
    setTimeout(() => {
      toast.success(`Successfully purchased ${product.name}!`);
    }, 2000);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <motion.div
      className="product-card"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ position: 'relative' }}>
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400';
          }}
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <FiHeart size={16} color="#ef4444" />
        </motion.button>
        {!product.inStock && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            Out of Stock
          </div>
        )}
        {product.brand && (
          <div style={{
            position: 'absolute',
            top: '0.5rem',
            left: '0.5rem',
            background: 'rgba(102, 126, 234, 0.9)',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: '600'
          }}>
            {product.brand}
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-price">
          {formatPrice ? formatPrice(product.price) : `₹${product.price}`}
        </div>
        
        {product.rating && (
          <div className="product-rating">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {renderStars(product.rating)}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              ({product.reviews || 0} reviews)
            </span>
          </div>
        )}
        
        {product.description && (
          <p style={{ 
            fontSize: '0.85rem', 
            color: '#64748b', 
            marginBottom: '1rem',
            lineHeight: '1.4'
          }}>
            {product.description}
          </p>
        )}
        
        <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
          <motion.button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!product.inStock}
            style={{ 
              flex: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <FiShoppingCart size={16} style={{ marginRight: '0.5rem' }} />
            Add to Cart
          </motion.button>
          
          <motion.button
            onClick={handleBuyNow}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!product.inStock}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <FiZap size={16} />
            Buy Now
          </motion.button>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '0.75rem',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <span>Category: {product.category}</span>
          {product.color && <span>Color: {product.color}</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
