# 🧠 AI Voice Assistant Web App

A modern, responsive AI Voice Assistant web application built with React.js that allows users to interact via text or voice, similar to ChatGPT. Features include anonymous chat mode, user authentication, chat history management, and voice input/output capabilities.

## ✨ Features

### Core Features
- **Text & Voice Input**: Type messages or use voice commands via Web Speech API
- **Voice Responses**: AI responses can be spoken aloud using Speech Synthesis API
- **Anonymous Mode**: Chat without login (temporary storage)
- **Authenticated Mode**: Sign in to save and manage chat history
- **Chat History**: View, rename, and delete previous conversations
- **Real-time Streaming**: Dynamic typing effect for AI responses
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Responsive Design**: Mobile-first design with touch-friendly interface

### Technical Features
- **Modern UI/UX**: Clean, sleek interface with smooth animations
- **AWS Integration**: Ready for AWS Cognito authentication and DynamoDB storage
- **OpenAI Integration**: Powered by GPT-3.5-turbo with streaming responses
- **PWA Ready**: Progressive Web App capabilities
- **Accessibility**: Screen reader friendly and keyboard navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- OpenAI API key
- (Optional) AWS account for authentication and storage

### Installation

1. **Clone and install dependencies**
   ```bash
   cd ai-chat-bot
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### OpenAI API Setup
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env` file as `REACT_APP_OPENAI_API_KEY`

### AWS Cognito Setup (Optional)
1. Create a User Pool in AWS Cognito
2. Add the configuration to your `.env` file:
   ```env
   REACT_APP_USER_POOL_ID=your_user_pool_id
   REACT_APP_USER_POOL_CLIENT_ID=your_user_pool_client_id
   REACT_APP_REGION=us-east-1
   ```

## 📱 Usage

### Anonymous Mode
- Click "Start Chatting" on the home page
- Chat immediately without signing up
- Conversations are stored temporarily in browser storage
- See banner prompting to sign in for persistent history

### Authenticated Mode
- Click "Sign In" or "Sign Up" to create an account
- All chat sessions are saved and accessible across devices
- Manage chat history in the sidebar
- Rename or delete conversations

### Voice Features
- **Voice Input**: Click the microphone button to speak your message
- **Voice Output**: Toggle the speaker icon to enable/disable AI voice responses
- **Browser Support**: Works in Chrome, Safari, and other modern browsers

## 🏗️ Architecture

### Frontend Stack
- **React.js 18**: Modern React with hooks and context
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icons

### Services
- **AI Service**: OpenAI GPT-3.5-turbo integration with streaming
- **Speech Service**: Web Speech API for voice input/output
- **Auth Service**: AWS Amplify/Cognito integration

### State Management
- **Context API**: Theme, Authentication, and Chat contexts
- **Local Storage**: Anonymous chat persistence
- **Session Management**: Real-time chat state

## 🚀 Deployment

### AWS Amplify (Recommended)
1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Amplify**
   - Connect your GitHub repository
   - Set environment variables in Amplify console
   - Deploy automatically on push

### Alternative Deployments
- **Netlify**: Connect GitHub repo and deploy
- **Vercel**: Import project and deploy
- **S3 + CloudFront**: Upload build folder to S3

## 🔒 Security

- API keys are stored as environment variables
- AWS Cognito provides secure authentication
- No sensitive data stored in localStorage
- HTTPS required for voice features in production

## 🎨 Customization

### Themes
- Modify `tailwind.config.js` for custom colors
- Update theme context for additional theme options
- Add custom CSS in `src/index.css`

### AI Models
- Change model in `src/services/aiService.js`
- Adjust parameters like temperature and max_tokens
- Add support for other AI providers

### Voice Settings
- Customize voice parameters in `src/services/speechService.js`
- Add voice selection options
- Implement different languages

## 📊 Features Comparison

| Feature | Guest User | Logged-in User |
|---------|------------|----------------|
| Start Chat | ✅ | ✅ |
| Voice Input | ✅ | ✅ |
| Voice Output | ✅ | ✅ |
| Chat History | ❌ | ✅ |
| Rename/Delete Chats | ❌ | ✅ |
| Persistent Sessions | ❌ | ✅ |
| Cross-device Sync | ❌ | ✅ |

## 🛠️ Development

### Available Scripts
- `npm start`: Development server
- `npm run build`: Production build
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

### Project Structure
```
src/
├── components/          # React components
│   ├── HomePage.js      # Landing page
│   ├── ChatInterface.js # Main chat UI
│   └── AuthModal.js     # Login/signup modal
├── contexts/            # React contexts
│   ├── ThemeContext.js  # Theme management
│   ├── AuthContext.js   # Authentication
│   └── ChatContext.js   # Chat state
├── services/            # External services
│   ├── aiService.js     # OpenAI integration
│   └── speechService.js # Voice features
└── utils/               # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting guide

## 🔮 Roadmap

- [ ] Export chat as PDF
- [ ] Chat categories and tags
- [ ] Rate AI responses
- [ ] Multiple AI model support
- [ ] Voice command shortcuts
- [ ] Mobile app version
- [ ] Team collaboration features