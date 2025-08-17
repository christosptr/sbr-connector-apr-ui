# SBR Connector APR UI

A React application for Business Name Registration in Australia, integrating with the ABN lookup microservice.

## Features

- Business name search interface
- ABN lookup functionality using the ABN_LOOKUP_SERVICE microservice
- Responsive design
- Clean, professional UI matching Australian government standards

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- The SBR Connector APR microservices running (specifically ABN_LOOKUP_SERVICE)

## Installation

1. Navigate to the project directory:
   ```bash
   cd sbr-connector-apr-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
```bash
npm start
```
This will start the development server on http://localhost:3000

### Build for Production
```bash
npm run build
```

## Usage

1. **ABN Search**: Enter an 11-digit ABN (e.g., 51824753556) to lookup business details
2. **Business Name Search**: Enter a business name (functionality will be extended when additional microservices are available)

## API Integration

The application connects to the following microservice:
- **ABN_LOOKUP_SERVICE**: `/microsvc/BUSINESS/ABN_LOOKUP_SERVICE/lookup/{abn}`

## Project Structure

```
sbr-connector-apr-ui/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js             # Main React component
│   ├── index.js           # React entry point
│   └── styles.css         # Application styles
├── package.json           # Dependencies and scripts
├── webpack.config.js      # Webpack configuration
└── .babelrc              # Babel configuration
```

## Configuration

The application is configured to proxy API requests to the microservices. Ensure the ABN_LOOKUP_SERVICE is running and accessible.

## Testing

You can test the ABN lookup functionality with these sample ABNs:
- 51824753556 (Australian Business Register)
- Any valid 11-digit ABN

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

1. **API Connection Issues**: Ensure the microservices are running and accessible
2. **CORS Issues**: Configure your microservice to allow requests from the UI origin
3. **Build Issues**: Ensure all dependencies are installed with `npm install`