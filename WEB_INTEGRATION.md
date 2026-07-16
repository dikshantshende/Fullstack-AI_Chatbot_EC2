# 🌐 WebChat Widget Integration Guide

This guide shows you how to integrate the WebChat widget into any website.

## 🚀 Quick Start

### 1. Basic Integration

Add this script to your website's `<head>` or before the closing `</body>` tag:

```html
<script>
  window.WebChatConfig = {
    position: 'bottom-right',
    theme: 'auto',
    companyName: 'Your Company Name',
    welcomeMessage: 'Hi! How can I help you today?',
    apiUrl: 'https://your-backend-url.com'
  };
</script>
<script src="https://your-domain.com/webchat-widget.js"></script>
```

### 2. Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `position` | string | `'bottom-right'` | Widget position: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'` |
| `theme` | string | `'auto'` | Theme: `'light'`, `'dark'`, `'auto'` |
| `companyName` | string | `'Your Company'` | Your company name displayed in the widget |
| `welcomeMessage` | string | `'Hi! How can I help you today?'` | Initial welcome message |
| `apiUrl` | string | `'http://localhost:8000'` | Backend API URL |

### 3. Example Configurations

#### E-commerce Website
```html
<script>
  window.WebChatConfig = {
    position: 'bottom-right',
    theme: 'light',
    companyName: 'ShopName',
    welcomeMessage: 'Welcome to ShopName! Need help with your order?',
    apiUrl: 'https://api.shopname.com'
  };
</script>
```

#### SaaS Application
```html
<script>
  window.WebChatConfig = {
    position: 'bottom-left',
    theme: 'auto',
    companyName: 'SaaSApp',
    welcomeMessage: 'Hi! Need help with your account or features?',
    apiUrl: 'https://api.saasapp.com'
  };
</script>
```

## 🎨 Customization

### Custom Styling

You can customize the widget appearance by adding CSS:

```html
<style>
  #webchat-widget-container {
    /* Custom styles */
  }
  
  #webchat-widget button {
    /* Custom button styles */
  }
</style>
```

### Custom Positioning

For custom positioning, you can override the default:

```html
<script>
  window.WebChatConfig = {
    position: 'custom',
    customPosition: {
      top: '100px',
      right: '50px'
    }
  };
</script>
```

## 🔧 Advanced Integration

### 1. Dynamic Configuration

Update configuration dynamically:

```javascript
// Update configuration
window.WebChatConfig.companyName = 'New Company Name';
window.WebChatConfig.welcomeMessage = 'New welcome message';

// Reload widget
if (window.WebChatWidget && window.WebChatWidget.reload) {
  window.WebChatWidget.reload();
}
```

### 2. Event Handling

Listen to widget events:

```javascript
// Widget opened
document.addEventListener('webchat:opened', function(event) {
  console.log('Chat widget opened');
});

// Widget closed
document.addEventListener('webchat:closed', function(event) {
  console.log('Chat widget closed');
});

// Message sent
document.addEventListener('webchat:message-sent', function(event) {
  console.log('Message sent:', event.detail);
});
```

### 3. API Integration

Custom API endpoints:

```javascript
window.WebChatConfig = {
  apiUrl: 'https://your-api.com',
  endpoints: {
    chat: '/api/chat',
    history: '/api/chat/history',
    user: '/api/user/profile'
  }
};
```

## 📱 Mobile Optimization

The widget is automatically optimized for mobile devices:

- Responsive design
- Touch-friendly interface
- Mobile-optimized chat input
- Swipe gestures support

## 🔒 Security & Privacy

### CORS Configuration

Ensure your backend allows requests from your domain:

```python
# Backend CORS settings
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com"
]
```

### Data Privacy

The widget respects user privacy:

- No tracking without consent
- GDPR compliant
- Data encryption in transit
- Local storage for chat history

## 🚀 Deployment

### 1. Build for Production

```bash
npm run build
```

### 2. Deploy Files

Upload these files to your web server:
- `dist/` folder contents
- `public/webchat-widget.js`

### 3. CDN Integration

For better performance, serve via CDN:

```html
<script src="https://cdn.yourdomain.com/webchat-widget.js"></script>
```

## 🐛 Troubleshooting

### Common Issues

1. **Widget not loading**
   - Check if `webchat-widget.js` is accessible
   - Verify CORS settings on backend
   - Check browser console for errors

2. **Chat not working**
   - Verify `apiUrl` is correct
   - Check backend is running
   - Ensure API endpoints are accessible

3. **Styling issues**
   - Check if Tailwind CSS is loading
   - Verify no CSS conflicts
   - Test in different browsers

### Debug Mode

Enable debug mode for troubleshooting:

```javascript
window.WebChatConfig = {
  debug: true,
  // ... other config
};
```

## 📞 Support

For integration support:

- **Email**: support@yourcompany.com
- **Documentation**: https://docs.yourcompany.com/webchat
- **GitHub**: https://github.com/yourcompany/webchat-widget

## 📄 License

This WebChat widget is licensed under the MIT License. See LICENSE file for details.




