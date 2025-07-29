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

This is a Next.js 15 React application that serves as a **demo-only mock interface** for showcasing Oracle Cloud Infrastructure (OCI) Generative AI agent workflows. The application is entirely client-side with no real backend connections.

### Key Architectural Patterns

1. **Mock Service Pattern**: All responses are generated from pre-configured JSON mock files:
   - `mockService.js` - Selects appropriate mock flows based on keyword matching
   - Mock files in `src/app/mocks/`:
     - `default.json` - General conversational responses
     - `database-errors.json` - Database-specific error scenarios

2. **Service Layer**: Services in `src/app/services/`:
   - `genaiAgentService.js` - Simulates streaming chat responses using mock data
   - `apiClient.js` - Base HTTP client (currently unused in mock mode)
   - `flowService.js` - Flow CRUD operations (currently non-functional)
   - `speechService.js` & `oracleSpeechService.js` - Speech integrations (not active)

3. **Component Structure**:
   - Main chat interface in `src/app/page.js`
   - Reusable components in `src/app/components/`:
     - `AgentStateRenderer.js` - Displays agent processing states
     - `DynamicChip.js` - Animated status chips
     - `TypingEffect.js` - Simulates typing animation

### Mock Response System

The application uses a keyword-based matching system to select appropriate mock responses:
1. User input is analyzed for keywords
2. Best matching mock flow is selected from available JSON files
3. Responses are streamed character-by-character to simulate real AI interaction
4. Special message types supported: text, chips (with icons), agent states, interactive choices

### Interactive Flows

The system supports interactive choice-based flows:
- **Interactive Messages**: JSON files can include `"type": "interactive"` messages with choice options
- **Auto-submission**: When users click a choice button, the text is auto-inserted and submitted
- **Context Tracking**: The mock service tracks conversation state for multi-step flows
- **Example Flow**: Order parts workflow (keywords: "order", "parts") demonstrates the interactive system

### Important Considerations

- **Demo Only**: This application has no real backend connections - all data is mocked
- All components use `"use client"` directive for client-side rendering
- Material-UI v7 is used for UI components with custom theming
- ChatContext and ProjectsContext are defined but not currently used
- The app is designed for presentations and UI/UX demonstrations only