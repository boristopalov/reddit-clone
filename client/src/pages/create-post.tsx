import { Box, Flex, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import router from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import Nav from "../components/Nav";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost = (): JSX.Element => {
  useIsAuth();
  const [createPost] = useCreatePostMutation();
  return (
    <>
      <Nav />
      <Wrapper variant="small">
        <Formik
          initialValues={{ title: "", text: "" }}
          onSubmit={async (values) => {
            const { errors } = await createPost({
              variables: {
                input: { text: values.text, title: values.title },
              },
            });
            if (errors) {
              router.push("/login");
            } else {
              router.push("/");
            }

            // if (error?.message.includes("not authenticated")) {
            // } else router.push("/");

            // if (res.data?.loginUser.errors) {
            //   setErrors(toErrorMap(res.data.loginUser.errors));
            // } else if (res.data?.loginUser.user) {
            // }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="title" label="Title" placeholder="Post Title" />
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

export default CreatePost;
