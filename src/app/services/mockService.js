import { Brain, Database, Shield, AlertTriangle, ListTodo, Wrench, ScanEye, Lightbulb, SatelliteDish, FileSpreadsheet, Mail } from "lucide-react";

// Icon mapping
const iconMap = {
  "Brain": Brain,
  "Database": Database,
  "Shield": Shield,
  "AlertTriangle": AlertTriangle,
  "ListTodo": ListTodo,
  "Wrench": Wrench,
  "ScanEye": ScanEye,
  "Lightbulb": Lightbulb,
  "SatelliteDish": SatelliteDish,
  "FileSpreadsheet": FileSpreadsheet,
  "Mail": Mail
};

// Import all mock files
// import databaseErrors from '../mocks/database-errors.json';
import defaultMock from '../mocks/default.json';
// import orderPartsInitial from '../mocks/order-parts-initial.json';
// import orderPartsHeavyDuty from '../mocks/order-parts-heavy-duty.json';
// import orderPartsStandard from '../mocks/order-parts-standard.json';
import partsSearchFlow from '../mocks/parts-search-flow.json';
import partSelectionHd2024 from '../mocks/part-selection-hd2024.json';
import supplierContactFlow from '../mocks/supplier-contact-flow.json';
import offerAnalysisFlow from '../mocks/offer-analysis-flow.json';
import orderCreationFlow from '../mocks/order-creation-flow.json';
import orderStatusFlow from '../mocks/order-status-flow.json';

const mockFlows = [
  // databaseErrors,
  partsSearchFlow,
  partSelectionHd2024,
  supplierContactFlow,
  offerAnalysisFlow,
  orderCreationFlow,
  orderStatusFlow,
  // orderPartsInitial,
  // orderPartsHeavyDuty, 
  // orderPartsStandard,
  defaultMock
];

// Context state for tracking interactive flows
let conversationContext = {
  waitingForChoice: false,
  lastFlowId: null,
  awaitingFollowUp: false,
  followUpFlowId: null
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
  
  // Check if we're awaiting a follow-up response
  if (conversationContext.awaitingFollowUp && conversationContext.followUpFlowId) {
    // Find the flow that was waiting for follow-up
    const previousFlow = mockFlows.find(f => f.id === conversationContext.followUpFlowId);
    
    if (previousFlow && previousFlow.followUpKeywords && previousFlow.followUpMessages) {
      // Check if user input contains any follow-up keywords
      const hasFollowUpKeyword = previousFlow.followUpKeywords.some(keyword => 
        input.includes(keyword.toLowerCase())
      );
      
      if (hasFollowUpKeyword) {
        // Process follow-up messages
        const processedMessages = previousFlow.followUpMessages.map(message => {
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
        
        // Reset follow-up context
        conversationContext.awaitingFollowUp = false;
        conversationContext.followUpFlowId = null;
        
        // Check if follow-up has interactive elements
        const hasInteractiveMessage = previousFlow.followUpMessages.some(msg => msg.type === "interactive");
        if (hasInteractiveMessage) {
          conversationContext.waitingForChoice = true;
          conversationContext.lastFlowId = previousFlow.id;
        }
        
        return {
          ...previousFlow,
          messages: processedMessages,
          context: conversationContext
        };
      }
    }
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
  const hasFollowUpMessages = bestMatch.followUpKeywords && bestMatch.followUpMessages;
  
  if (hasInteractiveMessage) {
    conversationContext.waitingForChoice = true;
    conversationContext.lastFlowId = bestMatch.id;
  } else if (hasFollowUpMessages) {
    // Set up follow-up context
    conversationContext.awaitingFollowUp = true;
    conversationContext.followUpFlowId = bestMatch.id;
    conversationContext.waitingForChoice = false;
  } else {
    conversationContext.waitingForChoice = false;
    conversationContext.awaitingFollowUp = false;
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