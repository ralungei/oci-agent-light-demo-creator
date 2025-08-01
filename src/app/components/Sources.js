import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function Sources({ sources, delay = 0 }) {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: delay,
        ease: "easeOut" 
      }}
    >
      <Box 
        sx={{ 
          mb: 2, 
          pb: 2, 
          borderBottom: "1px solid #e0e0e0",
          textAlign: "left"
        }}
      >
      <Typography 
        variant="subtitle2" 
        sx={{ 
          mb: 1, 
          fontWeight: "bold", 
          color: "#666" 
        }}
      >
        Sources:
      </Typography>
      <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
        {sources.map((source, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <FileText size={14} color="#666" />
            <Typography 
              variant="body2" 
              sx={{ fontSize: "0.9rem" }}
            >
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: "#1976d2", textDecoration: "none" }}
              >
                {source.name}
              </a> (p. {source.pages.join(", ")})
            </Typography>
          </Box>
        ))}
      </Stack>
      </Box>
    </motion.div>
  );
}