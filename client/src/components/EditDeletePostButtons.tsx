import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";

interface Props {
  postId: number;
  creatorId: number;
}

const EditDeletePostButtons = ({ postId, creatorId }: Props): JSX.Element => {
  const [deletePost] = useDeletePostMutation();
  const { data } = useMeQuery();
  const router = useRouter();

  if (data?.me?.id !== creatorId) {
    return <> </>;
  }
  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${postId}`}>
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
