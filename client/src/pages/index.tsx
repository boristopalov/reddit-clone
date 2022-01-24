import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
  IconButton,
} from "@chakra-ui/react";
import Nav from "../components/Nav";
import NextLink from "next/link";
import Wrapper from "../components/Wrapper";
import {
  useDeletePostMutation,
  useGetPostsQuery,
  useMeQuery,
} from "../generated/graphql";
import { withApollo } from "../withApollo";
import UpvoteSection from "../components/UpvoteSection";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

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

  const [deletePost, { error: deleteError }] = useDeletePostMutation();

  const { data: meData } = useMeQuery();

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
                  {meData?.me?.id !== post.creator.id ? null : (
                    <Box>
                      <NextLink
                        href="/post/edit/[id]"
                        as={`/post/edit/${post.id}`}
                      >
                        <IconButton
                          aria-label="Edit Post"
                          icon={<EditIcon />}
                          colorScheme="blackAlpha"
                          mr={2}
                        />
                      </NextLink>
                      <IconButton
                        aria-label="Delete Post"
                        icon={<DeleteIcon />}
                        colorScheme="blackAlpha"
                        onClick={async () => {
                          await deletePost({
                            variables: {
                              id: post.id,
                            },
                            update: (cache) => {
                              cache.evict({ id: "Post:" + post.id });
                            },
                          });
                        }}
                      />
                    </Box>
                  )}
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
