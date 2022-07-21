import { Box, Flex, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import router from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import Nav from "../components/Nav";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../withApollo";

const CreatePost = (): JSX.Element => {
  useIsAuth();
  const [createPost] = useCreatePostMutation();
  return (
    <>
      <Nav />
      <Wrapper variant="small">
        <Formik
          initialValues={{ title: "", subreddit: "", text: "" }}
          onSubmit={async (values) => {
            const { errors } = await createPost({
              variables: {
                input: {
                  text: values.text,
                  subreddit: values.subreddit,
                  title: values.title,
                },
              },
              update: (cache) => {
                cache.evict({ fieldName: "posts" });
              },
            });
            if (errors) {
              router.push("/login");
            } else {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="title" label="Title" placeholder="Post Title" />
              <Box mt={4}>
                <InputField
                  name="subreddit"
                  label="Subreddit"
                  placeholder="Subreddit"
                />
              </Box>
              <Box mt={4}>
                <InputField
                  name="text"
                  label="Body"
                  placeholder="Text"
                  textarea={true}
                />
              </Box>
              <Flex alignItems="center" mt={4}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                >
                  Create Post
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(CreatePost);
