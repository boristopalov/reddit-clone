import { withApollo } from "next-apollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "http://localhost:8080/graphql",
  credentials: "include",
  cache: new InMemoryCache(),
});

export default withApollo(apolloClient);
