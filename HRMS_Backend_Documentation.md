# HRMS Backend System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Database Models](#database-models)
6. [API Endpoints](#api-endpoints)
7. [Authentication & Security](#authentication--security)
8. [File Upload System](#file-upload-system)
9. [Utility Functions](#utility-functions)
10. [Configuration](#configuration)
11. [Installation & Setup](#installation--setup)
12. [API Documentation](#api-documentation)

---

## System Overview

The HRMS (Human Resource Management System) Backend is a Node.js-based REST API designed to manage employee data and attendance tracking for multiple companies. The system supports two companies: **ThriveBrands** and **EcoSoul**.

### Key Features
- **Employee Management**: CRUD operations for employee records
- **Attendance Tracking**: Mark, update, and track employee attendance
- **Bulk Data Import**: CSV file upload for employees and attendance
- **Multi-Company Support**: Separate data management for different companies
- **Authentication**: JWT-based secure authentication system
- **API Documentation**: Swagger/OpenAPI documentation
- **File Management**: Secure file upload and storage system

---

## Architecture

The system follows a **MVC (Model-View-Controller)** architecture pattern:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Routes        │───▶│  Controllers    │───▶│   Models        │
│   (API Layer)   │    │  (Business      │    │   (Data Layer)  │
│                 │    │   Logic)        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Middleware     │    │   Utils         │    │   Database      │
│  (Auth, etc.)   │    │  (Helpers)      │    │  (Sequelize)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## Technology Stack

### Backend Framework
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **ES6 Modules** - Modern JavaScript module system

### Database
- **Sequelize** - ORM (Object-Relational Mapping)
- **SQL Server** - Database (via Tedious driver)
- **MySQL2** - Alternative database driver

### Authentication & Security
- **JWT (JSON Web Tokens)** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### File Processing
- **express-fileupload** - File upload middleware
- **csv-parse** - CSV file parsing
- **csv-parser** - Alternative CSV parser

### Documentation
- **Swagger/OpenAPI** - API documentation
- **swagger-jsdoc** - JSDoc to Swagger conversion
- **swagger-ui-express** - Swagger UI interface

### Development Tools
- **nodemon** - Development server with auto-restart
- **dotenv** - Environment variable management

---

## Project Structure

```
hrms_temp_backend/
├── app.js                          # Main application entry point
├── package.json                    # Dependencies and scripts
├── swagger.js                      # Swagger configuration
├── Models/                         # Database models
│   ├── user.js                     # User authentication model
│   ├── employee.js                 # Employee data model
│   ├── attendance.js               # Attendance tracking model
│   └── attendanceSheet.js          # Attendance sheet model (commented)
├── Users/                          # User-related functionality
│   ├── Controllers/                # Business logic controllers
│   │   ├── auth.js                 # Authentication controller
│   │   ├── employee.js             # Employee management controller
│   │   ├── attendance.js           # Attendance controller
│   │   └── attendanceSheet.js      # Attendance sheet controller (commented)
│   ├── Routes/                     # API route definitions
│   │   ├── auth.js                 # Authentication routes
│   │   ├── employee.js             # Employee routes
│   │   ├── attendance.js           # Attendance routes
│   │   └── attendanceSheet.js      # Attendance sheet routes (commented)
│   └── Middleware/                 # Custom middleware
│       └── tokenVerify.js          # JWT token verification
├── Utils/                          # Utility functions and configurations
│   ├── All_Models.js               # Model aggregator
│   ├── All_Model_Relationships.js  # Database relationships
│   ├── All_User_Routes.js          # Route aggregator
│   ├── dbConnection.js             # Database connection
│   ├── csvParser.js                # CSV file parser
│   ├── directoryFunctions.js       # Directory management
│   └── singleFileUpload.js         # File upload utility
└── upload/                         # File upload storage
    ├── attendanceSheets/           # Attendance CSV files
    └── employeeSheets/             # Employee CSV files
```

---

## Database Models

### 1. User Model (`Models/user.js`)
**Purpose**: Handles user authentication and authorization

**Fields**:
- `id` (Primary Key, Auto-increment)
- `email` (String, Required, Unique)
- `password` (String, Required, Hashed)

**Relationships**: None

### 2. Employee Model (`Models/employee.js`)
**Purpose**: Stores employee information and company details

**Fields**:
- `id` (Primary Key, Auto-increment)
- `name` (String, Required)
- `email` (String, Required)
- `department` (ENUM, Required)
  - Values: IT, HR, Finance, Marketing, Sales, Engineering, Customer Support, Legal, Product, Design, Operations
- `designation` (String, Required)
- `dateOfJoining` (Date, Required)
- `biometricId` (String, Required)
- `gender` (ENUM, Required)
  - Values: Male, Female, Other
- `company` (ENUM, Required)
  - Values: ThriveBrands, EcoSoul

**Relationships**:
- Has Many: Attendance records

### 3. Attendance Model (`Models/attendance.js`)
**Purpose**: Tracks employee attendance with detailed time records

**Fields**:
- `id` (Primary Key, Auto-increment)
- `name` (String, Required)
- `employeeId` (Integer, Required, Foreign Key)
- `status` (ENUM, Required)
  - Values: Present, Absent, Half Day, Late
- `punchIn` (Time, Optional)
- `punchOut` (Time, Optional)
- `workingHours` (Decimal(4,2), Optional, Calculated)
- `date` (Date, Required)
- `remarks` (Text, Optional)
- `lastModifiedBy` (Integer, Optional, Foreign Key to User)
- `modificationReason` (Text, Optional)

**Indexes**:
- Unique: `employeeId + date` (Prevents duplicate attendance)
- Index: `employeeId`
- Index: `date`

**Relationships**:
- Belongs To: Employee
- Belongs To: User (for modification tracking)

### 4. Model Relationships (`Utils/All_Model_Relationships.js`)
```javascript
// Employee has many attendances
Employee.hasMany(Attendance, { foreignKey: 'employeeId' });

// Attendance belongs to one employee
Attendance.belongsTo(Employee, { foreignKey: 'employeeId' });
```

---

## API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/logout` | User logout | Yes |

### Employee Routes (`/employee`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/employee/createEmployee` | Create single employee | No |
| GET | `/employee/getAllEmployees` | Get all employees | No |
| GET | `/employee/getEmployeeById` | Get employee by ID | No |
| PUT | `/employee/updateEmployee` | Update employee | No |
| DELETE | `/employee/deleteEmployee` | Delete employee | No |
| POST | `/employee/uploadEmployeeSheet` | Bulk upload employees via CSV | No |
| GET | `/employee/getEcoSoulEmployees` | Get EcoSoul employees only | No |
| GET | `/employee/getThriveBrandsEmployees` | Get ThriveBrands employees only | No |

### Attendance Routes (`/attendance`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/attendance/getAllAttendances` | Get all attendance records | Yes |
| GET | `/attendance/getAttendanceById` | Get attendance by employee ID and date | Yes |
| PUT | `/attendance/updateAttendance` | Update attendance record | Yes |
| POST | `/attendance/markAttendance` | Mark new attendance | Yes |
| GET | `/attendance/getEmployeeAttendance` | Get employee attendance with date range | Yes |
| GET | `/attendance/getDailyAttendance` | Get all employees' attendance for a date | Yes |
| POST | `/attendance/uploadAttendanceSheet` | Bulk upload attendance via CSV | Yes |
| POST | `/attendance/previewAttendanceSheet` | Preview CSV before upload | Yes |
| GET | `/attendance/canModifyAttendance` | Check if attendance can be modified | Yes |

---

## Authentication & Security

### JWT Token System
The system uses a dual-token approach for enhanced security:

1. **Access Token** (`accessTokenHRMS`)
   - Expires: 7 days
   - Used for: API authentication
   - Stored in: HTTP-only cookies

2. **Refresh Token** (`refreshTokenHRMS`)
   - Expires: 30 days
   - Used for: Token renewal
   - Stored in: HTTP-only cookies

### Token Verification Process (`Users/Middleware/tokenVerify.js`)
1. Extract access token from cookies
2. Verify access token
3. If expired, attempt refresh using refresh token
4. Generate new access token if refresh is successful
5. Add user information to request object

### Password Security
- Passwords are hashed using **bcrypt** with salt rounds of 10
- Passwords are never stored in plain text

### CORS Configuration
- Origin: `http://localhost:5173` (Frontend URL)
- Credentials: Enabled for cookie-based authentication

---

## File Upload System

### Supported File Types
- **CSV files** for employee and attendance data
- Automatic file validation and parsing

### Upload Directories
- `upload/employeeSheets/` - Employee CSV files
- `upload/attendanceSheets/` - Attendance CSV files

### File Naming Convention
```
{timestamp}_{original_filename}
Example: 1758885844892_Kinetica-UK_Inventory.csv
```

### CSV Processing
- **Employee CSV**: Maps columns to employee fields
- **Attendance CSV**: Validates and processes attendance data
- **Error Handling**: Detailed error reporting for invalid data

### File Upload Flow
1. File validation (type, size)
2. Directory creation (if not exists)
3. File storage with timestamp prefix
4. CSV parsing and data validation
5. Database insertion with error handling

---

## Utility Functions

### 1. Database Connection (`Utils/dbConnection.js`)
- **Sequelize** configuration for SQL Server
- **Tedious** driver for SQL Server connectivity
- Environment-based configuration
- Encryption support

### 2. CSV Parser (`Utils/csvParser.js`)
- Supports CSV file parsing
- Error handling for unsupported formats
- UTF-8 encoding support
- Column mapping and validation

### 3. Directory Functions (`Utils/directoryFunctions.js`)
- `createDirectory()` - Create directories recursively
- `deleteDirectory()` - Remove directories
- `deleteSingleFile()` - Remove individual files
- Cross-platform path handling

### 4. File Upload (`Utils/singleFileUpload.js`)
- Single file upload handling
- Directory creation before upload
- Promise-based file operations
- Error handling and validation

### 5. Model Aggregator (`Utils/All_Models.js`)
- Centralized model imports
- Sequelize operators export
- Simplified model access across controllers

---

## Configuration

### Environment Variables Required
```env
# Database Configuration
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=your_host
DB_DIALECT=mssql
DB_PORT=1433
DB_ENCRYPT=true

# JWT Configuration
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Server Configuration
PORT=5010
```

### CORS Configuration
- **Origin**: `http://localhost:5173`
- **Credentials**: Enabled
- **Methods**: All standard HTTP methods

### Swagger Configuration
- **API Documentation**: Available at `/swagger`
- **OpenAPI Version**: 3.0.0
- **Server URL**: Dynamic based on PORT environment variable

---

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- SQL Server database
- pnpm package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hrms_temp_backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database and JWT configuration
   ```

4. **Database setup**
   - Create SQL Server database
   - Update connection details in `.env`
   - Tables will be created automatically on first run

5. **Start the application**
   ```bash
   # Development mode
   pnpm start
   
   # Production mode
   pnpm serve
   ```

### Available Scripts
- `pnpm start` - Development server with nodemon
- `pnpm serve` - Production server
- `pnpm test` - Run tests (not implemented)

---

## API Documentation

### Swagger UI
The API documentation is available at: `http://localhost:5010/swagger`

### Key API Features

#### Employee Management
- **Bulk Import**: Upload CSV files with employee data
- **Company Filtering**: Separate endpoints for ThriveBrands and EcoSoul
- **Data Validation**: Comprehensive field validation
- **CRUD Operations**: Full create, read, update, delete functionality

#### Attendance Management
- **Time Tracking**: Punch in/out with automatic hour calculation
- **Status Management**: Present, Absent, Half Day, Late
- **Modification Rules**: 1-week modification window
- **Bulk Operations**: CSV upload for multiple attendance records
- **Date Range Queries**: Flexible date-based filtering

#### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Token Refresh**: Automatic token renewal
- **Cookie Security**: HTTP-only, secure cookies
- **Input Validation**: Comprehensive request validation

### Error Handling
- **HTTP Status Codes**: Proper status code usage
- **Error Messages**: Descriptive error responses
- **Validation Errors**: Detailed field-level validation
- **Database Errors**: Graceful database error handling

### Response Formats
```json
// Success Response
{
  "message": "Operation successful",
  "data": { ... }
}

// Error Response
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

## Development Notes

### Code Quality
- **ES6 Modules**: Modern JavaScript module system
- **Async/Await**: Promise-based asynchronous operations
- **Error Handling**: Comprehensive try-catch blocks
- **Code Organization**: Clear separation of concerns

### Performance Considerations
- **Database Indexes**: Optimized queries with proper indexing
- **File Processing**: Efficient CSV parsing and validation
- **Memory Management**: Proper file handling and cleanup

### Security Best Practices
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Secure token generation and verification
- **Input Sanitization**: Request validation and sanitization
- **File Upload Security**: Type validation and secure storage

### Future Enhancements
- **Attendance Sheet Model**: Currently commented out, ready for implementation
- **Advanced Reporting**: Attendance analytics and reporting
- **Role-Based Access**: User role management
- **Audit Logging**: Comprehensive activity tracking
- **API Rate Limiting**: Request throttling and protection

---

*This documentation provides a comprehensive overview of the HRMS Backend system. For specific implementation details, refer to the source code and Swagger API documentation.*
