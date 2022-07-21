import { ApolloClient, InMemoryCache } from "@apollo/client";
import { PaginatedPosts } from "./generated/graphql";
import { NextPageContext } from "next";
import { createWithApollo } from "./createWithApollo";

const createApolloClient = (ctx: NextPageContext | undefined) =>
  new ApolloClient({
    uri: "http://localhost:8080/graphql",
    credentials: "include",
    headers: {
      cookie:
        (typeof window === "undefined"
          ? ctx?.req?.headers.cookie
          : undefined) || "",
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              // any arguments (for the posts query in this case) that would result in an entirely different result being return
              // so here it would result in a different array of Posts, but since we don't want a new array based off
              // limit or cursor, we just set it to false
              keyArgs: ["subreddit"],
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

export const withApollo = createWithApollo(createApolloClient);
