import { Link, ListItem, OrderedList, Spinner } from "@chakra-ui/react";
import Nav from "../components/Nav";
import NextLink from "next/link";
import Wrapper from "../components/Wrapper";
import { GetPostsDocument, useGetPostsQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import withApollo from "../withApollo";

const Index = (): JSX.Element => {
  // console.log(initialApolloState);
  const { data, loading, fetchMore, variables } = useGetPostsQuery({
    variables: {
      limit: 20,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (loading) return <Spinner />;

  // fetchMore({
  //   variables: {
  //     limit: variables?.limit,
  //     cursor: data?.posts[data.posts.length - 1].createdAt,
  //   },
  //  updateQuery: (previousValue, {fetchMoreResult}): GetPostsQuery => {
  //   if (!fetchMoreResult) {
  //     return previousValue as GetPostsQuery;
  //   }
  //   return {
  //     __typename: "Query",
  //     posts: {
  //       hasMore: fetchMoreResult
  //     }
  //   }
  // }
  // })

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

// export async function getServerSideProps() {
//   const client = initializeApollo();
//   const { data: ssrData } = await client.query({
//     query: GetPostsDocument,
//     variables: {
//       limit: 10,
//     },
//   });

//   return {
//     props: {
//       initialApolloState: client.cache.extract(),
//       ssrData,
//     },
//   };
// }

export default withApollo({ ssr: true })(Index);
