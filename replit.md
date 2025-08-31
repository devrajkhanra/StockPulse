# NSE Data Downloader

## Overview

NSE Data Downloader is a professional financial data management application built for downloading and organizing National Stock Exchange (NSE) data files. The application provides a modern web interface for scheduling and managing bulk downloads of various NSE data sources including Nifty 50 lists, indices data, stocks data, market activity, and options data. It features real-time progress tracking, file organization, and a comprehensive dashboard for monitoring download operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React-based frontend with TypeScript, built on top of Vite for fast development and optimized builds. The UI is constructed using shadcn/ui components with Tailwind CSS for styling, providing a professional and responsive design system. The frontend follows a component-based architecture with clear separation of concerns:

- **Components**: Modular UI components for date selection, download queue management, status panels, and data tables
- **Pages**: Route-based page components with React Router (wouter) for client-side navigation  
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Styling**: Tailwind CSS with custom design tokens and shadcn/ui component library

### Backend Architecture
The backend is built with Express.js and TypeScript, providing a RESTful API architecture. The server implements:

- **Route-based API**: Clean separation of concerns with dedicated route handlers
- **File Processing**: Advanced file download and extraction capabilities with progress tracking
- **Data Validation**: Zod schemas for request/response validation and type safety
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Data Storage Solutions
The application uses a dual-storage approach:

- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **In-Memory Storage**: Fallback MemStorage implementation for development and testing
- **File Storage**: Local filesystem management for downloaded NSE data files with organized directory structure

The database schema includes tables for users, download jobs, downloaded files, and system statistics, all with proper relationships and indexing.

### Download Management System
A sophisticated job queue system handles concurrent downloads:

- **Job Types**: Support for single-date and date-range downloads
- **Data Sources**: Multiple NSE data sources (Nifty 50, indices, stocks, market activity, options)
- **Progress Tracking**: Real-time progress updates with file-level granularity
- **Concurrent Processing**: Configurable concurrent download limits with proper resource management
- **File Organization**: Automatic organization of downloaded files into structured directories

### Authentication and Session Management
The application implements session-based authentication:

- **Session Storage**: PostgreSQL-backed session storage with connect-pg-simple
- **User Management**: Basic user authentication with secure password handling
- **Authorization**: Route-level authorization for protected endpoints

## External Dependencies

### Database
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Drizzle ORM**: Type-safe database operations with schema migrations
- **connect-pg-simple**: Session storage implementation

### UI Framework and Components
- **React**: Core frontend framework with TypeScript support
- **shadcn/ui**: Comprehensive UI component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Headless UI components for accessibility and keyboard navigation

### Data Fetching and State Management
- **TanStack React Query**: Server state management with caching and synchronization
- **Axios**: HTTP client for API requests with timeout and stream handling

### Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds

### File Processing
- **adm-zip**: ZIP file extraction for NSE options data
- **Node.js streams**: Efficient file downloading and processing

### External APIs
- **NSE Data Sources**: Direct integration with National Stock Exchange data APIs
- **Replit Platform**: Deployment and development environment integration