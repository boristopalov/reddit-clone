import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import Nav from "../components/Nav";
import NextLink from "next/link";
import Wrapper from "../components/Wrapper";
import { GetPostsQuery, useGetPostsQuery } from "../generated/graphql";
import withApollo from "../withApollo";

const Index = (): JSX.Element => {
  // console.log(initialApolloState);
  const { data, loading, fetchMore, variables } = useGetPostsQuery({
    variables: {
      limit: 20,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (loading && !data) return <Spinner />;

  if (!loading && !data) {
    return <div> Query Failed </div>;
  }

  const fetchMorePosts = () => {
    fetchMore({
      variables: {
        limit: variables?.limit,
        cursor: data?.posts.posts[data.posts.posts.length - 1].createdAt,
      },
    });
  };

  return (
    <>
      <Nav />
      <Wrapper>
        <Flex align="center" justifyContent="space-between" mb={8}>
          <Heading> Raddit </Heading>
          <NextLink href="/create-post">
            <Link>Create Post</Link>
          </NextLink>
        </Flex>
        <Stack spacing={8}>
          {data!.posts.posts.map((post) => (
            <Box p={5} shadow="md" borderWidth="1px" key={post.id}>
              <Heading fontSize="xl">{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
        <Button
          my={10}
          colorScheme="blue"
          size="lg"
          isLoading={loading}
          onClick={fetchMorePosts}
        >
          More Posts
        </Button>
      </Wrapper>
    </>
  );
};

// export async function getServerSideProps() {
//   const client = initializeApollo();
//   const { data: ssrData } = await client.query({
//     query: GetPostsDocument,
//     variables: {
//       limit: 10,
//     },
//   });

//   return {
//     props: {
//       initialApolloState: client.cache.extract(),
//       ssrData,
//     },
//   };
// }

export default withApollo({ ssr: true })(Index);
