"use client";

import { Close as CloseIcon, KeyboardReturn } from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import JsonView from "@uiw/react-json-view";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Circle,
  Package,
  Play,
  Settings,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AnalogClock from "./components/AnalogClock";
import ComparisonTable from "./components/ComparisonTable";
import DustText from "./components/DustText";
import DynamicChip from "./components/DynamicChip";
import ProcessDiagram from "./components/ProcessDiagram";
import ProgressTracker from "./components/ProgressTracker";
import Sources from "./components/Sources";
import SupplierCard from "./components/SupplierCard";
import TypingEffect from "./components/TypingEffect";
import createGenaiAgentService from "./services/genaiAgentService";
import { getMockFlow } from "./services/mockService";
import { getErrorMessage } from "./utils/errorMessages";

// Constants
const TYPING_SPEED = 5;
const MESSAGE_INTERVAL = 1700;
const COLLAPSE_DELAY = 300;

// Common styles
const fontSizes = { xs: "1.5rem", sm: "1.8rem", md: "2rem" };
const textFieldFontSizes = { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" };
const contentFontSizes = { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" };

const commonTextStyles = {
  fontSize: fontSizes,
  fontWeight: 300,
  textAlign: "left",
  lineHeight: 1.4,
  margin: 0,
};

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentStates, setAgentStates] = useState([]);
  const [genaiService, setGenaiService] = useState(null);
  
  // Current conversation state
  const [activeChips, setActiveChips] = useState({});
  const [displayChips, setDisplayChips] = useState({});
  const [groupedElements, setGroupedElements] = useState([]);
  const [, setProcessedMessages] = useState([]);
  const [showTextField, setShowTextField] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [lookDirection, setLookDirection] = useState("center");
  const [typingTimer, setTypingTimer] = useState(null);
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  

  useEffect(() => {
    setGenaiService(createGenaiAgentService());
    // Show text field after welcome animation completes
    const timer = setTimeout(() => {
      setShowTextField(true);
    }, 600); // Hey (200ms) + delay (200ms) + Welcome back! (200ms)

    return () => {
      clearTimeout(timer);
      // Cleanup all active processes on unmount
      cleanupActiveProcesses();
    };
  }, []);




  // Group messages into chip rows, text blocks, and interactive elements
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
        groups.push({
          type: "text",
          content: message.content,
          sources: message.sources, // Include sources if present
          messageIndex: index,
        });
      } else if (message.type === "interactive") {
        // If we have accumulated chips, add them as a group first
        if (currentChipGroup.length > 0) {
          groups.push({ type: "chipRow", chips: currentChipGroup });
          currentChipGroup = [];
        }
        // Add the interactive message
        groups.push({
          type: "interactive",
          interactiveData: message.interactiveData,
          messageIndex: index,
        });
      } else if (message.type === "progress_tracker") {
        // If we have accumulated chips, add them as a group first
        if (currentChipGroup.length > 0) {
          groups.push({ type: "chipRow", chips: currentChipGroup });
          currentChipGroup = [];
        }
        groups.push({
          type: "progress_tracker",
          progressData: message.progressData,
          messageIndex: index,
        });
      } else if (message.type === "comparison_table") {
        // If we have accumulated chips, add them as a group first
        if (currentChipGroup.length > 0) {
          groups.push({ type: "chipRow", chips: currentChipGroup });
          currentChipGroup = [];
        }
        groups.push({
          type: "comparison_table",
          comparisonData: message.comparisonData,
          messageIndex: index,
        });
      } else if (message.type === "process_diagram") {
        // If we have accumulated chips, add them as a group first
        if (currentChipGroup.length > 0) {
          groups.push({ type: "chipRow", chips: currentChipGroup });
          currentChipGroup = [];
        }
        groups.push({
          type: "process_diagram",
          processData: message.processData,
          messageIndex: index,
        });
      } else if (message.type === "supplier_card") {
        // If we have accumulated chips, add them as a group first
        if (currentChipGroup.length > 0) {
          groups.push({ type: "chipRow", chips: currentChipGroup });
          currentChipGroup = [];
        }
        groups.push({
          type: "supplier_card",
          supplierData: message.supplierData,
          messageIndex: index,
        });
      }
    });

    // Add any remaining chips
    if (currentChipGroup.length > 0) {
      groups.push({ type: "chipRow", chips: currentChipGroup });
    }

    return groups;
  };

  const startSimulation = (userInput) => {
    // Get the appropriate mock flow based on user input
    const mockFlow = getMockFlow(userInput || "");

    setProcessedMessages([]);
    setGroupedElements([]);
    setActiveChips({});
    setDisplayChips({});
    setShowProgress(true);
    setIsSimulationActive(true);

    let messageIndex = 0;
    const timeouts = [];
    let cancelled = false;

    const processNextMessage = () => {
      if (messageIndex < mockFlow.messages.length) {
        const message = mockFlow.messages[messageIndex];
        setProcessedMessages((prev) => {
          const newMessages = [...prev, message];
          const newGroupedElements = groupMessages(newMessages);
          setGroupedElements(newGroupedElements);
          
          
          return newMessages;
        });

        messageIndex++;

        // Use different delay for subsequent messages
        if (messageIndex < mockFlow.messages.length && !cancelled) {
          const timeout = setTimeout(processNextMessage, MESSAGE_INTERVAL);
          timeouts.push(timeout);
        } else {
          // Hide progress after a delay when all messages are processed
          const finalTimeout = setTimeout(() => {
            if (!cancelled) {
              setShowProgress(false);
              setIsSimulationActive(false);
            }
          }, 2000);
          timeouts.push(finalTimeout);
        }
      }
    };

    // Start with first message after 1 second
    const initialTimeout = setTimeout(processNextMessage, 500);
    timeouts.push(initialTimeout);

    // Return control object
    const simulation = {
      cancel: () => {
        cancelled = true;
        timeouts.forEach(timeout => clearTimeout(timeout));
        setShowProgress(false);
        setIsSimulationActive(false);
      }
    };

    setActiveSimulation(simulation);
    return simulation;
  };

  // Cleanup function to cancel all active processes
  const cleanupActiveProcesses = () => {
    if (activeSimulation) {
      activeSimulation.cancel();
      setActiveSimulation(null);
    }
    if (typingTimer) {
      clearTimeout(typingTimer);
      setTypingTimer(null);
    }
  };

  // Handle chip changes per group
  const handleChipChange = (chip, groupIndex) => {
    if (chip) {
      setDisplayChips((prev) => ({ ...prev, [groupIndex]: chip }));
      setActiveChips((prev) => ({ ...prev, [groupIndex]: chip }));
    } else {
      setActiveChips((prev) => ({ ...prev, [groupIndex]: null }));
      // Delay clearing display content until collapse finishes
      setTimeout(() => {
        setDisplayChips((prev) => ({ ...prev, [groupIndex]: null }));
      }, COLLAPSE_DELAY);
    }
  };

  const handleSubmit = async () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput && genaiService && !isSimulationActive) {
      setSubmittedMessage(trimmedInput);
      setInputValue("");
      setAgentStates([{ trace: "connecting" }]);
      setIsLoading(true);

      // Start the chip simulation when submitting
      startSimulation(trimmedInput);

      try {
        await genaiService.sendMessage(
          trimmedInput,
          (chunk) => {
            // Add text chunks as they arrive
            setAgentStates((prev) => {
              // Remove connecting state if it's the only one
              const filtered =
                prev.length === 1 && prev[0].trace === "connecting" ? [] : prev;
              return [...filtered, { type: "text", content: chunk }];
            });
          },
          (eventData) => {
            // Add any event data to the states list
            setAgentStates((prev) => {
              // Remove connecting state if it's the only one
              const filtered =
                prev.length === 1 && prev[0].trace === "connecting" ? [] : prev;
              return [...filtered, eventData];
            });
          }
        );
      } catch (error) {
        console.error("Error calling agent:", error);
        const errorMessage = getErrorMessage(error);
        setAgentStates((prev) => [
          ...prev,
          { type: "error", content: errorMessage },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Get icon by option type
  const getIconByType = (type) => {
    switch (type) {
      case "product":
        return Package;
      case "service":
        return Settings;
      case "action":
        return Play;
      case "success":
        return CheckCircle;
      case "warning":
        return AlertCircle;
      default:
        return Circle;
    }
  };


  // Handle interactive option selection
  const handleOptionSelect = (optionLabel) => {
    // Block if simulation active
    if (isSimulationActive) return;
    
    // Directly trigger the submission process without filling the text field
    setSubmittedMessage(optionLabel);
    setAgentStates([{ trace: "connecting" }]);
    setIsLoading(true);

    // Start the chip simulation with the selected option
    startSimulation(optionLabel);

    // Process through genaiService (if needed for consistency)
    if (genaiService) {
      genaiService
        .sendMessage(
          optionLabel,
          (chunk) => {
            setAgentStates((prev) => {
              const filtered =
                prev.length === 1 && prev[0].trace === "connecting" ? [] : prev;
              return [...filtered, { type: "text", content: chunk }];
            });
          },
          (eventData) => {
            setAgentStates((prev) => {
              const filtered =
                prev.length === 1 && prev[0].trace === "connecting" ? [] : prev;
              return [...filtered, eventData];
            });
          }
        )
        .catch((error) => {
          console.error("Error calling agent:", error);
          const errorMessage = getErrorMessage(error);
          setAgentStates((prev) => [
            ...prev,
            { type: "error", content: errorMessage },
          ]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        backgroundImage: "url('/backgrounds/white-red-background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {/* Contenedor principal con flexbox */}
      <Box
        sx={{
          display: "flex",
          gap: 4,
          width: "100%",
          maxWidth: "1400px",
        }}
      >
        {/* Columna izquierda */}
        <Box sx={{ flex: "0 0 30%", paddingTop: "15vh", paddingLeft: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              mb: 2,
              height: "40px",
              alignItems: "center",
            }}
          >
            <AnalogClock
              status={showProgress ? "processing" : "idle"}
            />
          </Box>
          <Box sx={{ minHeight: "100px" }}>
            <TypingEffect text="Hey," speed={50}>
              {(displayedText) => (
                <Typography
                  variant="h3"
                  sx={{
                    ...commonTextStyles,
                    minHeight: "40px",
                    color: "#000000",
                  }}
                >
                  {displayedText}
                </Typography>
              )}
            </TypingEffect>
            <TypingEffect text="Welcome back!" speed={50} delay={200}>
              {(displayedText) => (
                <Typography
                  variant="h3"
                  sx={{
                    ...commonTextStyles,
                    minHeight: "40px",
                    color: "#000000",
                  }}
                >
                  {displayedText}
                </Typography>
              )}
            </TypingEffect>
          </Box>

          <AnimatePresence>
            {showTextField && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94], // Apple's signature cubic-bezier
                }}
              >
                <Box
                  sx={{
                    mt: 1,
                    mb: 4, // Bottom margin to separate from Recent Conversations
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    height: "16rem", // Fixed height to accommodate TextField with 8 rows
                  }}
                >
                  <TextField
                    autoFocus
                    variant="standard"
                    placeholder="Type anything..."
                    multiline
                    maxRows={8}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);

                      // Change look direction when typing
                      if (e.target.value.length > 0) {
                        setLookDirection("down");

                        // Clear existing timer and set new one
                        if (typingTimer) {
                          clearTimeout(typingTimer);
                        }

                        const newTimer = setTimeout(() => {
                          setLookDirection("center");
                        }, 2000);

                        setTypingTimer(newTimer);
                      } else {
                        // If input is empty, return to center immediately
                        setLookDirection("center");
                        if (typingTimer) {
                          clearTimeout(typingTimer);
                          setTypingTimer(null);
                        }
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    fullWidth
                    sx={{
                      "& input, & textarea, & .MuiInput-input": {
                        fontSize: textFieldFontSizes,
                        fontWeight: "100 !important",
                        color: "rgba(0, 0, 0, 0.6)",
                        paddingTop: "4px",
                        lineHeight: 1.3,
                      },
                      "& .MuiInput-underline:before, & .MuiInput-underline:hover:not(.Mui-disabled):before, & .MuiInput-underline:after":
                        {
                          borderBottom: "none",
                        },
                    }}
                  />
                  <IconButton
                    sx={{
                      color: "rgba(0, 0, 0, 0.4)",
                      marginTop: "4px",
                      opacity: inputValue.trim() ? 1 : 0,
                      transition: "opacity 0.3s ease-in-out",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                    size="medium"
                    onClick={handleSubmit}
                  >
                    <KeyboardReturn sx={{ fontSize: textFieldFontSizes }} />
                  </IconButton>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat History */}
          <AnimatePresence>
            {showTextField && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <Box sx={{ mt: 2 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "rgba(0, 0, 0, 0.6)",
                        mb: 2,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      Recent conversations
                    </Typography>
                  </motion.div>
                  <Box
                    sx={{
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: -5,
                        right: -5,
                        height: "30px",
                        background:
                          "linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.8) 70%, rgba(255, 255, 255, 1) 100%)",
                        pointerEvents: "none",
                      },
                    }}
                  >
                    <Stack spacing={0.8}>
                      {[
                        "Production line motor replacement",
                        "Conveyor belt parts urgent",
                        "Heavy duty pump specifications",
                        "Emergency hydraulic components",
                        "Maintenance parts inventory",
                        "Critical bearing availability check",
                      ].map((chat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 1.2 + index * 0.1,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                        >
                          <Box
                            sx={{
                              padding: "6px 0",
                              cursor: "pointer",
                              borderRadius: "4px",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.02)",
                                transform: "translateX(2px)",
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.9rem",
                                fontWeight: 200,
                                color: "rgba(0, 0, 0, 0.35)",
                                lineHeight: 1.3,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {chat}
                            </Typography>
                          </Box>
                        </motion.div>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Columna derecha */}
        <Box
          sx={{
            flex: 1,
            height: "100vh",
            overflowY: "auto",
            overflowX: "hidden",
            paddingLeft: "24px",
            paddingRight: 4,
            paddingTop: 4,
            paddingBottom: 4,
            minWidth: 0, // Permite que el contenido se contraiga
          }}
        >
          {submittedMessage && (
            <Box
              key={submittedMessage}
              sx={{
                width: "100%",
                overflow: "visible",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  marginBottom: "1rem",
                }}
              >
                <DustText
                  text={submittedMessage}
                  duration={1}
                  delay={0.04}
                  blur={6}
                  distance={-5}
                  sx={{
                    color: "rgba(0, 0, 0, 0.4)",
                    fontSize: contentFontSizes,
                    fontWeight: "100",
                    lineHeight: 2,
                    fontStyle: "normal",
                    letterSpacing: "normal",
                  }}
                />
              </Box>

              {/* Respuesta */}
              <Box
                sx={{
                  marginTop: 4,
                }}
              >
                {/* New chip system */}
                {groupedElements.map((group, groupIndex) => (
                  <Box key={groupIndex} sx={{ mb: 4 }}>
                    {group.type === "chipRow" && (
                      <Box>
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{
                            minHeight: "40px",
                            justifyContent: "flex-start",
                          }}
                        >
                          {group.chips.map((chip) => (
                            <DynamicChip
                              key={`${chip.label}-${chip.messageIndex}`}
                              icon={chip.icon}
                              label={chip.label}
                              status={chip.status}
                              content={chip.content}
                              onExpand={(chipData) =>
                                handleChipChange(chipData, groupIndex)
                              }
                              isActive={
                                activeChips[groupIndex]?.label === chip.label
                              }
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
                              backgroundColor: "rgba(0, 0, 0, 0.02)",
                              border: "1px solid rgba(0, 0, 0, 0.08)",
                              borderRadius: 2,
                              fontSize: "13px !important",
                              width: "100%",
                              position: "relative",
                              "& *": {
                                fontSize: "13px !important",
                              },
                            }}
                          >
                            {/* Close button */}
                            <IconButton
                              onClick={() => handleChipChange(null, groupIndex)}
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                padding: 0.5,
                                color: "rgba(0, 0, 0, 0.4)",
                                "&:hover": {
                                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                                  color: "rgba(0, 0, 0, 0.6)",
                                },
                              }}
                            >
                              <CloseIcon sx={{ fontSize: "16px" }} />
                            </IconButton>

                            {displayChips[groupIndex] && (
                              <>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: "14px !important",
                                    marginBottom: 1,
                                    paddingRight: 3, // Space for close button
                                  }}
                                >
                                  {displayChips[groupIndex].label}
                                </Typography>
                                {typeof displayChips[groupIndex].content ===
                                "string" ? (
                                  <Typography
                                    sx={{
                                      fontSize: "13px !important",
                                      fontFamily: "monospace",
                                    }}
                                  >
                                    {displayChips[groupIndex].content}
                                  </Typography>
                                ) : displayChips[groupIndex].content
                                    ?.description ? (
                                  <Box>
                                    <Typography
                                      sx={{
                                        fontSize: "13px !important",
                                        marginBottom: 2,
                                        lineHeight: 1.4,
                                      }}
                                    >
                                      {
                                        displayChips[groupIndex].content
                                          .description
                                      }
                                    </Typography>
                                    <JsonView
                                      value={{
                                        function:
                                          displayChips[groupIndex].content
                                            .function,
                                        endpoint:
                                          displayChips[groupIndex].content
                                            .endpoint,
                                        parameters:
                                          displayChips[groupIndex].content
                                            .parameters,
                                      }}
                                      collapsed={1}
                                      style={{
                                        backgroundColor: "transparent",
                                        fontSize: "13px",
                                      }}
                                    />
                                  </Box>
                                ) : (
                                  <Box>
                                    <JsonView
                                      value={displayChips[groupIndex].content}
                                      collapsed={1}
                                      style={{
                                        backgroundColor: "transparent",
                                        fontSize: "13px",
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
                          lineHeight: 1.6, // Cambia aquí el line height
                          "& *": {
                            fontFamily:
                              "var(--font-exo2), sans-serif !important",
                            lineHeight: "inherit !important", // Hereda el line height
                          },
                          "& table": {
                            borderCollapse: "collapse",
                            width: "100%",
                            marginBottom: 2,
                          },
                          "& th, & td": {
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "left",
                          },
                          "& th": {
                            backgroundColor: "#f5f5f5",
                            fontWeight: "bold",
                          },
                        }}
                      >
                        <TypingEffect text={group.content} speed={TYPING_SPEED}>
                          {(displayedText) => (
                            <>
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {displayedText}
                              </ReactMarkdown>
                              <Sources sources={group.sources} />
                            </>
                          )}
                        </TypingEffect>
                      </Box>
                    )}

                    {group.type === "interactive" && (
                      <Box sx={{ mt: 3, mb: 3 }}>
                        {group.interactiveData.inputType === "choice" && (
                          <Stack
                            direction="column"
                            spacing={1.5}
                            alignItems="flex-start"
                          >
                            {group.interactiveData.options.map(
                              (option, optionIndex) => (
                                <Button
                                  key={optionIndex}
                                  variant="outlined"
                                  size="large"
                                  onClick={() =>
                                    handleOptionSelect(option.label)
                                  }
                                  sx={{
                                    textAlign: "left",
                                    justifyContent: "flex-start",
                                    padding: "12px 20px",
                                    fontSize: "1.1rem",
                                    fontWeight: 400,
                                    textTransform: "none",
                                    border: "1px solid rgba(0, 0, 0, 0.2)",
                                    color: "rgba(0, 0, 0, 0.8)",
                                    backgroundColor: "white",
                                    borderRadius: "18px 18px 18px 4px",
                                    transition: "all 0.2s ease-in-out",
                                    width: "fit-content",
                                    "&:hover": {
                                      backgroundColor: "#f8f8f8",
                                      transform: "translateX(4px) scale(1.02)",
                                      borderColor: "rgba(0, 0, 0, 0.3)",
                                      fontWeight: 600,
                                    },
                                    "& .MuiButton-endIcon": {
                                      color: "rgba(0, 0, 0, 0.6)",
                                    },
                                    "& .MuiButton-startIcon": {
                                      color: "rgba(0, 0, 0, 0.6)",
                                    },
                                  }}
                                  startIcon={React.createElement(
                                    getIconByType(option.type),
                                    { size: 14 }
                                  )}
                                  endIcon={<ArrowRight size={16} />}
                                >
                                  {option.label}
                                </Button>
                              )
                            )}
                          </Stack>
                        )}
                      </Box>
                    )}

                    {group.type === "progress_tracker" && (
                      <ProgressTracker data={group.progressData} />
                    )}

                    {group.type === "comparison_table" && (
                      <ComparisonTable data={group.comparisonData} />
                    )}

                    {group.type === "process_diagram" && (
                      <ProcessDiagram data={group.processData} />
                    )}

                    {group.type === "supplier_card" && (
                      <SupplierCard data={group.supplierData} />
                    )}
                  </Box>
                ))}

                {/* Show initial loading only if no states yet */}
                {isLoading && agentStates.length === 0 && (
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "inherit",
                      fontWeight: "inherit",
                      opacity: 0.7,
                    }}
                  >
                    Thinking...
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
