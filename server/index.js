require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const OpenAI = require('openai');
const axios = require('axios');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key'
});

// Enhanced Product Catalog with Sparkathon Theme
const enhancedProducts = [
  // Men's Clothing
  {
    id: "m1",
    name: "Levi's 501 Original Jeans",
    category: "men's clothing",
    subcategory: "jeans",
    color: "blue",
    price: 2499,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    description: "Classic straight-fit jeans with authentic vintage appeal",
    rating: 4.6,
    reviews: 234,
    inStock: true,
    brand: "Levi's",
    sizes: ["30", "32", "34", "36"],
    ecoFriendly: false,
    discount: 17
  },
  {
    id: "m2",
    name: "Nike Air Max 270",
    category: "men's clothing",
    subcategory: "sneakers",
    color: "red",
    price: 8999,
    originalPrice: 10999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    description: "Comfortable running shoes with air cushioning technology",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    brand: "Nike",
    sizes: ["7", "8", "9", "10", "11"],
    ecoFriendly: false,
    discount: 18
  },
  {
    id: "m3",
    name: "Adidas Ultraboost 22",
    category: "men's clothing",
    subcategory: "sneakers",
    color: "white",
    price: 15999,
    originalPrice: 17999,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400",
    description: "Premium running shoes with boost technology",
    rating: 4.7,
    reviews: 256,
    inStock: true,
    brand: "Adidas",
    sizes: ["7", "8", "9", "10", "11"],
    ecoFriendly: true,
    discount: 11
  },
  {
    id: "m4",
    name: "Levi's Denim Jacket",
    category: "men's clothing",
    subcategory: "jackets",
    color: "blue",
    price: 2999,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    description: "Classic denim jacket for all occasions",
    rating: 4.3,
    reviews: 89,
    inStock: true,
    brand: "Levi's",
    sizes: ["S", "M", "L", "XL"],
    ecoFriendly: false,
    discount: 25
  },

  // Women's Clothing
  {
    id: "w1",
    name: "Zara Summer Dress",
    category: "women's clothing",
    subcategory: "dresses",
    color: "floral",
    price: 3499,
    originalPrice: 4499,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
    description: "Elegant summer dress perfect for casual outings",
    rating: 4.4,
    reviews: 156,
    inStock: true,
    brand: "Zara",
    sizes: ["XS", "S", "M", "L"],
    ecoFriendly: true,
    discount: 22
  },
  {
    id: "w2",
    name: "H&M Blouse",
    category: "women's clothing",
    subcategory: "tops",
    color: "white",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    description: "Versatile blouse suitable for office and casual wear",
    rating: 4.2,
    reviews: 78,
    inStock: true,
    brand: "H&M",
    sizes: ["XS", "S", "M", "L", "XL"],
    ecoFriendly: true,
    discount: 19
  },
  {
    id: "w3",
    name: "Forever 21 Jeans",
    category: "women's clothing",
    subcategory: "jeans",
    color: "blue",
    price: 1899,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    description: "Comfortable high-waist jeans with stretch",
    rating: 4.1,
    reviews: 92,
    inStock: true,
    brand: "Forever 21",
    sizes: ["26", "28", "30", "32"],
    ecoFriendly: false,
    discount: 24
  },

  // Electronics
  {
    id: "e1",
    name: "iPhone 15 Pro",
    category: "electronics",
    subcategory: "smartphones",
    color: "titanium",
    price: 149999,
    originalPrice: 159999,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    description: "Latest iPhone with advanced camera system and A17 Pro chip",
    rating: 4.9,
    reviews: 567,
    inStock: true,
    brand: "Apple",
    sizes: ["128GB", "256GB", "512GB"],
    ecoFriendly: true,
    discount: 6
  },
  {
    id: "e2",
    name: "Samsung Galaxy S24",
    category: "electronics",
    subcategory: "smartphones",
    color: "black",
    price: 89999,
    originalPrice: 99999,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    description: "Android flagship with AI features and advanced camera",
    rating: 4.7,
    reviews: 234,
    inStock: true,
    brand: "Samsung",
    sizes: ["128GB", "256GB", "512GB"],
    ecoFriendly: true,
    discount: 10
  },
  {
    id: "e3",
    name: "MacBook Air M2",
    category: "electronics",
    subcategory: "laptops",
    color: "silver",
    price: 119999,
    originalPrice: 129999,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    description: "Ultra-thin laptop with M2 chip and all-day battery",
    rating: 4.8,
    reviews: 189,
    inStock: true,
    brand: "Apple",
    sizes: ["256GB", "512GB", "1TB"],
    ecoFriendly: true,
    discount: 8
  },
  {
    id: "e4",
    name: "Sony WH-1000XM4",
    category: "electronics",
    subcategory: "headphones",
    color: "black",
    price: 28999,
    originalPrice: 34999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    description: "Noise-cancelling wireless headphones with 30-hour battery",
    rating: 4.6,
    reviews: 189,
    inStock: true,
    brand: "Sony",
    sizes: ["One Size"],
    ecoFriendly: false,
    discount: 17
  },

  // Jewelry
  {
    id: "j1",
    name: "Diamond Stud Earrings",
    category: "jewelery",
    subcategory: "earrings",
    color: "silver",
    price: 15999,
    originalPrice: 19999,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
    description: "Classic diamond studs perfect for any occasion",
    rating: 4.8,
    reviews: 89,
    inStock: true,
    brand: "Luxury",
    sizes: ["0.5ct", "1ct", "1.5ct"],
    ecoFriendly: false,
    discount: 20
  },
  {
    id: "j2",
    name: "Gold Chain Necklace",
    category: "jewelery",
    subcategory: "necklaces",
    color: "gold",
    price: 8999,
    originalPrice: 11999,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
    description: "Elegant gold chain necklace with adjustable length",
    rating: 4.5,
    reviews: 67,
    inStock: true,
    brand: "Luxury",
    sizes: ["18\"", "20\"", "24\""],
    ecoFriendly: false,
    discount: 25
  }
];

// API Functions for Enhanced Features
async function fetchProductsFromAPI(query = '') {
  try {
    // Using FakeStore API for additional products
    const response = await axios.get('https://fakestoreapi.com/products');
    let apiProducts = response.data.map((item, index) => ({
      id: `api_${item.id}`,
      name: item.title,
      category: item.category,
      subcategory: item.category,
      color: getRandomColor(),
      price: Math.round(item.price * 100), // Convert to Indian pricing
      originalPrice: Math.round(item.price * 120),
      image: item.image,
      description: item.description,
      rating: item.rating?.rate || 4.0,
      reviews: item.rating?.count || Math.floor(Math.random() * 200) + 50,
      inStock: true,
      brand: getBrandFromCategory(item.category),
      sizes: getSizesFromCategory(item.category),
      ecoFriendly: Math.random() > 0.7,
      discount: Math.floor(Math.random() * 30) + 10,
      apiSource: 'fakestore'
    }));

    // Combine with enhanced products
    let allProducts = [...enhancedProducts, ...apiProducts];

    // Filter by query if provided
    if (query) {
      const queryLower = query.toLowerCase();
      allProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(queryLower) ||
        p.category.toLowerCase().includes(queryLower) ||
        p.subcategory.toLowerCase().includes(queryLower) ||
        p.brand.toLowerCase().includes(queryLower) ||
        p.color.toLowerCase().includes(queryLower)
      );
    }

    return allProducts.slice(0, 30); // Limit to 30 products
  } catch (error) {
    console.error('Error fetching products:', error);
    return enhancedProducts;
  }
}

async function fetchWeatherData(city = 'Mumbai') {
  try {
    const apiKey = process.env.WEATHER_API_KEY || 'demo';
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    return {
      city: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      feelsLike: response.data.main.feels_like
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

async function fetchNewsData(category = 'general') {
  try {
    const apiKey = process.env.NEWS_API_KEY || 'demo';
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${apiKey}&pageSize=5`
    );
    return response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source.name
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

async function fetchRandomJoke() {
  try {
    const response = await axios.get('https://api.chucknorris.io/jokes/random');
    return response.data.value;
  } catch (error) {
    console.error('Error fetching joke:', error);
    return "Why did the AI go to therapy? It had too many deep learning issues! 😄";
  }
}

async function fetchRandomFact() {
  try {
    const response = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random');
    return response.data.text;
  } catch (error) {
    console.error('Error fetching fact:', error);
    return "Did you know? The average person spends 6 months of their lifetime waiting for red lights to turn green!";
  }
}

// Helper functions
function getRandomColor() {
  const colors = ['red', 'blue', 'black', 'white', 'green', 'yellow', 'silver', 'gold', 'brown', 'navy', 'gray', 'pink', 'purple'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getBrandFromCategory(category) {
  const brandMap = {
    "men's clothing": "Generic",
    "women's clothing": "Generic",
    "jewelery": "Luxury",
    "electronics": "TechCorp"
  };
  return brandMap[category] || "Generic";
}

function getSizesFromCategory(category) {
  const sizeMap = {
    "men's clothing": ["S", "M", "L", "XL", "XXL"],
    "women's clothing": ["XS", "S", "M", "L", "XL"],
    "jewelery": ["One Size"],
    "electronics": ["Standard"]
  };
  return sizeMap[category] || ["Standard"];
}

// Enhanced AI with RAG (Retrieval Augmented Generation) for Sparkathon
async function generateAIResponse(message, products) {
  try {
    const msg = message.toLowerCase();
    
    // Handle specific API-based queries
    if (msg.includes('weather') || msg.includes('temperature')) {
      const city = extractCityFromMessage(message);
      const weather = await fetchWeatherData(city);
      if (weather) {
        return `🌤️ Weather in ${weather.city}: ${weather.temperature}°C, ${weather.description}. Feels like ${weather.feelsLike}°C. Humidity: ${weather.humidity}%, Wind: ${weather.windSpeed} m/s`;
      }
    }
    
    if (msg.includes('news') || msg.includes('headlines')) {
      const news = await fetchNewsData();
      if (news.length > 0) {
        return `📰 Latest headlines:\n${news.slice(0, 3).map((article, i) => `${i + 1}. ${article.title}`).join('\n')}`;
      }
    }
    
    if (msg.includes('joke') || msg.includes('funny')) {
      const joke = await fetchRandomJoke();
      return `😄 ${joke}`;
    }
    
    if (msg.includes('fact') || msg.includes('interesting')) {
      const fact = await fetchRandomFact();
      return `🤓 ${fact}`;
    }

    // Enhanced product recommendations with RAG
    if (products.length > 0) {
      const productContext = products.map(p => ({
        name: p.name,
        price: p.price,
        category: p.category,
        brand: p.brand,
        rating: p.rating,
        discount: p.discount,
        ecoFriendly: p.ecoFriendly
      }));

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are ShopWise, an AI-powered retail assistant for Sparkathon 2025. You help customers find products, provide recommendations, and answer questions. 

Key Features:
- Product recommendations with pricing and discounts
- Eco-friendly product identification
- Brand and category filtering
- Similar product suggestions
- Shopping cart assistance

Available products: ${JSON.stringify(productContext)}

Be conversational, helpful, and knowledgeable. Mention specific products, prices, and features. Keep responses under 150 words.`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 300
      });

      return completion.choices[0].message.content;
    }

    // General knowledge questions
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are ShopWise, a friendly AI assistant for Sparkathon 2025. You can help with:
1. Shopping and product recommendations
2. General knowledge questions
3. Technology, science, history explanations
4. Casual conversation
5. Shopping advice and comparisons

Be conversational, helpful, and knowledgeable. Keep responses under 150 words.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.log('AI response generation failed:', error.message);
    return generateFallbackResponse(message, products);
  }
}

function extractCityFromMessage(message) {
  const cities = ['mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad'];
  const msg = message.toLowerCase();
  const foundCity = cities.find(city => msg.includes(city));
  return foundCity || 'Mumbai';
}

function generateFallbackResponse(message, products) {
  const msg = message.toLowerCase();
  
  // Check if it's a product-related question
  const productKeywords = ['product', 'buy', 'purchase', 'shop', 'price', 'cost', 'sneaker', 'jacket', 'shirt', 'phone', 'watch', 'bag', 'jean', 'clothing', 'electronics'];
  const isProductQuestion = productKeywords.some(keyword => msg.includes(keyword));
  
  if (isProductQuestion && products.length > 0) {
    const ecoProducts = products.filter(p => p.ecoFriendly);
    const discountedProducts = products.filter(p => p.discount > 15);
    
    let response = `I found ${products.length} products matching your request! `;
    
    if (ecoProducts.length > 0) {
      response += `🌱 ${ecoProducts.length} eco-friendly options available. `;
    }
    
    if (discountedProducts.length > 0) {
      response += `💰 ${discountedProducts.length} items with great discounts!`;
    }
    
    return response;
  } else if (isProductQuestion) {
    return "I couldn't find exactly what you're looking for, but I can help you discover similar products. Try being more specific or browse our categories!";
  } else {
    // Handle general questions
    if (msg.includes('hello') || msg.includes('hi')) {
      return "Hello! I'm your AI-powered retail assistant for Sparkathon 2025. I can help you with shopping, answer questions, or just chat. What would you like to know?";
    } else if (msg.includes('weather')) {
      return "I can't check the weather directly right now, but I'd recommend using a weather app or website for current conditions!";
    } else if (msg.includes('time')) {
      return `The current time is ${new Date().toLocaleTimeString()}. Is there anything specific you'd like to know?`;
    } else if (msg.includes('help')) {
      return "I'm here to help! I can assist with shopping, answer questions, provide information, or just chat. What would you like to know?";
    } else {
      return "That's an interesting question! I'm here to help with shopping and general knowledge. Could you be more specific about what you'd like to know?";
    }
  }
}

// Enhanced filter extraction with AI assistance
async function extractFiltersWithAI(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a shopping assistant. Extract product filters from user messages. Return JSON with: category, subcategory, color, maxPrice, minPrice, brand, size, ecoFriendly. Return null for missing values."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.log('AI parsing failed, using fallback:', error.message);
    return extractFiltersFallback(message);
  }
}

function extractFiltersFallback(message) {
  const msg = message.toLowerCase();
  
  const colors = ['red', 'blue', 'black', 'white', 'green', 'yellow', 'silver', 'gold', 'brown', 'navy', 'gray', 'pink', 'purple'];
  const categories = ['men\'s clothing', 'women\'s clothing', 'jewelery', 'electronics'];
  const subcategories = ['jeans', 'sneakers', 'jackets', 'dresses', 'tops', 'smartphones', 'laptops', 'headphones', 'earrings', 'necklaces'];
  const brands = ['nike', 'adidas', 'apple', 'sony', 'levi', 'zara', 'h&m', 'forever 21', 'samsung', 'luxury'];

  return {
    category: categories.find(c => msg.includes(c)) || null,
    subcategory: subcategories.find(s => msg.includes(s)) || null,
    color: colors.find(c => msg.includes(c)) || null,
    maxPrice: parseInt(msg.match(/\d{3,5}/)?.[0]) || null,
    minPrice: null,
    brand: brands.find(b => msg.includes(b)) || null,
    size: null,
    ecoFriendly: msg.includes('eco') || msg.includes('green') || msg.includes('sustainable')
  };
}

// Enhanced product filtering
function filterProducts(filters) {
  let filtered = [...enhancedProducts];

  if (filters.category) {
    filtered = filtered.filter(p => 
      p.category.toLowerCase().includes(filters.category.toLowerCase())
    );
  }
  
  if (filters.subcategory) {
    filtered = filtered.filter(p => 
      p.subcategory.toLowerCase().includes(filters.subcategory.toLowerCase())
    );
  }
  
  if (filters.color) {
    filtered = filtered.filter(p => 
      p.color.toLowerCase().includes(filters.color.toLowerCase())
    );
  }
  
  if (filters.maxPrice) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice);
  }
  
  if (filters.minPrice) {
    filtered = filtered.filter(p => p.price >= filters.minPrice);
  }
  
  if (filters.brand) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(filters.brand.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(filters.brand.toLowerCase()))
    );
  }

  if (filters.ecoFriendly) {
    filtered = filtered.filter(p => p.ecoFriendly === true);
  }

  return filtered;
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    socket.emit('room_joined', room);
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('user_typing', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Enhanced chat endpoint for Sparkathon
app.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Extract filters using AI first
    let filters = await extractFiltersWithAI(message);
    let filteredProducts = [];

    // Fetch all products (enhanced + FakeStore)
    let allProducts = await fetchProductsFromAPI('');

    // If any filters are found, apply them strictly
    const hasAnyFilter = filters && (filters.category || filters.subcategory || filters.color || filters.maxPrice || filters.minPrice || filters.brand || filters.size || filters.ecoFriendly);
    if (hasAnyFilter) {
      filteredProducts = allProducts.filter(p => {
        if (filters.category && !p.category.toLowerCase().includes(filters.category.toLowerCase())) return false;
        if (filters.subcategory && !p.subcategory.toLowerCase().includes(filters.subcategory.toLowerCase())) return false;
        if (filters.color && !p.color.toLowerCase().includes(filters.color.toLowerCase())) return false;
        if (filters.maxPrice && p.price > filters.maxPrice) return false;
        if (filters.minPrice && p.price < filters.minPrice) return false;
        if (filters.brand && !p.brand.toLowerCase().includes(filters.brand.toLowerCase())) return false;
        if (filters.size && !(p.sizes && p.sizes.includes(filters.size))) return false;
        if (filters.ecoFriendly && !p.ecoFriendly) return false;
        return true;
      });
    } else {
      // Fallback: basic text search if no filters found
      const queryLower = message.toLowerCase();
      filteredProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(queryLower) ||
        p.category.toLowerCase().includes(queryLower) ||
        p.subcategory.toLowerCase().includes(queryLower) ||
        p.brand.toLowerCase().includes(queryLower) ||
        p.color.toLowerCase().includes(queryLower)
      );
    }

    // Limit to 30 products
    filteredProducts = filteredProducts.slice(0, 30);

    // Generate AI response
    const aiResponse = await generateAIResponse(message, filteredProducts);

    // Emit real-time update
    io.emit('new_message', {
      sender: 'bot',
      text: aiResponse,
      timestamp: new Date().toISOString(),
      products: filteredProducts
    });

    res.json({
      reply: aiResponse,
      results: filteredProducts,
      filters: filters,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Something went wrong',
      reply: "I'm having trouble processing your request right now. Please try again!"
    });
  }
});

// Product search endpoint
app.get('/products', async (req, res) => {
  try {
    const { category, subcategory, color, maxPrice, minPrice, brand, limit = 30, query = '', ecoFriendly } = req.query;
    
    let products = await fetchProductsFromAPI(query);
    
    // Apply filters
    if (category) {
      products = products.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (subcategory) {
      products = products.filter(p => p.subcategory.toLowerCase().includes(subcategory.toLowerCase()));
    }
    if (brand) {
      products = products.filter(p => p.brand.toLowerCase().includes(brand.toLowerCase()));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseInt(maxPrice));
    }
    if (minPrice) {
      products = products.filter(p => p.price >= parseInt(minPrice));
    }
    if (ecoFriendly === 'true') {
      products = products.filter(p => p.ecoFriendly === true);
    }
    
    if (limit) {
      products = products.slice(0, parseInt(limit));
    }
    
    res.json({
      products: products,
      total: products.length,
      filters: { category, subcategory, color, maxPrice, minPrice, brand, ecoFriendly }
    });
  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Similar products endpoint
app.get('/products/:id/similar', async (req, res) => {
  try {
    const product = enhancedProducts.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find similar products based on category, brand, and price range
    const similar = enhancedProducts.filter(p => 
      p.id !== product.id &&
      (p.category === product.category || 
       p.brand === product.brand ||
       Math.abs(p.price - product.price) < product.price * 0.3)
    ).slice(0, 5);

    res.json({ similar });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch similar products' });
  }
});

// Weather endpoint
app.get('/weather/:city', async (req, res) => {
  try {
    const weather = await fetchWeatherData(req.params.city);
    if (weather) {
      res.json(weather);
    } else {
      res.status(404).json({ error: 'Weather data not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// News endpoint
app.get('/news/:category', async (req, res) => {
  try {
    const news = await fetchNewsData(req.params.category);
    res.json({ articles: news });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Joke endpoint
app.get('/joke', async (req, res) => {
  try {
    const joke = await fetchRandomJoke();
    res.json({ joke });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch joke' });
  }
});

// Fact endpoint
app.get('/fact', async (req, res) => {
  try {
    const fact = await fetchRandomFact();
    res.json({ fact });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fact' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    project: 'ShopWise - Sparkathon 2025',
    features: ['ai-chat', 'real-time', 'product-search', 'socket-io', 'enhanced-ai', 'api-integration', 'rag'],
    apis: ['products', 'weather', 'news', 'jokes', 'facts'],
    theme: 'Customer Experience - AI chat with intuitive product discovery'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 ShopWise - Sparkathon 2025 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO server ready for real-time connections`);
  console.log(`🤖 AI Chat enabled: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No (using fallback)'}`);
  console.log(`🔧 Features: Real-time chat, AI integration, Product search, Socket.IO, Enhanced AI, RAG`);
  console.log(`🌐 APIs: Products (FakeStore), Weather (OpenWeather), News (NewsAPI), Jokes (ChuckNorris), Facts (UselessFacts)`);
  console.log(`📦 Total products available: ${enhancedProducts.length + ' (Enhanced Catalog)'}`);
  console.log(`🎯 Theme: Customer Experience - AI chat with intuitive product discovery`);
});
