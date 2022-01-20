import { withApollo } from "next-apollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { PaginatedPosts, Post } from "./generated/graphql";

const apolloClient = new ApolloClient({
  uri: "http://localhost:8080/graphql",
  credentials: "include",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            // any arguments (for the posts query in this case) that would result in an entirely different result being return
            // so here it would result in a different array of Posts, but since we don't want a new array based off
            // limit or cursor, we just set it to false
            keyArgs: false,
            merge(
              existing: PaginatedPosts | undefined,
              incoming: PaginatedPosts
            ): PaginatedPosts {
              return {
                ...incoming,
                posts: [...(existing?.posts || []), ...incoming.posts],
              };
            },
          },
        },
      },
    },
  }),
});

export default withApollo(apolloClient);
