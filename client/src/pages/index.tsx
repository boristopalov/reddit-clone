import { gql, useQuery } from "@apollo/client";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  ListItem,
  OrderedList,
  Spinner,
} from "@chakra-ui/react";
import Nav from "../components/Nav";

const postsQuery = gql`
  query {
    posts {
      id
      title
    }
  }
`;

const Index = () => {
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
        <CloseButton position="absolute" right="8px" top="8px" />
      </Alert>
    );
  return (
    <div>
      <Nav />
      <OrderedList>
        {data?.posts.map((post: any) => (
          <ListItem key={post.id}> Title: {post.title} </ListItem>
        ))}
      </OrderedList>
    </div>
  );
};

export default Index;
