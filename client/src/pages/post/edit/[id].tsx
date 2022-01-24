import { Box, Flex, Button, Spinner } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../../../components/InputField";
import Nav from "../../../components/Nav";
import Wrapper from "../../../components/Wrapper";
import {
  useGetPostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { useIsAuth } from "../../../utils/useIsAuth";
import { withApollo } from "../../../withApollo";

const EditPost = (): JSX.Element => {
  useIsAuth();
  const [updatePost] = useUpdatePostMutation();
  const router = useRouter();
  const postId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const { data, loading } = useGetPostQuery({
    variables: { id: postId },
  });

  if (loading) {
    return <Spinner />;
  }

  if (!data?.post) {
    return <Wrapper>Could not find post.</Wrapper>;
  }

  return (
    <>
      <Nav />
      <Wrapper variant="small">
        <Formik
          initialValues={{ title: data?.post.title, text: data?.post.text }}
          onSubmit={async (values) => {
            if (postId === -1) {
              throw new Error("invalid post id");
            }
            const { errors } = await updatePost({
              variables: {
                id: postId,
                text: values.text,
                title: values.title,
              },
              update: (cache) => {
                cache.evict({ fieldName: "posts" });
              },
            });
            if (errors) {
              router.push("/login");
            } else {
              router.back();

              // router.push(`/post/${postId}`);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="title"
                label="Title"
                placeholder={data?.post?.title}
              />
              <Box mt={4}>
                <InputField
                  name="text"
                  label="Body"
                  placeholder={data?.post?.text}
                  textarea={true}
                />
              </Box>
              <Flex alignItems="center" mt={4}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                >
                  Update Post
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(EditPost);
