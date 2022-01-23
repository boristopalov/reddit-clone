import { gql } from "@apollo/client";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface Props {
  post: PostSnippetFragment;
}

const UpvoteSection = ({ post }: Props): JSX.Element => {
  const [postScore, setPostScore] = useState(post.score);
  const [vote] = useVoteMutation();

  return (
    <Flex
      direction="column"
      textAlign="center"
      justifyContent="center"
      paddingRight={4}
    >
      <IconButton
        onClick={async () => {
          setPostScore(postScore + 1);
          await vote({
            variables: {
              value: 1,
              postId: post.id,
            },
          });
        }}
        colorScheme="blackAlpha"
        aria-label="upvote post"
        icon={<ChevronUpIcon w={8} h={8} />}
      />
      {post.score}
      <IconButton
        onClick={async () => {
          setPostScore(postScore - 1);
          await vote({
            variables: {
              value: -1,
              postId: post.id,
            },
          });
        }}
        colorScheme="blackAlpha"
        aria-label="downvote post"
        icon={<ChevronDownIcon w={8} h={8} />}
      />
    </Flex>
  );
};

export default UpvoteSection;
