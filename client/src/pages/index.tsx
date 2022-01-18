import { gql, useQuery } from "@apollo/client";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Link,
  ListItem,
  OrderedList,
  Spinner,
} from "@chakra-ui/react";
import { addApolloState, initializeApollo } from "../apollo-client";
import Nav from "../components/Nav";
import NextLink from "next/link";
import Wrapper from "../components/Wrapper";

const postsQuery = gql`
  query {
    posts {
      id
      title
    }
  }
`;

const Index = (): JSX.Element => {
  const { data, error, loading } = useQuery(postsQuery);

  if (loading) return <Spinner />;

  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Invalid Query!</AlertTitle>
        <AlertDescription>
          The query provided did not retreieve any data. Please provide a valid
          query.
        </AlertDescription>
      </Alert>
    );
  return (
    <>
      <Nav />
      <Wrapper>
        <NextLink href="/create-post">
          <Link>Create Post</Link>
        </NextLink>
        <OrderedList>
          {data?.posts.map((post: any) => (
            <ListItem key={post.id}> Title: {post.title} </ListItem>
          ))}
        </OrderedList>
      </Wrapper>
    </>
  );
};

export async function getServerSideProps() {
  const client = initializeApollo();
  await client.query({
    query: postsQuery,
  });

  return addApolloState(client, {
    props: {},
  });
}

export default Index;
