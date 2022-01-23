import { Box, Flex, Heading, Link, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import Nav from "../../components/Nav";
import Wrapper from "../../components/Wrapper";
import { useGetPostQuery } from "../../generated/graphql";
import { withApollo } from "../../withApollo";

interface Props {}

const Post = (props: Props): JSX.Element => {
  const router = useRouter();
  const postId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const { data, loading } = useGetPostQuery({
    // don't run the query if we have an invalid id url parameter
    skip: postId === -1,
    variables: { id: postId },
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Nav />
      <Wrapper>
        <Flex
          direction="column"
          borderRadius="lg"
          borderWidth="2px"
          borderColor="blackAlpha.400"
          padding={4}
        >
          <Heading mb={6}>{data?.post?.title}</Heading>
          <Box>{data?.post?.text}</Box>
          <Box>{data?.post?.creator.username}</Box>
          <Box>{data?.post?.score}</Box>
        </Flex>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(Post);
