# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
- **Run development server**: `npm run dev` - Starts Next.js with Turbopack on http://localhost:3000
- **Build for production**: `npm run build`
- **Start production server**: `npm run start`
- **Run linter**: `npm run lint`

### Testing
No test commands are currently configured. Consider adding tests with Jest or React Testing Library.

## Architecture Overview

This is a Next.js 15 React application that serves as a frontend for Oracle Cloud Infrastructure (OCI) Generative AI Agents. The application follows a client-side rendering pattern with React contexts for state management.

### Key Architectural Patterns

1. **Service Layer Pattern**: All external API calls are abstracted into service modules in `src/app/services/`:
   - `genaiAgentService.js` - Handles streaming chat with backend using Server-Sent Events
   - `speechService.js` - Browser-based speech recognition via Web Speech API
   - `oracleSpeechService.js` - Oracle cloud speech integration
   - `flowService.js` - CRUD operations for workflow templates
   - `apiClient.js` - Base HTTP client configuration

2. **Context-Based State Management**: Uses React contexts for global state:
   - `ChatContext` - Manages chat sessions, messages, and streaming state
   - `ProjectsContext` - Handles multiple project configurations

3. **Component Structure**: Components are organized by feature:
   - `Chat/` - Main chat interface (ChatHeader, MessageItem, MessageContent, WelcomeScreen)
   - `Settings/` - Project configuration (ProjectCard, ProjectModal)
   - `Flows/` - Flow management dialogs

### Backend API Requirements

The application expects a backend at `NEXT_PUBLIC_GENAI_API_URL` (default: http://localhost:8000) with:
- `POST /chat/stream` - Streaming endpoint that accepts `{ message, session_id, project_id }` and returns Server-Sent Events
- `/flows` endpoints - CRUD operations for flow management

### Key Features

1. **Streaming Chat**: Real-time AI responses using SSE with support for:
   - Plain text messages
   - Mermaid diagrams (auto-rendered)
   - SQL query results (displayed as tables)
   - Citations with source links

2. **Multi-Project Support**: Up to 8 concurrent projects with independent:
   - Chat sessions
   - Theme customization
   - Speech provider settings
   - Background images

3. **Speech Integration**: Flexible speech-to-text with provider switching between browser and Oracle services

### Important Considerations

- All components use `"use client"` directive for client-side rendering
- Material-UI v7 is used for UI components with custom theming
- Session IDs are automatically generated and persisted per project
- The app supports markdown rendering with special handling for diagrams and tables
- Environment variable `NEXT_PUBLIC_GENAI_API_URL` must be set for backend connectivity