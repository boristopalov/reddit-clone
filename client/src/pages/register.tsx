import React from "react";
import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { NextPage } from "next";

interface Props {}

const Register = (props: Props): JSX.Element => {
  const router = useRouter();
  const [registerUser] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const res = await registerUser({
            variables: {
              input: {
                email: values.email,
                username: values.username,
                password: values.password,
              },
            },
            update: (cache, { data }) => {
              const registeredUser = data?.registerUser.user;
              // don't directly mutate userData
              // reads the user data from the cache
              // not used in this case though since we are only reading
              // const userData = cache.readQuery<MeQuery>({ query: MeDocument });

              // writes back to the cache
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: { me: registeredUser },
              });
            },
          });
          if (res.data?.registerUser.errors) {
            setErrors(toErrorMap(res.data.registerUser.errors));
          } else if (res.data?.registerUser.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="email" label="Email" placeholder="email" />
            <Box mt={4}>
              <InputField
                name="username"
                label="Username"
                placeholder="username"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="password"
                type="password"
              />
            </Box>
            <Button
              type="submit"
              mt={4}
              colorScheme="blue"
              isLoading={isSubmitting}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
