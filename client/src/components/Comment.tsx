import { gql } from "@apollo/client";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  CommentFragment,
  useCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
  useMeQuery,
} from "../generated/graphql";
import CommentUpvoteSection from "./CommentUpvoteSection";

interface timeAgoInfo {
  length: number;
  units: string;
}

interface Props {
  comment: CommentFragment & {
    children?: CommentFragment[] | null | undefined;
  };
  bgColor: "gray.100" | "white";
  currentUser: number | null;
}

const Comment = ({ comment, bgColor, currentUser }: Props): JSX.Element => {
  const [deleteComment] = useDeleteCommentMutation({
    refetchQueries: ["getComments"],
  });
  const [editComment] = useEditCommentMutation({
    refetchQueries: ["getComments"],
  });
  const [postComment] = useCommentMutation({
    refetchQueries: ["getComments"],
  });
  const [commentInEdit, setCommentInEdit] = useState(false);
  const [replyTo, setReplyTo] = useState(false);
  const [replyValue, setReplyValue] = useState("");
  const [editedValue, setEditedValue] = useState(comment.text);

  const timeAgo = (stringDate: string): timeAgoInfo => {
    const date = Date.parse(stringDate);
    const now = new Date();
    const msPassed = now.getTime() - date;
    const oneHour = 3600000;
    const oneDay = 86400000;
    const oneMonth = 2629800000;
    if (msPassed < oneHour) {
      return {
        length: Math.max(0, Math.floor(msPassed / 60000)),
        units: "minutes",
      };
    } else if (msPassed < oneDay) {
      return {
        length: Math.floor(msPassed / 3600000),
        units: "hours",
      };
    } else if (msPassed < oneMonth) {
      return {
        length: Math.floor(msPassed / 86400000),
        units: "days",
      };
    } else
      return {
        length: Math.floor(msPassed / 2629800000),
        units: "months",
      };
  };
  const time = timeAgo(comment.updatedAt);

  //https://coderrocketfuel.com/article/recursion-in-react-render-comments-with-nested-children
  const nestedComments = comment.children?.map((comment) => {
    const nestedColor = bgColor === "gray.100" ? "white" : "gray.100";
    return (
      <Comment
        key={comment.id}
        comment={comment}
        bgColor={nestedColor}
        currentUser={currentUser}
      />
    );
  });
  return (
    <Box backgroundColor={bgColor} paddingLeft={"1em"} paddingBottom={"0.5em"}>
      <Flex>
        <CommentUpvoteSection comment={comment} currentUser={currentUser} />
        <Box>
          <HStack spacing="10px">
            <b>{comment.deleted ? "[deleted]" : comment.user.username}</b>
            <Box>{comment.score} points</Box>
            <Box>
              <i>
                {time.length} {time.units} ago
              </i>
            </Box>
            {currentUser === comment.userId && !comment.deleted && (
              <Button
                variant={"link"}
                color={"black"}
                onClick={() => {
                  setCommentInEdit(!commentInEdit);
                }}
              >
                edit
              </Button>
            )}
            {!comment.deleted && currentUser && (
              <Button
                variant={"link"}
                color={"black"}
                onClick={() => {
                  setReplyTo(!replyTo);
                }}
              >
                reply
              </Button>
            )}
            {currentUser === comment.userId && !comment.deleted && (
              <Box>
                <Button
                  aria-label="Delete Comment"
                  variant={"link"}
                  color={"black"}
                  onClick={async () => {
                    await deleteComment({
                      variables: {
                        id: comment.id,
                      },
                      update: (cache) => {
                        cache.evict({ id: "Comment:" + comment.id });
                      },
                    });
                  }}
                >
                  delete
                </Button>
              </Box>
            )}
          </HStack>
          <Box paddingBottom={"1em"}>{comment.text}</Box>
        </Box>
      </Flex>
      {commentInEdit && (
        <Flex direction={"column"}>
          <Textarea
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            backgroundColor={"white"}
            width={"50%"}
          ></Textarea>
          <Button
            colorScheme="blue"
            marginTop={"1em"}
            marginBottom={"1em"}
            size={"sm"}
            width={"20%"}
            onClick={async () => {
              await editComment({
                variables: {
                  id: comment.id,
                  newText: editedValue,
                },
                update: (cache) => {
                  cache.evict({ id: "Comment:" + comment.id });
                },
              });
              setCommentInEdit(false);
            }}
          >
            Confirm Edit
          </Button>
        </Flex>
      )}
      <Box display={replyTo ? "block" : "none"}>
        <Textarea
          value={replyValue}
          onChange={(e) => setReplyValue(e.target.value)}
          backgroundColor={"white"}
        ></Textarea>
        <Button
          colorScheme="blue"
          marginTop={"1em"}
          marginBottom={"1em"}
          size={"sm"}
          onClick={async () => {
            await postComment({
              variables: {
                text: replyValue,
                parentId: comment.id,
                postId: comment.postId,
              },
            });
            setReplyTo(false);
          }}
        >
          Post Reply
        </Button>
      </Box>

      {nestedComments}
    </Box>
  );
};

export default Comment;
