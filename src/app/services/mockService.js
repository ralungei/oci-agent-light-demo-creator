import { Brain, Database, Shield, AlertTriangle, ListTodo, Wrench, ScanEye } from "lucide-react";

// Icon mapping
const iconMap = {
  "Brain": Brain,
  "Database": Database,
  "Shield": Shield,
  "AlertTriangle": AlertTriangle,
  "ListTodo": ListTodo,
  "Wrench": Wrench,
  "ScanEye": ScanEye
};

// Import all mock files
import databaseErrors from '../mocks/database-errors.json';
import defaultMock from '../mocks/default.json';

const mockFlows = [
  databaseErrors,
  defaultMock
];

/**
 * Finds the best matching mock flow based on user input
 * @param {string} userInput - The user's input message
 * @returns {Object} The selected mock flow with processed icons
 */
export function getMockFlow(userInput) {
  const input = userInput.toLowerCase();
  
  // Find the best matching flow
  let bestMatch = defaultMock;
  let maxMatches = 0;
  
  for (const flow of mockFlows) {
    if (flow.keywords.length === 0) continue; // Skip default mock in matching
    
    const matches = flow.keywords.filter(keyword => 
      input.includes(keyword.toLowerCase())
    ).length;
    
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = flow;
    }
  }
  
  // Process the selected flow to replace icon strings with actual components
  const processedMessages = bestMatch.messages.map(message => {
    if (message.type === "chip" && message.chipData.icon) {
      return {
        ...message,
        chipData: {
          ...message.chipData,
          icon: iconMap[message.chipData.icon] || Brain
        }
      };
    }
    return message;
  });
  
  return {
    ...bestMatch,
    messages: processedMessages
  };
}

/**
 * Gets all available mock flows (for debugging/admin purposes)
 * @returns {Array} Array of all mock flows
 */
export function getAllMockFlows() {
  return mockFlows;
}