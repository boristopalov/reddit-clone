import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Comment from "../../../../components/Comment";
import EditDeletePostButtons from "../../../../components/EditDeletePostButtons";
import Nav from "../../../../components/Nav";
import UpvoteSection from "../../../../components/UpvoteSection";
import Wrapper from "../../../../components/Wrapper";
import {
  useCommentMutation,
  useGetCommentsQuery,
  useGetPostQuery,
  useMeQuery,
} from "../../../../generated/graphql";
import { withApollo } from "../../../../withApollo";

const Post = (): JSX.Element => {
  const [commentValue, setCommentValue] = useState("");
  const router = useRouter();
  const postId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [addComment, { loading: commentLoading }] = useCommentMutation({
    refetchQueries: ["getComments"],
  });

  const { data: meData } = useMeQuery();
  const currentUser = meData?.me?.id || null;

  const { data, loading } = useGetPostQuery({
    // don't run the query if we have an invalid id url parameter
    skip: postId === -1,
    variables: { id: postId },
  });

  const { data: commentsData, loading: commentsLoading } = useGetCommentsQuery({
    skip: postId === -1,
    variables: { postId },
    notifyOnNetworkStatusChange: true,
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
          direction="row"
          borderWidth="1px"
          borderColor="gray.200"
          padding={5}
          boxShadow="md"
          marginBottom={"2em"}
        >
          <UpvoteSection post={data.post as any} currentUser={currentUser} />
          <Box width={"100%"}>
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
                subreddit={data.post.subreddit}
                currentUser={currentUser}
              />
            </Flex>
          </Box>
        </Flex>
        <Heading as="h3" size="md" margin={"0.5em 0"}>
          Comments
        </Heading>
        <Flex
          direction={"column"}
          width={"50%"}
          display={currentUser ? "block" : "none"}
        >
          <Textarea
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            backgroundColor={"white"}
            width={"100%"}
          ></Textarea>
          <Button
            colorScheme="blue"
            width={"35%"}
            marginTop={3}
            isLoading={commentLoading}
            onClick={async () => {
              await addComment({
                variables: {
                  postId: postId,
                  text: commentValue,
                },
              });
              setCommentValue("");
            }}
          >
            Add comment
          </Button>
        </Flex>
        {commentsLoading && <Spinner />}
        <Box margin={"0.5em 0"}>
          {commentsData?.comments?.map((c, i) => {
            console.log(c);
            const bgColor = i % 2 == 0 ? "gray.100" : "white";
            return (
              <Comment
                comment={c}
                bgColor={bgColor}
                key={c.id}
                currentUser={currentUser}
              />
            );
          })}
        </Box>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(Post) as any;
