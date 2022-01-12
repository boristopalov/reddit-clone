import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../apollo-client";

import theme from "../theme";

function MyApp({ Component, pageProps }: any) {
  const client = useApollo(pageProps);
  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
