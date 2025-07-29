export const getErrorMessage = (error) => {
  const defaultMessage = "Lo siento, hubo un problema al conectar con el agente.";
  
  if (!error?.message) {
    return defaultMessage;
  }
  
  // Map specific error patterns to user-friendly messages
  const errorPatterns = [
    {
      pattern: /Read timed out|timed out/i,
      message: "La conexión tardó demasiado tiempo. Por favor, intenta de nuevo."
    },
    {
      pattern: /SSE processing failed/i,
      message: "Hubo un problema al procesar la respuesta. Por favor, intenta de nuevo."
    },
    {
      pattern: /Connection reset|Connection aborted/i,
      message: "Se perdió la conexión con el servidor. Por favor, intenta de nuevo."
    },
    {
      pattern: /Network error/i,
      message: "Error de red. Por favor, verifica tu conexión a internet."
    }
  ];
  
  // Find matching pattern
  const match = errorPatterns.find(({ pattern }) => pattern.test(error.message));
  
  if (match) {
    return match.message;
  }
  
  // Return the original error message if no pattern matches
  return `Error: ${error.message}`;
};