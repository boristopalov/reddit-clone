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
import { useGetPostsQuery } from "../generated/graphql";
import { withApollo } from "../withApollo";
import UpvoteSection from "../components/UpvoteSection";

const Index = (): JSX.Element => {
  const { data, loading, fetchMore, variables } = useGetPostsQuery({
    variables: {
      limit: 20,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  const fetchMorePosts = () => {
    fetchMore({
      variables: {
        limit: variables?.limit,
        cursor: data?.posts.posts[data.posts.posts.length - 1].createdAt,
      },
    });
  };

  if (loading && !data) return <Spinner />;

  if (!loading && !data) {
    return <div> Query Failed </div>;
  }

  return (
    <>
      <Nav />
      <Wrapper>
        <Stack spacing={8}>
          {data!.posts.posts.map((post) => (
            <Flex p={5} shadow="md" borderWidth="1px" key={post.id}>
              <UpvoteSection post={post} />
              <Box>
                <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                  <Link>
                    <Heading fontSize="2xl">{post.title}</Heading>
                  </Link>
                </NextLink>
                <Text fontSize="md" fontStyle="italic">
                  Posted by {post.creator.username}
                </Text>
                <Text mt={4} fontSize="sm">
                  {post.textSnippet}
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>
        {data?.posts.hasMore ? (
          <Button
            my={10}
            colorScheme="blue"
            size="lg"
            isLoading={loading}
            onClick={fetchMorePosts}
          >
            More Posts
          </Button>
        ) : (
          <Flex justifyContent="center">
            <Box mt={8} pb={8}>
              {" "}
              No more posts!
            </Box>
          </Flex>
        )}
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: true })(Index);
