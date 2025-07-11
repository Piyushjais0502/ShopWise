# 🛍️ ShopWise – Your AI-Powered Retail Assistant

## Sparkathon 2025 Project

**Theme:** Customer Experience – combining AI chat with intuitive product discovery

**Summary:** An intelligent chatbot that understands natural-language shopping queries (e.g., "Show me blue jeans under Rs.1800"), fetches relevant products, displays them with rich visuals, and supports smart suggestions like "similar" or "add to cart." Built using React, Node.js + Express, and AI services, this platform showcases personalized, conversational, and seamless customer experiences.

## 🎯 Problem Statement

Online shoppers face frustration navigating endless product catalogs with unclear filters. The lack of natural conversational interfaces and relevant recommendation tools leads to decision fatigue and abandoned carts.

## 💡 Proposed Solution

A web-based assistant that:
- **Understands conversational requests** using an LLM (like GPT)
- **Extracts preferences** (category, price, color, brand)
- **Fetches and displays products** from a catalog via API/JSON
- **Enables quick actions**: view details, add to cart, get alternatives

## 🏗️ Architecture & Tech Stack

| Layer | Tech Stack | Responsibilities |
|-------|------------|------------------|
| **Frontend** | React, HTML, CSS | Chat UI, product cards |
| **Backend API** | Node.js + Express | Handle chat, product lookup, AI |
| **AI Layer** | OpenAI GPT-3.5/4 | Parse queries, extract filters |
| **Data Source** | FakeStore API + Enhanced Catalog | Simulated product catalog |
| **Integration** | REST endpoints: `/chat`, `/products`, `/cart` | Orchestrate full flow |

## 🔄 Workflow

1. **User types:** "Find red casual sneakers under Rs.2500"
2. **Frontend → POST /chat**
3. **Backend → invoke AI → extract filters**
4. **Query product data → retrieve matches**
5. **Return:** Chat response + product list
6. **User action:** "Add to cart," displayed dynamically

## ✨ Technical Highlights

- **LLM-powered intent extraction** using Retrieval Augmented Generation (RAG)
- **Smart filtering & ranking** based on user intent
- **Clean React UI** with chat messages and interactive product components
- **Scalable backend**—can integrate real APIs or databases
- **Real-time Socket.IO** connections for live chat experience
- **Multiple API integrations**: Weather, News, Jokes, Facts
- **Enhanced product catalog** with eco-friendly badges and discounts

## 🚀 Demo Scenarios

- "Show me jackets for women under Rs.3000"
- "What are similar options to this?"
- "Add this to my cart and check out"
- "I'm looking for eco-friendly notebooks"
- "What's the weather in Mumbai?"
- "Tell me a joke"
- "What are the latest tech trends?"

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (optional, fallback available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopwise
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   Create `server/config.env`:
   ```env
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   WEATHER_API_KEY=your_openweather_api_key_here
   NEWS_API_KEY=your_newsapi_key_here
   SOCKET_CORS_ORIGIN=http://localhost:3000
   ```

   Create `client/config.env`:
   ```env
   REACT_APP_SERVER_URL=http://localhost:5000
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

### Running the Application

1. **Start the server**
   ```bash
   cd server
   npm start
   ```

2. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## 🔧 API Endpoints

### Core Endpoints
- `POST /chat` - Main chat endpoint with AI processing
- `GET /products` - Product search with filters
- `GET /products/:id/similar` - Find similar products

### External API Integrations
- `GET /weather/:city` - Weather information
- `GET /news/:category` - Latest news headlines
- `GET /joke` - Random jokes
- `GET /fact` - Interesting facts

### Health & Status
- `GET /health` - System health and feature status

## 🌟 Features

### 🤖 AI-Powered Chat
- Natural language processing for shopping queries
- Context-aware responses with product recommendations
- General knowledge questions and entertainment
- Real-time typing indicators and message history

### 🛍️ Product Discovery
- Enhanced product catalog with 50+ items
- Real-time product search and filtering
- Price range filtering and brand selection
- Eco-friendly product identification
- Discount badges and original price display

### 🛒 Shopping Cart
- Add/remove items with quantity management
- Real-time cart updates
- Total price calculation
- Checkout functionality (UI ready)

### 📱 Responsive Design
- Mobile-first responsive layout
- Touch-friendly interface
- Progressive Web App features
- Dark mode support
- Accessibility features

### 🔌 Real-time Features
- Socket.IO for live chat
- Typing indicators
- Connection status monitoring
- Toast notifications

## 🎨 UI/UX Features

### Modern Design
- Gradient backgrounds with glassmorphism effects
- Smooth animations and transitions
- Interactive product cards with hover effects
- Professional color scheme and typography

### User Experience
- Quick reply suggestions for common queries
- Product image galleries with zoom effects
- Rating and review display
- Brand badges and eco-friendly indicators
- Loading states and error handling

## 🔐 Security Features

- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers
- Environment variable protection

## 📊 Performance Optimizations

- Compression middleware
- Image optimization
- Lazy loading for product images
- Efficient state management
- Memoized components

## 🧪 Testing

### Manual Testing Scenarios
1. **Product Search**: "Show me blue jeans under Rs.1800"
2. **Weather Query**: "What's the weather in Mumbai?"
3. **Entertainment**: "Tell me a joke"
4. **Cart Operations**: Add items, update quantities, remove items
5. **Responsive Design**: Test on mobile and tablet devices

### API Testing
```bash
# Test chat endpoint
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me red sneakers"}'

# Test product search
curl "http://localhost:5000/products?category=men's clothing&maxPrice=5000"

# Test health endpoint
curl http://localhost:5000/health
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
OPENAI_API_KEY=your_production_openai_key
WEATHER_API_KEY=your_production_weather_key
NEWS_API_KEY=your_production_news_key
SOCKET_CORS_ORIGIN=https://yourdomain.com
```

### Build Commands
```bash
# Build client
cd client
npm run build

# Start production server
cd ../server
npm start
```

## 📈 Future Enhancements

### Planned Features
- [ ] User authentication and profiles
- [ ] Payment gateway integration
- [ ] Advanced product recommendations
- [ ] Voice chat capabilities
- [ ] Multi-language support
- [ ] AR product visualization
- [ ] Social sharing features
- [ ] Analytics dashboard

### Technical Improvements
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Redis caching for performance
- [ ] Microservices architecture
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Unit and integration tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT API
- **FakeStore API** for product data
- **OpenWeather API** for weather data
- **NewsAPI** for news headlines
- **Chuck Norris API** for jokes
- **Useless Facts API** for interesting facts
- **React** and **Node.js** communities
- **Sparkathon 2025** organizers

## 📞 Support

For questions, issues, or contributions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ for Sparkathon 2025 - Customer Experience Theme**

*"Transforming online shopping through intelligent conversation and seamless discovery"*
