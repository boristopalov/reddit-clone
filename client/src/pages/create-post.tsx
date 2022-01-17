import {
  Box,
  Flex,
  Button,
  textDecoration,
  transition,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import Link from "next/link";
import router from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import Nav from "../components/Nav";
import {
  MeQuery,
  MeDocument,
  useCreatePostMutation,
  CreatePostMutation,
} from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

interface Props {}

const CreatePost = (): JSX.Element => {
  const [createPost, {}] = useCreatePostMutation();
  return (
    <>
      <Nav />
      <Wrapper variant="small">
        <Formik
          initialValues={{ title: "", text: "" }}
          onSubmit={async (values, { setErrors }) => {
            const res = await createPost({
              variables: {
                input: { text: values.text, title: values.title },
              },
            });
            router.push("/");

            // if (res.data?.loginUser.errors) {
            //   setErrors(toErrorMap(res.data.loginUser.errors));
            // } else if (res.data?.loginUser.user) {
            //   router.push("/");
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
