import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import EditDeletePostButtons from "../../components/EditDeletePostButtons";
import Nav from "../../components/Nav";
import Wrapper from "../../components/Wrapper";
import { useGetPostQuery } from "../../generated/graphql";
import { withApollo } from "../../withApollo";

const Post = (): JSX.Element => {
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

  if (!data?.post) {
    return <> </>;
  }

  return (
    <>
      <Nav />
      <Wrapper>
        <Flex
          direction="column"
          borderWidth="1px"
          borderColor="gray.200"
          padding={5}
          boxShadow="md"
        >
          <Heading>{data?.post?.title}</Heading>
          <Box fontStyle="italic" mb={4}>
            {data?.post?.creator.username}
          </Box>
          <Flex fontSize="lg">
            <Text flex={1} mt={4} fontSize="lg">
              {data?.post?.text}
            </Text>
            <EditDeletePostButtons
              postId={postId}
              creatorId={data.post.creatorId}
            />
          </Flex>
        </Flex>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(Post);
