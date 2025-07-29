import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BlinkingEye({
  isActive = false,
  blinkIntervals = [6000, 15000, 20000, 8000, 25000, 12000, 30000, 18000],
  lookDirection = "center",
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState(0);

  const getPupilPosition = () => {
    switch (lookDirection) {
      case "up":
        return { x: 60, y: 32 };
      case "down":
        return { x: 60, y: 45 };
      case "left":
        return { x: 52, y: 40 };
      case "right":
        return { x: 68, y: 40 };
      default:
        return { x: 60, y: 40 };
    }
  };

  const getIrisTransform = () => {
    switch (lookDirection) {
      case "down":
        return "scale(1, 0.92)"; // Compress vertically when looking down
      case "up":
        return "scale(1, 0.96)"; // Slight compression when looking up
      default:
        return "scale(1, 1)";
    }
  };

  const getReflectionPosition = () => {
    const pupil = getPupilPosition();
    switch (lookDirection) {
      case "down":
        return { x: pupil.x + 3, y: pupil.y - 6 }; // Move reflection up when looking down
      case "up":
        return { x: pupil.x + 4, y: pupil.y - 2 }; // Move reflection down when looking up
      default:
        return { x: pupil.x + 4, y: pupil.y - 4 };
    }
  };

  const getReflectionOpacity = () => {
    switch (lookDirection) {
      case "down":
        return 0.6; // Less strong when looking down
      case "up":
        return 0.9; // Stronger when looking up
      default:
        return 0.8;
    }
  };

  useEffect(() => {
    if (!isActive) {
      let timeoutId;

      const scheduleNextBlink = () => {
        const currentInterval = blinkIntervals[currentIntervalIndex];
        timeoutId = setTimeout(() => {
          setIsOpen(false);
          setTimeout(() => {
            setIsOpen(true);
            setCurrentIntervalIndex(
              (prev) => (prev + 1) % blinkIntervals.length
            );
            scheduleNextBlink();
          }, 150);
        }, currentInterval);
      };

      scheduleNextBlink();

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [blinkIntervals, currentIntervalIndex, isActive]);

  useEffect(() => {
    if (isActive) {
      setIsOpen(true);
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(progressInterval);
    } else {
      setLoadingProgress(0);
    }
  }, [isActive]);

  const pupilPos = getPupilPosition();
  const reflectionPos = getReflectionPosition();
  const irisTransform = getIrisTransform();
  const reflectionOpacity = getReflectionOpacity();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <svg
          width="120"
          height="80"
          viewBox="0 0 120 80"
          style={{ transition: "all 150ms ease-in-out" }}
        >
          <motion.path
            d={
              isOpen
                ? "M 15 40 Q 30 20, 60 20 T 105 40 Q 90 60, 60 60 T 15 40"
                : "M 15 40 Q 30 40, 60 40 T 105 40 Q 90 40, 60 40 T 15 40"
            }
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{
              d: isOpen
                ? "M 15 40 Q 30 20, 60 20 T 105 40 Q 90 60, 60 60 T 15 40"
                : "M 15 40 Q 30 40, 60 40 T 105 40 Q 90 40, 60 40 T 15 40",
            }}
            transition={{
              duration: 0.15,
              ease: "easeInOut",
              delay: isOpen ? 0.05 : 0,
            }}
          />

          <AnimatePresence>
            {isOpen && (
              <>
                {isActive ? (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.05 }}
                  >
                    <circle
                      cx="60"
                      cy="40"
                      r="18"
                      fill="none"
                      stroke="#1a1a1a"
                      strokeWidth="2.5"
                    />

                    <motion.circle
                      cx={pupilPos.x}
                      cy={pupilPos.y}
                      r="10"
                      fill="#2196f3"
                      animate={{ 
                        cx: 60, 
                        cy: 40,
                        r: [10, 11, 9, 10]
                      }}
                      transition={{
                        cx: { type: "spring", stiffness: 200, damping: 25, duration: 0.8 },
                        cy: { type: "spring", stiffness: 200, damping: 25, duration: 0.8 },
                        r: { duration: 2.5, ease: "easeInOut", repeat: Infinity }
                      }}
                    />

                    <motion.circle
                      cx={reflectionPos.x}
                      cy={reflectionPos.y}
                      r="2.5"
                      fill="#fff"
                      animate={{ 
                        cx: 64,
                        cy: 36,
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{ 
                        cx: { type: "spring", stiffness: 200, damping: 25, duration: 0.8 },
                        cy: { type: "spring", stiffness: 200, damping: 25, duration: 0.8 },
                        opacity: { duration: 1.5, ease: "easeInOut", repeat: Infinity }
                      }}
                    />
                  </motion.g>
                ) : (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <circle
                      cx="60"
                      cy="40"
                      r="18"
                      fill="none"
                      stroke="#1a1a1a"
                      strokeWidth="2.5"
                    />

                    <g transform={`translate(${pupilPos.x}, ${pupilPos.y}) ${irisTransform} translate(-${pupilPos.x}, -${pupilPos.y})`}>
                      <motion.circle
                        cx={pupilPos.x}
                        cy={pupilPos.y}
                        r="10"
                        fill="#1a1a1a"
                        animate={{ cx: pupilPos.x, cy: pupilPos.y }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    </g>

                    <motion.circle
                      cx={reflectionPos.x}
                      cy={reflectionPos.y}
                      r="2.5"
                      fill="#fff"
                      opacity={reflectionOpacity}
                      animate={{ 
                        cx: reflectionPos.x, 
                        cy: reflectionPos.y,
                        opacity: reflectionOpacity
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  </motion.g>
                )}
              </>
            )}
          </AnimatePresence>
        </svg>
      </Box>
    </Box>
  );
}
