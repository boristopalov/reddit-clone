import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import router, { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import {
  MeQuery,
  MeDocument,
  useResetPasswordMutation,
} from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";

interface Props {
  token: string;
}

const resetPassword: NextPage<Props> = ({ token }) => {
  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation();
  const [tokenError, setTokenError] = useState("");

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          const res = await resetPassword({
            variables: {
              token: token,
              newPassword: values.newPassword,
            },
            update: (cache, { data }) => {
              const user = data?.resetPassword.user;
              // don't directly mutate userData
              // reads the user data from the cache
              // not used in this case though since we are only writing
              // const userData = cache.readQuery<MeQuery>({ query: MeDocument });

              // writes back to the cache
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: { me: user },
              });
            },
          });

          if (res.data?.resetPassword.errors) {
            const errors = toErrorMap(res.data.resetPassword.errors);

            if ("token" in errors) {
              setTokenError(errors.token);
            } else {
              setErrors(errors);
            }
          } else if (res.data?.resetPassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {tokenError ? (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>Token Error</AlertTitle>
                <AlertDescription>Invalid Link.</AlertDescription>
              </Alert>
            ) : null}
            <Box mt={4}>
              <InputField
                name="newPassword"
                label="New Password"
                placeholder="new password"
                type="password"
              />
            </Box>
            <Button
              type="submit"
              mt={4}
              colorScheme="blue"
              isLoading={isSubmitting}
            >
              Reset Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

// getInitialProps get us any query parameters from URL and pass it to our component
resetPassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default resetPassword;
