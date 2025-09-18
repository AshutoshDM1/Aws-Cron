# Modular Architecture

This project has been refactored into a clean, modular structure for better maintainability and readability.

## 📁 Project Structure

```
src/
├── index.ts              # Main entry point
├── server.ts             # Express server setup
├── config.ts             # Site monitoring configurations
├── types/
│   └── index.ts          # TypeScript interfaces and types
├── services/
│   ├── MonitoringService.ts  # Main monitoring orchestrator
│   ├── PingService.ts        # HTTP ping functionality
│   └── FileStorageService.ts # File-based data persistence
└── routes/
    └── api.ts            # API route handlers
```

## 🔧 Components

### **Types** (`src/types/`)
- `PingConfig`: Configuration interface for monitoring sites
- `PingResult`: Structure for ping operation results
- `PingStats`: Statistics aggregation interface

### **Services** (`src/services/`)

#### **MonitoringService**
- Main orchestrator class
- Manages cron jobs and coordinates ping operations
- Handles data persistence and statistics

#### **PingService** 
- Handles HTTP requests to monitored sites
- Implements retry logic with configurable delays
- Returns structured ping results

#### **FileStorageService**
- Manages file-based data persistence
- Handles loading/saving results and statistics
- Creates data directory structure

### **Routes** (`src/routes/`)
- Clean API route handlers
- Separated from server setup for better organization
- RESTful endpoint implementations

### **Server** (`src/server.ts`)
- Express application setup
- Middleware configuration
- Server initialization and graceful shutdown

## 🚀 Benefits of This Structure

1. **Separation of Concerns**: Each component has a single responsibility
2. **Testability**: Services can be easily unit tested in isolation
3. **Maintainability**: Changes to one component don't affect others
4. **Readability**: Code is organized logically and easy to navigate
5. **Reusability**: Services can be imported and used independently

## 🔄 Usage

The API remains exactly the same. The refactoring is purely internal:

```bash
npm run dev  # Start development server
npm start    # Start production server
```

All existing endpoints work unchanged:
- `GET /api/health`
- `GET /api/stats` 
- `GET /api/results`
- `GET /api/results/:url`
- `GET /api/configs`
