# Puzzle Slider Game

## Overview

This is a modern sliding puzzle game application built with React, TypeScript, and Express. The application allows users to play the classic 3x3 sliding puzzle game with preset images or their own custom uploaded images. Players can track their game statistics, including move count and completion time, with persistent game history storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development tooling
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessible, modern interface components
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **State Management**: React hooks for local state and TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Image Processing**: Canvas API for client-side image cropping and processing

### Backend Architecture  
- **Runtime**: Node.js with Express server framework
- **Language**: TypeScript with ES modules
- **Development**: Vite middleware integration for hot module replacement in development
- **API Design**: RESTful endpoints for game data and image upload functionality
- **File Handling**: Multer for multipart file uploads with Sharp for server-side image processing

### Data Storage Solutions
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless driver for cloud deployment
- **Schema**: Structured tables for game history and custom image metadata
- **Development Fallback**: In-memory storage implementation for development environments
- **Migrations**: Drizzle Kit for database schema migrations

### Game Logic Architecture
- **Puzzle Engine**: Custom sliding puzzle implementation with solvability validation
- **Game State**: Immutable state management with move validation and win condition detection
- **Timer System**: Real-time game timer with pause/resume functionality
- **Statistics Tracking**: Move counting and time tracking with persistent storage

### External Dependencies
- **Database**: Neon PostgreSQL for cloud database hosting
- **Image Service**: Unsplash API integration for preset puzzle images
- **UI Components**: Radix UI primitives for accessible component foundation
- **Development**: Replit-specific tooling for cloud development environment
- **Deployment**: Express static file serving for production builds