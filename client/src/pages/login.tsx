import React from "react";
import { Form, Formik } from "formik";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import {
  MeDocument,
  MeQuery,
  MeQueryResult,
  useLoginMutation,
} from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import NextLink from "next/link";

interface Props {}

const Login = (props: Props): JSX.Element => {
  const router = useRouter();
  const [loginUser] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const res = await loginUser({
            variables: {
              usernameOrEmail: values.usernameOrEmail,
              password: values.password,
            },
            update: (cache, { data }) => {
              const loggedInUser = data?.loginUser.user;
              // don't directly mutate userData
              // reads the user data from the cache
              // not used in this case though since we are only reading
              // const userData = cache.readQuery<MeQuery>({ query: MeDocument });

              // writes back to the cache
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: { me: loggedInUser },
              });
            },
          });

          if (res.data?.loginUser.errors) {
            setErrors(toErrorMap(res.data.loginUser.errors));
          } else if (res.data?.loginUser.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              label="Username or Email"
              placeholder="username or Email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="password"
                type="password"
              />
            </Box>
            <Flex alignItems="center" mt={4}>
              <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
                Login
              </Button>
              <NextLink href="/forgot-password">
                <Link ml="auto" height="100%">
                  Forgot Password
                </Link>
              </NextLink>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
