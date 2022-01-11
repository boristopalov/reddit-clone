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
import { useMeQuery } from "../generated/graphql";

interface Props {}

const Nav: React.FC<Props> = () => {
  const { data, loading, error } = useMeQuery();
  let body = null;

  if (loading) return <Spinner />;

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
    body = (
      <>
        {data.me.username}
        <Button variant="link" ml={2}>
          Logout
        </Button>
      </>
    );
  }

  return (
    <Flex background="gray" padding={4}>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};

export default Nav;
