import { Box } from "@chakra-ui/react";
import React from "react";

interface Props {
  variant?: "small" | "med";
}

const Wrapper: React.FC<Props> = ({ children, variant = "med" }) => {
  return (
    <Box
      maxW={variant === "med" ? "920px" : "400px"}
      w="100%"
      h="100%"
      mt={10}
      mx="auto"
    >
      {children}
    </Box>
  );
};

export default Wrapper;
