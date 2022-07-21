import React, { useState } from "react";
import {
  CommentFragment,
  VoteOnCommentMutation,
  useVoteOnCommentMutation,
} from "../generated/graphql";
import { ApolloCache, gql } from "@apollo/client";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";

interface Props {
  comment: CommentFragment;
  currentUser: number | null;
}

const updateAfterVote = (
  cache: ApolloCache<VoteOnCommentMutation>,
  value: number,
  commentId: number
) => {
  const res: CommentFragment | null = cache.readFragment({
    id: "Comment:" + commentId,
    fragment: gql`
      fragment getCommentScore on Comment {
        id
        score
        voteStatus
      }
    `,
  });

  if (res) {
    if (res.voteStatus === value) {
      return;
    }
    console.log("writing to cache ");
    const newScore = res.score + (res.voteStatus ? 2 : 1) * value;
    cache.writeFragment({
      id: "Comment:" + commentId,
      data: {
        score: newScore,
        voteStatus: value,
      },
      fragment: gql`
        fragment updateCommentScore on Comment {
          score
          voteStatus
        }
      `,
    });
  }
};

const CommentUpvoteSection = ({ comment, currentUser }: Props): JSX.Element => {
  const [commentScore, setCommentScore] = useState(comment.score);
  console.log("votes  status for comment", comment.id, comment.voteStatus);
  const [voteOnComment] = useVoteOnCommentMutation();

  if (!currentUser) {
    return <></>;
  }

  return (
    <Flex
      direction="column"
      textAlign="center"
      justifyContent="space-evenly"
      paddingRight={4}
    >
      <IconButton
        onClick={async () => {
          if (comment.voteStatus === 1) {
            return;
          }
          setCommentScore(commentScore + 1);
          await voteOnComment({
            variables: {
              value: 1,
              commentId: comment.id,
            },
            update: (cache) => updateAfterVote(cache, 1, comment.id),
          });
        }}
        colorScheme={comment.voteStatus === 1 ? "green" : "blackAlpha"}
        aria-label="upvote comment"
        icon={<ChevronUpIcon w={3} h={3} />}
        height={"16px"}
        width={"16px"}
        marginBottom={"0.5em"}
      />
      <IconButton
        onClick={async () => {
          if (comment.voteStatus === -1) {
            return;
          }
          setCommentScore(commentScore - 1);
          await voteOnComment({
            variables: {
              value: -1,
              commentId: comment.id,
            },
            update: (cache) => updateAfterVote(cache, -1, comment.id),
          });
        }}
        colorScheme={comment.voteStatus === -1 ? "red" : "blackAlpha"}
        aria-label="downvote comment"
        icon={<ChevronDownIcon w={3} h={3} />}
        height={"16px"}
        width={"16px"}
      />
    </Flex>
  );
};

export default CommentUpvoteSection;
