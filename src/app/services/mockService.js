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
import orderPartsInitial from '../mocks/order-parts-initial.json';
import orderPartsHeavyDuty from '../mocks/order-parts-heavy-duty.json';
import orderPartsStandard from '../mocks/order-parts-standard.json';

const mockFlows = [
  databaseErrors,
  orderPartsInitial,
  orderPartsHeavyDuty, 
  orderPartsStandard,
  defaultMock
];

// Context state for tracking interactive flows
let conversationContext = {
  waitingForChoice: false,
  lastFlowId: null
};

/**
 * Finds the best matching mock flow based on user input
 * @param {string} userInput - The user's input message
 * @param {Object} previousState - Optional previous conversation state
 * @returns {Object} The selected mock flow with processed icons
 */
export function getMockFlow(userInput, previousState = null) {
  const input = userInput.toLowerCase();
  
  // Update context if provided
  if (previousState) {
    conversationContext = { ...conversationContext, ...previousState };
  }
  
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
  
  // Update context based on selected flow
  const hasInteractiveMessage = bestMatch.messages.some(msg => msg.type === "interactive");
  if (hasInteractiveMessage) {
    conversationContext.waitingForChoice = true;
    conversationContext.lastFlowId = bestMatch.id;
  } else {
    conversationContext.waitingForChoice = false;
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
    messages: processedMessages,
    context: conversationContext
  };
}

/**
 * Gets all available mock flows (for debugging/admin purposes)
 * @returns {Array} Array of all mock flows
 */
export function getAllMockFlows() {
  return mockFlows;
}