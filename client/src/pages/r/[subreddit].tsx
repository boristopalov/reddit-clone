import {
  Spinner,
  Stack,
  Flex,
  Box,
  Heading,
  Button,
  Link,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import EditDeletePostButtons from "../../components/EditDeletePostButtons";
import Nav from "../../components/Nav";
import UpvoteSection from "../../components/UpvoteSection";
import Wrapper from "../../components/Wrapper";
import { useGetPostsQuery } from "../../generated/graphql";
import { withApollo } from "../../withApollo";

const Subreddit: NextPage = () => {
  const router = useRouter();
  const subreddit =
    typeof router.query.subreddit === "string" ? router.query.subreddit : null;

  const { data, loading, fetchMore, variables, error } = useGetPostsQuery({
    variables: {
      limit: 20,
      cursor: null,
      subreddit: subreddit,
    },
    notifyOnNetworkStatusChange: true,
  });
  const fetchMorePosts = () => {
    fetchMore({
      variables: {
        limit: variables?.limit,
        cursor: data?.posts.posts[data.posts.posts.length - 1].createdAt,
        subreddit: subreddit,
      },
    });
  };

  if (loading && !data) return <Spinner />;

  if (error) {
    return <div> {error.message} </div>;
  }

  return (
    <>
      <Nav />
      <Wrapper>
        <Stack spacing={8}>
          {data!.posts.posts.map((post) => (
            <Flex p={5} shadow="md" borderWidth="1px" key={post.id}>
              <UpvoteSection post={post} />
              <Box flex={1}>
                <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                  <Link>
                    <Heading fontSize="2xl">{post.title}</Heading>
                  </Link>
                </NextLink>
                <Text fontSize="md" fontStyle="italic">
                  Posted by {post.creator.username}
                </Text>
                <Flex>
                  <Text flex={1} mt={4} fontSize="sm">
                    {post.textSnippet}
                  </Text>
                  <EditDeletePostButtons
                    postId={post.id}
                    creatorId={post.creator.id}
                  />
                </Flex>
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
              No more posts!
            </Box>
          </Flex>
        )}
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: true })(Subreddit);
