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
import { useGetPostsQuery, useMeQuery } from "../generated/graphql";
import { withApollo } from "../withApollo";
import UpvoteSection from "../components/UpvoteSection";
import EditDeletePostButtons from "../components/EditDeletePostButtons";

const Index = (): JSX.Element => {
  const { data, loading, fetchMore, variables, error } = useGetPostsQuery({
    variables: {
      limit: 20,
      cursor: null,
      subreddit: null,
    },
    notifyOnNetworkStatusChange: true,
  });
  const { data: meData } = useMeQuery();
  const currentUser = meData?.me?.id || null;

  const fetchMorePosts = () => {
    fetchMore({
      variables: {
        limit: variables?.limit,
        cursor: data?.posts.posts[data.posts.posts.length - 1].createdAt,
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
              <UpvoteSection post={post} currentUser={currentUser} />
              <Box flex={1}>
                <NextLink
                  href="/r/[subreddit]/post/[id]"
                  as={`/r/${post.subreddit}/post/${post.id}`}
                >
                  <Link>
                    <Heading fontSize="2xl">{post.title}</Heading>
                  </Link>
                </NextLink>

                <NextLink href="/r/[subreddit]" as={`/r/${post.subreddit}`}>
                  <Link>r/{post.subreddit}</Link>
                </NextLink>
                <Text fontSize="md" fontStyle="italic">
                  Posted by {post.creator.username}
                </Text>
                <Text fontSize="md" fontStyle="italic"></Text>
                <Flex>
                  <Text flex={1} mt={4} fontSize="sm">
                    {post.textSnippet}
                  </Text>
                  <EditDeletePostButtons
                    postId={post.id}
                    creatorId={post.creator.id}
                    subreddit={post.subreddit}
                    currentUser={currentUser}
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

export default withApollo({ ssr: true })(Index);
