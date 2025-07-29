"use client";

// Mock responses for different types of questions
const MOCK_RESPONSES = {
  default: {
    states: [
      { trace: "Analyzing your question" },
      { trace: "Searching knowledge base" },
      { trace: "Processing information" },
      { trace: "Generating response" }
    ],
    response: "This is a mock response to your question. The system is currently running in mock mode, so all responses are simulated. In a real scenario, this would contain the actual answer from the AI agent.",
    delay: 800
  },
  greeting: {
    states: [
      { trace: "Recognizing greeting" },
      { trace: "Preparing friendly response" }
    ],
    response: "Hello! I'm your AI assistant running in mock mode. How can I help you today? Feel free to ask me anything and I'll provide simulated responses for testing purposes.",
    delay: 500
  },
  dbErrors: {
    states: [
      { trace: "planning", message: "The user asks for critical DB errors over the last 12 hours in PROD and whether there are spikes. I will query the Telemetry API for a summarized view grouped by database and error type, including counts and timestamps. Then I will highlight spikes using hourly deltas and recommend next steps. Tool to call: getDbErrorsSummary." },
      { 
        tool_use: { 
          tool: "getDbErrorsSummary", 
          status: "executing",
          request: {
            method: "POST",
            endpoint: "/telemetry/errors-summary",
            payload: {
              timeWindow: "PT12H",
              env: "PROD",
              errorCodes: ["ORA-00600","ORA-07445","ORA-04031","TNS-12541","ORA-00060"],
              groupBy: ["dbName","errorCode","hour"]
            }
          }
        } 
      },
      {
        tool_use: {
          tool: "getDbErrorsSummary",
          status: "completed",
          response: {
            window: "last 12h",
            env: "PROD",
            totals: {
              errors: 41,
              databasesAffected: 3
            },
            byDatabase: [
              {
                dbName: "FIN_PROD",
                host: "shdexadbp01",
                errorsTotal: 27,
                topErrors: [
                  { code: "ORA-00600", count: 12, lastSeen: "2025-07-28T02:13Z" },
                  { code: "ORA-04031", count: 9, lastSeen: "2025-07-28T05:42Z" },
                  { code: "ORA-00060", count: 6, lastSeen: "2025-07-28T01:55Z" }
                ],
                spikes: [
                  { hour: "01:00Z", errorCode: "ORA-00600", delta: "+10 vs prev hour" }
                ],
                recommendation: "Open P1 if ORA-00600 persists; check SGA sizing for ORA-04031; review locking sessions for ORA-00060."
              },
              {
                dbName: "DISTR_PROD",
                host: "shdexadbp03",
                errorsTotal: 9,
                topErrors: [
                  { code: "TNS-12541", count: 7, lastSeen: "2025-07-28T03:08Z" },
                  { code: "ORA-00060", count: 2, lastSeen: "2025-07-28T04:16Z" }
                ],
                spikes: [
                  { hour: "03:00Z", errorCode: "TNS-12541", delta: "+6 vs prev hour" }
                ],
                recommendation: "Investigate listener health on shdexadbp03; verify network path and listener.log."
              },
              {
                dbName: "BOROUGE_PROD",
                host: "shdexadbp07",
                errorsTotal: 5,
                topErrors: [
                  { code: "ORA-04031", count: 5, lastSeen: "2025-07-28T06:02Z" }
                ],
                spikes: [],
                recommendation: "Consider shared pool tuning; capture ASH/AWR if growth continues."
              }
            ]
          }
        }
      },
      { trace: "planning", message: "I've received the error summary from the last 12 hours. I can see 41 total errors across 3 databases. FIN_PROD has the most critical situation with 27 errors including ORA-00600 spikes. I'll now format this data into a clear summary table and highlight the spikes detected, then provide specific recommendations for each database based on the error types observed." }
    ],
    response: `I've analyzed the database error logs from the last 12 hours in production and found some critical issues that require immediate attention.

## Summary — last 12h (PROD)

| DB | Host | Total | Top errors | Last seen |
|---|---|---|---|---|
| **FIN_PROD** | \`shdexadbp01\` | **27** | **ORA‑00600**: 12, **ORA‑04031**: 9, **ORA‑00060**: 6 | **06:02Z** |
| **DISTR_PROD** | \`shdexadbp03\` | **9** | **TNS‑12541**: 7, **ORA‑00060**: 2 | **04:16Z** |
| **BOROUGE_PROD** | \`shdexadbp07\` | **5** | **ORA‑04031**: 5 | **06:02Z** |

## Spikes detected

**FIN_PROD** — **ORA‑00600** spike at **01:00Z** (\`+10 vs previous hour\`).

**DISTR_PROD** — **TNS‑12541** spike at **03:00Z** (\`+6 vs previous hour\`).

## Recommendations

**FIN_PROD**: Treat as **P1** if **ORA‑00600** repeats; collect incident evidence and check recent changes.

**DISTR_PROD**: Validate listener on \`shdexadbp03\` (**TNS‑12541**).

**BOROUGE_PROD**: Review **shared pool/SGA sizing** (**ORA‑04031**).

*Tell me if you want me to prepare a **ticket draft** for **FIN_PROD**.*`,
    delay: 1500
  },
  technical: {
    states: [
      { trace: "Analyzing technical query" },
      { trace: "Consulting documentation" },
      { trace: "Compiling technical details" },
      { trace: "Formatting response" }
    ],
    response: `Here's a mock technical response:

1. **System Architecture**: The system uses a microservices architecture
2. **Technologies**: Built with Next.js, React, and Material-UI
3. **API Integration**: RESTful APIs with Server-Sent Events for streaming
4. **Performance**: Optimized for real-time responses

This is simulated data for testing purposes.`,
    delay: 1200
  },
  data: {
    states: [
      { trace: "Querying database" },
      { tool_use: { tool: "SQL Query", status: "executing" } },
      { trace: "Processing results" },
      { trace: "Formatting data" }
    ],
    response: `Mock data results:

| ID | Name | Status | Last Updated |
|----|------|--------|--------------|
| 1 | System A | Active | 2024-01-15 |
| 2 | System B | Maintenance | 2024-01-14 |
| 3 | System C | Active | 2024-01-15 |

Total records: 3`,
    delay: 1500
  }
};

// Helper function to detect question type
const detectQuestionType = (text) => {
  // Always return dbErrors regardless of the question
  return 'dbErrors';
};

// Helper function to simulate streaming delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createGenaiAgentService = () => {
  let sessionId = `mock-session-${Date.now()}`;

  const sendMessage = async (text, onChunk, onEvent) => {
    // Detect the type of question
    const questionType = detectQuestionType(text);
    const mockData = MOCK_RESPONSES[questionType];

    try {
      // Send initial connecting state
      if (onEvent) {
        onEvent({ trace: "connecting" });
      }

      // Simulate processing delay
      await delay(300);

      // Send mock states one by one with 2 second delay between each
      for (const state of mockData.states) {
        if (onEvent) {
          onEvent(state);
        }
        await delay(3000); // 3 seconds between each state message
      }

      // Simulate streaming the response text
      const words = mockData.response.split(' ');
      const chunkSize = 3; // Number of words per chunk
      
      for (let i = 0; i < words.length; i += chunkSize) {
        const chunk = words.slice(i, i + chunkSize).join(' ') + ' ';
        if (onChunk) {
          onChunk(chunk);
        }
        await delay(50); // Small delay between chunks
      }

      // Send completion event
      if (onEvent) {
        onEvent({ 
          done: true,
          session_id: sessionId,
          message: "Mock response completed"
        });
      }

      return {
        answer: mockData.response,
        session_id: sessionId,
        done: true
      };

    } catch (error) {
      console.error('Mock service error:', error);
      if (onEvent) {
        onEvent({ 
          error: error.message,
          trace: "error"
        });
      }
      throw error;
    }
  };

  return {
    sendMessage,
  };
};

export default createGenaiAgentService;