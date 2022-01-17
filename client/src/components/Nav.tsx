import {
  Box,
  Link,
  Flex,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Spinner,
  Button,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface Props {}

const Nav: React.FC<Props> = () => {
  const { data, loading, error } = useMeQuery({ ssr: isServer() });
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  let body = null;

  if (loading)
    return (
      <Flex background="grey" mt={"4"}>
        <Box ml="auto" mr="auto">
          <Spinner />
        </Box>
      </Flex>
    );

  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Invalid Query!</AlertTitle>
        <AlertDescription>
          The query provided did not retreieve any data. Please provide a valid
          query.
        </AlertDescription>
        <CloseButton position="absolute" right="8px" top="8px" />
      </Alert>
    );
  if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    console.log(data.me.id);
    body = (
      <>
        {data.me.username}
        <Button
          variant="link"
          ml={2}
          onClick={() => {
            logout({
              update: (cache, {}) => {
                cache.evict({ id: `User:${data.me?.id}` });
                cache.gc();
              },
            });
          }}
          isLoading={logoutLoading}
        >
          Logout
        </Button>
      </>
    );
  }

  return (
    <Flex background="gray" position="sticky" zIndex={1} top={0} padding={4}>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};

export default Nav;
