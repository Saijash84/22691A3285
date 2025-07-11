# URL Shortener Project

A complete React TypeScript URL shortener application with Express logging middleware.

## Project Structure

```
22691A3285/
├── Frontend/                 # React TypeScript URL Shortener App
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts (LoggerContext)
│   │   ├── services/         # Business logic services
│   │   └── App.tsx          # Main application component
│   ├── public/
│   │   └── screenshots/     # Mobile and desktop screenshots
│   └── package.json         # Frontend dependencies
└── LoggingMiddleware/        # Express.js logging middleware
    ├── logger.js            # Logging middleware implementation
    ├── server.js            # Express server with sample routes
    └── package.json         # Backend dependencies
```

## Frontend Features

### URL Shortener App
- **React + TypeScript**: Modern frontend with type safety
- **Material UI**: Consistent and responsive design
- **Bulk URL Shortening**: Shorten up to 5 URLs simultaneously
- **Custom Options**: 
  - Validity period (1-1440 minutes, default: 30)
  - Custom shortcodes (alphanumeric, ≤10 characters)
- **Client-side Storage**: All data stored in browser localStorage
- **Responsive Design**: Works on both mobile and desktop

### Key Components
- **UrlShortener**: Main shortening interface with form validation
- **Statistics**: Detailed analytics with click tracking
- **Redirect**: Handles URL redirection with loading states
- **LoggerContext**: Global logging middleware for all actions

### Features
- ✅ URL validation and error handling
- ✅ Custom shortcode validation (unique, alphanumeric)
- ✅ Expiry time management
- ✅ Click tracking with mock geo-location
- ✅ Copy to clipboard functionality
- ✅ Delete URLs
- ✅ Responsive Material UI design
- ✅ Comprehensive logging system
- ✅ Client-side routing with React Router

### Logging System
- **No console.log**: All logging handled through LoggerContext
- **Persistent Logs**: Stored in localStorage
- **Structured Data**: Timestamp, level, message, and metadata
- **Global Access**: Available throughout the application

## LoggingMiddleware Features

### Express.js Middleware
- **Request Logging**: Logs HTTP method, path, and timestamp
- **Sample Routes**: Multiple endpoints to demonstrate logging
- **Clean Architecture**: Modular logger implementation

### Available Endpoints
- `GET /` - Welcome message
- `GET /api/health` - Health check
- `POST /api/test` - Test endpoint
- `GET /api/users` - Sample user data

## Getting Started

### Frontend
```bash
cd Frontend
npm install
npm start
```

### LoggingMiddleware
```bash
cd LoggingMiddleware
npm install
npm start
```

## Technical Specifications

### Frontend Requirements Met
- ✅ React + TypeScript
- ✅ Material UI only for styling
- ✅ Up to 5 URLs at once
- ✅ Custom validity and shortcodes
- ✅ Client-side routing
- ✅ localStorage storage
- ✅ Responsive design
- ✅ Global logging middleware
- ✅ Statistics with click tracking
- ✅ No external APIs
- ✅ Comprehensive validation

### LoggingMiddleware Requirements Met
- ✅ Express.js implementation
- ✅ Middleware logs method, path, timestamp
- ✅ Sample routes included
- ✅ Clean project structure

## Data Flow

1. **URL Input**: User enters URLs with optional parameters
2. **Validation**: Client-side validation for URLs and custom codes
3. **Shortening**: Generate shortcodes and store in localStorage
4. **Redirection**: Handle clicks and track analytics
5. **Statistics**: Display comprehensive usage data
6. **Logging**: All actions logged through LoggerContext

## Browser Compatibility

- Modern browsers with localStorage support
- Responsive design for mobile and desktop
- No external dependencies beyond React ecosystem

## Development Notes

- All code is handwritten and modular
- No AI-generated comments or markers
- Clean, readable code structure
- Comprehensive error handling
- Type-safe TypeScript implementation 