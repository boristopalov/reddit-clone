import { Box, Flex, Button, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { useState } from "react";
import withApollo from "../withApollo";
interface Props {}

const ForgotPassword = (props: Props): JSX.Element => {
  const [sentLink, setSentLink] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, {}) => {
          await forgotPassword({
            variables: {
              usernameOrEmail: values.usernameOrEmail,
            },
          });
          setSentLink(true);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              label="Username or Email"
              placeholder="Username or Email"
            />
            <Flex alignItems="center" mt={4}>
              <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
                Send Email
              </Button>
            </Flex>
            {sentLink ? (
              <Box mt={4}>
                If an account with that username or email exists, an email has
                been sent.
              </Box>
            ) : null}
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
