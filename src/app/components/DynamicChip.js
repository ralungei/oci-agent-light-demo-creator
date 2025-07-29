"use client";

import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { CircularProgress, Typography, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DynamicChip({
  icon: Icon,
  label,
  status = "success",
  content,
  onExpand,
  isActive,
  startDelay = 0,
}) {
  const theme = useTheme();
  const [stage, setStage] = useState("hidden");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case "error":
        return theme.palette.error?.main || "#f44336";
      case "warning":
        return theme.palette.warning?.main || "#ff9800";
      case "info":
        return theme.palette.info?.main || "#2196f3";
      case "success":
      default:
        return theme.palette.success?.main || theme.palette.secondary.main;
    }
  };

  const statusColor = getStatusColor();

  useEffect(() => {
    // Start with circle appearing
    setTimeout(() => setStage("circle"), startDelay + 300);
    // Extend to show text after 1 second
    setTimeout(() => setStage("extended"), startDelay + 800);
    // Complete after 3 seconds
    setTimeout(() => setIsCompleted(true), startDelay + 2000);
    // Collapse back to circle after 5 seconds
    setTimeout(() => setStage("circle"), startDelay + 2500);
  }, [startDelay]);

  const handleClick = () => {
    if (stage !== "hidden") {
      // If this chip is already active, collapse the content
      if (isActive) {
        onExpand(null);
      } else {
        onExpand({ label, status, content });
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {stage !== "hidden" && (
        <motion.div
          layoutId={`chip-${label}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            width:
              stage === "extended" || (stage === "circle" && isHovered)
                ? "160px"
                : "40px",
          }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
          transition={{
            scale: { type: "spring", damping: 20, stiffness: 300 },
            opacity: { duration: 0.3 },
            width: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
          }}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            height: "40px",
            backgroundColor: isActive ? `${statusColor}15` : "transparent",
            border: `1px solid ${isCompleted ? statusColor : "#999"}`,
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent:
              stage === "extended" || (stage === "circle" && isHovered)
                ? "flex-start"
                : "center",
            paddingLeft:
              stage === "extended" || (stage === "circle" && isHovered)
                ? "12px"
                : "0",
            paddingRight:
              stage === "extended" || (stage === "circle" && isHovered)
                ? "16px"
                : "0",
            overflow: "hidden",
            position: "relative",
            cursor: "pointer",
            transition: "border-color 0.3s ease, background-color 0.3s ease",
          }}
        >
          {/* Icon */}
          <AnimatePresence mode="wait">
            {!isCompleted ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress
                  size={16}
                  sx={{ color: "#666", display: "block" }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={16} color={statusColor} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text */}
          <AnimatePresence>
            {(stage === "extended" || (stage === "circle" && isHovered)) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{
                  marginLeft: "8px",
                  whiteSpace: "nowrap",
                }}
              >
                <Typography
                  sx={{
                    color: isCompleted ? statusColor : "#000",
                    fontSize: "16px",
                    fontWeight: isActive ? 500 : 300,
                    transition: "color 0.3s ease, font-weight 0.3s ease",
                  }}
                >
                  {label}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chevron icon */}
          {stage === "extended" && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: isActive ? 180 : 0,
              }}
              transition={{
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
                rotate: { duration: 0.3 },
              }}
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "auto",
                marginRight: "4px",
              }}
            >
              <ExpandMoreIcon
                sx={{
                  fontSize: "18px",
                  color: isCompleted ? statusColor : "#666",
                  transition: "color 0.3s ease",
                }}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
