import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";

interface Props {
  postId: number;
  subreddit: string;
  creatorId: number;
  currentUser: number | null;
}

const EditDeletePostButtons = ({
  postId,
  creatorId,
  subreddit,
  currentUser,
}: Props): JSX.Element => {
  const [deletePost] = useDeletePostMutation();
  const router = useRouter();

  if (currentUser !== creatorId) {
    return <> </>;
  }
  return (
    <Box>
      <NextLink
        href="/r/[subreddit]/edit/[id]"
        as={`/r/${subreddit}/edit/${postId}`}
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
              id: postId,
            },
            update: (cache) => {
              cache.evict({ id: "Post:" + postId });
            },
          });
          if (router.query.id) {
            router.push("/");
          }
        }}
      />
    </Box>
  );
};

export default EditDeletePostButtons;
