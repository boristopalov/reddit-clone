import { ApolloCache, gql } from "@apollo/client";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";

interface Props {
  post: PostSnippetFragment;
  currentUser: number | null;
}

const updateAfterVote = (
  cache: ApolloCache<VoteMutation>,
  value: number,
  postId: number
) => {
  const res: PostSnippetFragment | null = cache.readFragment({
    id: "Post:" + postId,
    fragment: gql`
      fragment getScore on Post {
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
    const newScore = res.score + (res.voteStatus ? 2 : 1) * value;
    cache.writeFragment({
      id: "Post:" + postId,
      data: {
        score: newScore,
        voteStatus: value,
      },
      fragment: gql`
        fragment updateScore on Post {
          score
          voteStatus
        }
      `,
    });
  }
};

const UpvoteSection = ({ post, currentUser }: Props): JSX.Element => {
  const [postScore, setPostScore] = useState(post.score);
  const [vote] = useVoteMutation();

  if (!currentUser) {
    return <></>;
  }

  return (
    <Flex
      direction="column"
      textAlign="center"
      justifyContent="center"
      paddingRight={4}
    >
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setPostScore(postScore + 1);
          await vote({
            variables: {
              value: 1,
              postId: post.id,
            },
            update: (cache) => updateAfterVote(cache, 1, post.id),
          });
        }}
        colorScheme={post.voteStatus === 1 ? "green" : "blackAlpha"}
        aria-label="upvote post"
        icon={<ChevronUpIcon w={8} h={8} />}
      />
      {post.score}
      <IconButton
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setPostScore(postScore - 1);
          await vote({
            variables: {
              value: -1,
              postId: post.id,
            },
            update: (cache) => updateAfterVote(cache, -1, post.id),
          });
        }}
        colorScheme={post.voteStatus === -1 ? "red" : "blackAlpha"}
        aria-label="downvote post"
        icon={<ChevronDownIcon w={8} h={8} />}
      />
    </Flex>
  );
};

export default UpvoteSection;
