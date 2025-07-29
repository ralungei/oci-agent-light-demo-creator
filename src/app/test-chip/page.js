"use client";

import { Box, Stack, Typography, Paper, Collapse, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Brain, Database, Shield, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import DynamicChip from "../components/DynamicChip";
import TypingEffect from "../components/TypingEffect";
import JsonView from '@uiw/react-json-view';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Constants
const TYPING_SPEED = 5;
const MESSAGE_INTERVAL = 2000;
const COLLAPSE_DELAY = 300;

// Mock incoming messages stream
const mockMessages = [
  {
    type: "chip",
    chipData: {
      icon: Brain,
      label: "Planning",
      status: "success",
      content: "This is a mock planning phase where the AI agent is analyzing your request and preparing the best approach."
    }
  },
  {
    type: "chip",
    chipData: {
      icon: Database,
      label: "Analyzing", 
      status: "success",
      content: "Database analysis completed successfully. All connections are stable and performance metrics are within normal ranges."
    }
  },
  {
    type: "chip",
    chipData: {
      icon: Shield,
      label: "Securing",
      status: "success",
      content: "Security protocols applied successfully. All access controls and encryption are properly configured."
    }
  },
  {
    type: "text",
    content: "## Initial Phase Complete\n\nAll initial checks have passed successfully. The system is ready for the next phase of operations."
  },
  {
    type: "chip",
    chipData: {
      icon: AlertTriangle,
      label: "Validating",
      status: "error",
      content: {
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: "Some validation rules failed during the process",
        timestamp: "2024-01-15T10:30:00Z",
        failedRules: ["RULE_001", "RULE_003"]
      }
    }
  },
  {
    type: "chip",
    chipData: {
      icon: Database,
      label: "Retrying",
      status: "warning", 
      content: "Attempting to retry failed operations with adjusted parameters."
    }
  },
  {
    type: "text",
    content: "**Recovery in progress:** The system is attempting to recover from validation errors...\n\n- Adjusting validation parameters\n- Retrying failed operations\n- Monitoring system stability"
  },
  {
    type: "text",
    content: "## Final Summary\n\nThe process completed with mixed results:\n\n| Component | Status | Details |\n|-----------|--------|---------|\n| Planning | ✅ Success | Ready to proceed |\n| Analysis | ✅ Success | All checks passed |\n| Security | ✅ Success | Protocols applied |\n| Validation | ❌ Failed | Rules failed |\n| Retry | ⚠️ Warning | In progress |"
  }
];

export default function TestChipPage() {
  const [activeChips, setActiveChips] = useState({}); // Track active chip per group
  const [displayChips, setDisplayChips] = useState({}); // Track display content per group
  const [groupedElements, setGroupedElements] = useState([]);
  const [, setProcessedMessages] = useState([]);

  // Group messages into chip rows and text blocks
  const groupMessages = (messages) => {
    const groups = [];
    let currentChipGroup = [];

    messages.forEach((message, index) => {
      if (message.type === "chip") {
        currentChipGroup.push({ ...message.chipData, messageIndex: index });
      } else if (message.type === "text") {
        // If we have accumulated chips, add them as a group first
        if (currentChipGroup.length > 0) {
          groups.push({ type: "chipRow", chips: currentChipGroup });
          currentChipGroup = [];
        }
        // Add the text message
        groups.push({ type: "text", content: message.content, messageIndex: index });
      }
    });

    // Add any remaining chips
    if (currentChipGroup.length > 0) {
      groups.push({ type: "chipRow", chips: currentChipGroup });
    }

    return groups;
  };

  const startSimulation = () => {
    setProcessedMessages([]);
    setGroupedElements([]);
    setActiveChips({});
    setDisplayChips({});
    
    let messageIndex = 0;
    const interval = setInterval(() => {
      if (messageIndex < mockMessages.length) {
        const message = mockMessages[messageIndex];
        setProcessedMessages(prev => {
          const newMessages = [...prev, message];
          setGroupedElements(groupMessages(newMessages));
          return newMessages;
        });
        
        messageIndex++;
      } else {
        clearInterval(interval);
      }
    }, MESSAGE_INTERVAL);

    return interval;
  };

  // Simulate streaming messages
  useEffect(() => {
    const interval = startSimulation();
    return () => clearInterval(interval);
  }, []);

  // Handle chip changes per group
  const handleChipChange = (chip, groupIndex) => {
    if (chip) {
      setDisplayChips(prev => ({ ...prev, [groupIndex]: chip }));
      setActiveChips(prev => ({ ...prev, [groupIndex]: chip }));
    } else {
      setActiveChips(prev => ({ ...prev, [groupIndex]: null }));
      // Delay clearing display content until collapse finishes
      setTimeout(() => {
        setDisplayChips(prev => ({ ...prev, [groupIndex]: null }));
      }, COLLAPSE_DELAY);
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        gap: 3,
      }}
    >
        {/* Render grouped elements */}
        <Box sx={{ width: '100%', maxWidth: '800px' }}>
          {groupedElements.map((group, groupIndex) => (
            <Box key={groupIndex} sx={{ mb: 2 }}>
              {group.type === "chipRow" && (
                <Box>
                  <Stack direction="row" spacing={2} sx={{ minHeight: '40px', justifyContent: 'flex-start' }}>
                    {group.chips.map((chip) => (
                      <DynamicChip
                        key={`${chip.label}-${chip.messageIndex}`}
                        icon={chip.icon}
                        label={chip.label}
                        status={chip.status}
                        content={chip.content}
                        onExpand={(chipData) => handleChipChange(chipData, groupIndex)}
                        isActive={activeChips[groupIndex]?.label === chip.label}
                        startDelay={0} // No delay, appear immediately when added
                      />
                    ))}
                  </Stack>

                  {/* Shared expanded content area for this chip group */}
                  <Collapse in={!!activeChips[groupIndex]}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        mt: 1, 
                        p: 2, 
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: 2,
                        fontSize: '13px !important',
                        width: "100%",
                        position: 'relative',
                        '& *': {
                          fontSize: '13px !important'
                        }
                      }}
                    >
                      {/* Close button */}
                      <IconButton
                        onClick={() => handleChipChange(null, groupIndex)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          padding: 0.5,
                          color: 'rgba(0, 0, 0, 0.4)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            color: 'rgba(0, 0, 0, 0.6)'
                          }
                        }}
                      >
                        <CloseIcon sx={{ fontSize: '16px' }} />
                      </IconButton>

                      {displayChips[groupIndex] && (
                        <>
                          <Typography
                            variant="subtitle2"
                            sx={{ 
                              fontWeight: 500, 
                              fontSize: '14px !important',
                              marginBottom: 1,
                              paddingRight: 3 // Space for close button
                            }}
                          >
                            {displayChips[groupIndex].label}
                          </Typography>
                          {typeof displayChips[groupIndex].content === 'string' ? (
                            <Typography sx={{ fontSize: '13px !important', fontFamily: 'monospace' }}>
                              {displayChips[groupIndex].content}
                            </Typography>
                          ) : (
                            <Box>
                              <JsonView 
                                value={displayChips[groupIndex].content}
                                collapsed={1}
                                style={{
                                  backgroundColor: 'transparent',
                                  fontSize: '13px'
                                }}
                              />
                            </Box>
                          )}
                        </>
                      )}
                    </Paper>
                  </Collapse>
                </Box>
              )}
              
              {group.type === "text" && (
                <Box
                  sx={{
                    fontFamily: "var(--font-exo2), sans-serif",
                    '& *': {
                      fontFamily: "var(--font-exo2), sans-serif !important"
                    },
                    '& table': {
                      borderCollapse: 'collapse',
                      width: '100%',
                      marginBottom: 2
                    },
                    '& th, & td': {
                      border: '1px solid #ddd',
                      padding: '8px',
                      textAlign: 'left'
                    },
                    '& th': {
                      backgroundColor: '#f5f5f5',
                      fontWeight: 'bold'
                    }
                  }}
                >
                  <TypingEffect text={group.content} speed={TYPING_SPEED}>
                    {(displayedText) => (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {displayedText}
                      </ReactMarkdown>
                    )}
                  </TypingEffect>
                </Box>
              )}
            </Box>
          ))}
        </Box>
    </Box>
  );
}
