# 🚀 Deployment Guide

This guide covers multiple deployment options for your AI Voice Assistant web app.

## 📋 Pre-deployment Checklist

- [ ] OpenAI API key configured
- [ ] Environment variables set
- [ ] Build tested locally (`npm run build`)
- [ ] AWS Cognito configured (if using authentication)
- [ ] Domain name ready (optional)

## 🌐 AWS Amplify (Recommended)

### Automatic Deployment from GitHub

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/ai-chat-bot.git
   git push -u origin main
   ```

2. **Connect to Amplify**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - Select the main branch

3. **Configure Build Settings**
   - Amplify will auto-detect the `amplify.yml` file
   - Add environment variables in Amplify console:
     ```
     REACT_APP_OPENAI_API_KEY=your_key_here
     REACT_APP_USER_POOL_ID=your_pool_id
     REACT_APP_USER_POOL_CLIENT_ID=your_client_id
     REACT_APP_REGION=us-east-1
     ```

4. **Deploy**
   - Click "Save and deploy"
   - Wait for build to complete (~3-5 minutes)
   - Access your app at the provided URL

### Manual Deployment

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Upload to Amplify**
   - Zip the `build` folder
   - Go to Amplify Console → "Deploy without Git"
   - Upload the zip file

## 🔷 Netlify

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `build`
   - Add environment variables in Site settings

3. **Deploy**
   - Netlify will automatically deploy on every push

## ⚡ Vercel

1. **Import Project**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import from GitHub

2. **Configure**
   - Framework preset: Create React App
   - Add environment variables
   - Deploy

## ☁️ AWS S3 + CloudFront

### 1. Create S3 Bucket

```bash
aws s3 mb s3://your-ai-assistant-bucket --region us-east-1
```

### 2. Configure Bucket for Static Hosting

```bash
aws s3 website s3://your-ai-assistant-bucket --index-document index.html --error-document index.html
```

### 3. Upload Build Files

```bash
npm run build
aws s3 sync build/ s3://your-ai-assistant-bucket --delete
```

### 4. Create CloudFront Distribution

```bash
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build and Run
```bash
docker build -t ai-assistant .
docker run -p 80:80 ai-assistant
```

## 🔧 Environment Variables Setup

### Production Environment Variables

Create these in your deployment platform:

```env
# Required
REACT_APP_OPENAI_API_KEY=sk-...

# Optional (for authentication)
REACT_APP_USER_POOL_ID=us-east-1_...
REACT_APP_USER_POOL_CLIENT_ID=...
REACT_APP_REGION=us-east-1

# Optional (for analytics)
REACT_APP_GA_TRACKING_ID=G-...
```

## 🌍 Custom Domain Setup

### AWS Amplify
1. Go to Domain management in Amplify console
2. Add your domain
3. Follow DNS configuration instructions

### Netlify
1. Go to Domain settings
2. Add custom domain
3. Configure DNS records

### CloudFront
1. Add alternate domain name (CNAME) to distribution
2. Request SSL certificate via ACM
3. Update DNS records

## 🔒 Security Configuration

### Content Security Policy
Add to `public/index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.openai.com;
  media-src 'self';
">
```

### HTTPS Enforcement
Ensure all deployments use HTTPS for:
- Voice features (required by browsers)
- API security
- User trust

## 📊 Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

### CDN Configuration
- Enable gzip compression
- Set proper cache headers
- Use CDN for static assets

## 🔍 Monitoring & Analytics

### AWS CloudWatch (for Amplify)
- Monitor build times
- Track error rates
- Set up alerts

### Google Analytics
Add to environment variables:
```env
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (16+)
   - Clear node_modules and reinstall
   - Verify environment variables

2. **Voice Features Don't Work**
   - Ensure HTTPS is enabled
   - Check browser compatibility
   - Verify microphone permissions

3. **API Errors**
   - Verify OpenAI API key
   - Check API quotas and billing
   - Review CORS settings

### Debug Commands
```bash
# Check build locally
npm run build
npx serve -s build

# Test environment variables
echo $REACT_APP_OPENAI_API_KEY

# Check bundle size
npm run build -- --analyze
```

## 📈 Scaling Considerations

### For High Traffic
- Use CDN for static assets
- Implement rate limiting
- Consider serverless backend
- Monitor API usage and costs

### Database Migration
When ready to move from localStorage:
- Set up DynamoDB tables
- Implement user data migration
- Add backup strategies

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to AWS Amplify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
```

## 📞 Support

If you encounter issues during deployment:
1. Check the troubleshooting section
2. Review deployment platform documentation
3. Create an issue on GitHub with deployment logs