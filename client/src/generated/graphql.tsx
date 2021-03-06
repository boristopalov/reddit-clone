import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Comment = {
  __typename?: 'Comment';
  children?: Maybe<Array<Comment>>;
  createdAt: Scalars['DateTime'];
  deleted: Scalars['Boolean'];
  id: Scalars['Int'];
  parent?: Maybe<Comment>;
  parentId?: Maybe<Scalars['Float']>;
  post: Post;
  postId: Scalars['Float'];
  score: Scalars['Int'];
  text: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  upvotes?: Maybe<Array<CommentUpvote>>;
  user: User;
  userId: Scalars['Float'];
  voteStatus?: Maybe<Scalars['Int']>;
};

export type CommentUpvote = {
  __typename?: 'CommentUpvote';
  comment: Comment;
  commentId: Scalars['Float'];
  user: User;
  userId: Scalars['Float'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  comment: Scalars['String'];
  createPost: Post;
  deleteComment: Scalars['Boolean'];
  deletePost: Scalars['Boolean'];
  editComment: Comment;
  forgotPassword: Scalars['Boolean'];
  loginUser: UserResponse;
  logoutUser: Scalars['Boolean'];
  registerUser: UserResponse;
  resetPassword: UserResponse;
  updatePost?: Maybe<Post>;
  vote: Scalars['Boolean'];
  voteOnComment: Scalars['Boolean'];
};


export type MutationCommentArgs = {
  parentId?: InputMaybe<Scalars['Int']>;
  postId: Scalars['Int'];
  text: Scalars['String'];
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationDeleteCommentArgs = {
  id: Scalars['Int'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationEditCommentArgs = {
  id: Scalars['Int'];
  newText: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  usernameOrEmail: Scalars['String'];
};


export type MutationLoginUserArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationRegisterUserArgs = {
  input: UsernamePasswordInput;
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  id: Scalars['Int'];
  text?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};


export type MutationVoteArgs = {
  postId: Scalars['Int'];
  value: Scalars['Int'];
};


export type MutationVoteOnCommentArgs = {
  commentId: Scalars['Int'];
  value: Scalars['Int'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  hasMore: Scalars['Boolean'];
  posts: Array<Post>;
};

export type Post = {
  __typename?: 'Post';
  comments?: Maybe<Array<Comment>>;
  createdAt: Scalars['DateTime'];
  creator: User;
  creatorId: Scalars['Float'];
  id: Scalars['Int'];
  score: Scalars['Int'];
  subreddit: Scalars['String'];
  text: Scalars['String'];
  textSnippet: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  upvotes?: Maybe<Array<Upvote>>;
  voteStatus?: Maybe<Scalars['Int']>;
};

export type PostInput = {
  subreddit: Scalars['String'];
  text: Scalars['String'];
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  comments?: Maybe<Array<Comment>>;
  getUsers: Array<User>;
  me?: Maybe<User>;
  post?: Maybe<Post>;
  posts: PaginatedPosts;
  test: Array<Post>;
};


export type QueryCommentsArgs = {
  postId: Scalars['Int'];
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};


export type QueryPostsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
  subreddit?: InputMaybe<Scalars['String']>;
};

export type Upvote = {
  __typename?: 'Upvote';
  post: Post;
  postId: Scalars['Float'];
  user: User;
  userId: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  commentUpvotes?: Maybe<Array<CommentUpvote>>;
  comments?: Maybe<Array<Comment>>;
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['Int'];
  posts?: Maybe<Array<Post>>;
  updatedAt: Scalars['DateTime'];
  upvotes?: Maybe<Array<Upvote>>;
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type CommentFragment = { __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, user: { __typename?: 'User', id: number, username: string } };

export type RecursiveCommentFragment = { __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } };

export type PostSnippetFragment = { __typename?: 'Post', id: number, title: string, score: number, textSnippet: string, createdAt: any, updatedAt: any, voteStatus?: number | null | undefined, subreddit: string, creator: { __typename?: 'User', id: number, username: string } };

export type RegularUserFragment = { __typename?: 'User', id: number, username: string };

export type CommentMutationVariables = Exact<{
  text: Scalars['String'];
  postId: Scalars['Int'];
  parentId?: InputMaybe<Scalars['Int']>;
}>;


export type CommentMutation = { __typename?: 'Mutation', comment: string };

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: number, createdAt: any, updatedAt: any, title: string, text: string, score: number, creatorId: number } };

export type DeleteCommentMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment: boolean };

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };

export type EditCommentMutationVariables = Exact<{
  id: Scalars['Int'];
  newText: Scalars['String'];
}>;


export type EditCommentMutation = { __typename?: 'Mutation', editComment: { __typename?: 'Comment', id: number, text: string } };

export type ForgotPasswordMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', loginUser: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string } | null | undefined } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logoutUser: boolean };

export type RegisterMutationVariables = Exact<{
  input: UsernamePasswordInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string } | null | undefined } };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string } | null | undefined } };

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost?: { __typename?: 'Post', id: number, title: string, text: string } | null | undefined };

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  postId: Scalars['Int'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type VoteOnCommentMutationVariables = Exact<{
  value: Scalars['Int'];
  commentId: Scalars['Int'];
}>;


export type VoteOnCommentMutation = { __typename?: 'Mutation', voteOnComment: boolean };

export type GetCommentsQueryVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type GetCommentsQuery = { __typename?: 'Query', comments?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, children?: Array<{ __typename?: 'Comment', text: string, id: number, parentId?: number | null | undefined, score: number, updatedAt: any, voteStatus?: number | null | undefined, userId: number, deleted: boolean, postId: number, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined, user: { __typename?: 'User', id: number, username: string } }> | null | undefined };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string } | null | undefined };

export type GetPostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetPostQuery = { __typename?: 'Query', post?: { __typename?: 'Post', id: number, title: string, text: string, score: number, createdAt: any, updatedAt: any, voteStatus?: number | null | undefined, creatorId: number, subreddit: string, creator: { __typename?: 'User', id: number, username: string } } | null | undefined };

export type GetPostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
  subreddit?: InputMaybe<Scalars['String']>;
}>;


export type GetPostsQuery = { __typename?: 'Query', posts: { __typename?: 'PaginatedPosts', hasMore: boolean, posts: Array<{ __typename?: 'Post', id: number, title: string, score: number, textSnippet: string, createdAt: any, updatedAt: any, voteStatus?: number | null | undefined, subreddit: string, creator: { __typename?: 'User', id: number, username: string } }> } };

export const CommentFragmentDoc = gql`
    fragment comment on Comment {
  text
  id
  parentId
  score
  updatedAt
  voteStatus
  userId
  deleted
  postId
  user {
    id
    username
  }
}
    `;
export const RecursiveCommentFragmentDoc = gql`
    fragment recursiveComment on Comment {
  ...comment
  children {
    ...comment
    children {
      ...comment
      children {
        ...comment
        children {
          ...comment
          children {
            ...comment
            children {
              ...comment
              children {
                ...comment
                children {
                  ...comment
                  children {
                    ...comment
                    children {
                      ...comment
                      children {
                        ...comment
                        children {
                          ...comment
                          children {
                            ...comment
                            children {
                              ...comment
                              children {
                                ...comment
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    ${CommentFragmentDoc}`;
export const PostSnippetFragmentDoc = gql`
    fragment PostSnippet on Post {
  id
  title
  score
  textSnippet
  createdAt
  updatedAt
  voteStatus
  subreddit
  creator {
    id
    username
  }
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const CommentDocument = gql`
    mutation comment($text: String!, $postId: Int!, $parentId: Int) {
  comment(text: $text, postId: $postId, parentId: $parentId)
}
    `;
export type CommentMutationFn = Apollo.MutationFunction<CommentMutation, CommentMutationVariables>;

/**
 * __useCommentMutation__
 *
 * To run a mutation, you first call `useCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [commentMutation, { data, loading, error }] = useCommentMutation({
 *   variables: {
 *      text: // value for 'text'
 *      postId: // value for 'postId'
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useCommentMutation(baseOptions?: Apollo.MutationHookOptions<CommentMutation, CommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CommentMutation, CommentMutationVariables>(CommentDocument, options);
      }
export type CommentMutationHookResult = ReturnType<typeof useCommentMutation>;
export type CommentMutationResult = Apollo.MutationResult<CommentMutation>;
export type CommentMutationOptions = Apollo.BaseMutationOptions<CommentMutation, CommentMutationVariables>;
export const CreatePostDocument = gql`
    mutation createPost($input: PostInput!) {
  createPost(input: $input) {
    id
    createdAt
    updatedAt
    title
    text
    score
    creatorId
  }
}
    `;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const DeleteCommentDocument = gql`
    mutation deleteComment($id: Int!) {
  deleteComment(id: $id)
}
    `;
export type DeleteCommentMutationFn = Apollo.MutationFunction<DeleteCommentMutation, DeleteCommentMutationVariables>;

/**
 * __useDeleteCommentMutation__
 *
 * To run a mutation, you first call `useDeleteCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCommentMutation, { data, loading, error }] = useDeleteCommentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCommentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCommentMutation, DeleteCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument, options);
      }
export type DeleteCommentMutationHookResult = ReturnType<typeof useDeleteCommentMutation>;
export type DeleteCommentMutationResult = Apollo.MutationResult<DeleteCommentMutation>;
export type DeleteCommentMutationOptions = Apollo.BaseMutationOptions<DeleteCommentMutation, DeleteCommentMutationVariables>;
export const DeletePostDocument = gql`
    mutation deletePost($id: Int!) {
  deletePost(id: $id)
}
    `;
export type DeletePostMutationFn = Apollo.MutationFunction<DeletePostMutation, DeletePostMutationVariables>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePostMutation(baseOptions?: Apollo.MutationHookOptions<DeletePostMutation, DeletePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, options);
      }
export type DeletePostMutationHookResult = ReturnType<typeof useDeletePostMutation>;
export type DeletePostMutationResult = Apollo.MutationResult<DeletePostMutation>;
export type DeletePostMutationOptions = Apollo.BaseMutationOptions<DeletePostMutation, DeletePostMutationVariables>;
export const EditCommentDocument = gql`
    mutation editComment($id: Int!, $newText: String!) {
  editComment(id: $id, newText: $newText) {
    id
    text
  }
}
    `;
export type EditCommentMutationFn = Apollo.MutationFunction<EditCommentMutation, EditCommentMutationVariables>;

/**
 * __useEditCommentMutation__
 *
 * To run a mutation, you first call `useEditCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editCommentMutation, { data, loading, error }] = useEditCommentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      newText: // value for 'newText'
 *   },
 * });
 */
export function useEditCommentMutation(baseOptions?: Apollo.MutationHookOptions<EditCommentMutation, EditCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditCommentMutation, EditCommentMutationVariables>(EditCommentDocument, options);
      }
export type EditCommentMutationHookResult = ReturnType<typeof useEditCommentMutation>;
export type EditCommentMutationResult = Apollo.MutationResult<EditCommentMutation>;
export type EditCommentMutationOptions = Apollo.BaseMutationOptions<EditCommentMutation, EditCommentMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation forgotPassword($usernameOrEmail: String!) {
  forgotPassword(usernameOrEmail: $usernameOrEmail)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  loginUser(usernameOrEmail: $usernameOrEmail, password: $password) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logoutUser
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($input: UsernamePasswordInput!) {
  registerUser(input: $input) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation resetPassword($token: String!, $newPassword: String!) {
  resetPassword(token: $token, newPassword: $newPassword) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const UpdatePostDocument = gql`
    mutation updatePost($id: Int!, $title: String, $text: String) {
  updatePost(id: $id, title: $title, text: $text) {
    id
    title
    text
  }
}
    `;
export type UpdatePostMutationFn = Apollo.MutationFunction<UpdatePostMutation, UpdatePostMutationVariables>;

/**
 * __useUpdatePostMutation__
 *
 * To run a mutation, you first call `useUpdatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePostMutation, { data, loading, error }] = useUpdatePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *      title: // value for 'title'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useUpdatePostMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePostMutation, UpdatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument, options);
      }
export type UpdatePostMutationHookResult = ReturnType<typeof useUpdatePostMutation>;
export type UpdatePostMutationResult = Apollo.MutationResult<UpdatePostMutation>;
export type UpdatePostMutationOptions = Apollo.BaseMutationOptions<UpdatePostMutation, UpdatePostMutationVariables>;
export const VoteDocument = gql`
    mutation Vote($value: Int!, $postId: Int!) {
  vote(value: $value, postId: $postId)
}
    `;
export type VoteMutationFn = Apollo.MutationFunction<VoteMutation, VoteMutationVariables>;

/**
 * __useVoteMutation__
 *
 * To run a mutation, you first call `useVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteMutation, { data, loading, error }] = useVoteMutation({
 *   variables: {
 *      value: // value for 'value'
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useVoteMutation(baseOptions?: Apollo.MutationHookOptions<VoteMutation, VoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument, options);
      }
export type VoteMutationHookResult = ReturnType<typeof useVoteMutation>;
export type VoteMutationResult = Apollo.MutationResult<VoteMutation>;
export type VoteMutationOptions = Apollo.BaseMutationOptions<VoteMutation, VoteMutationVariables>;
export const VoteOnCommentDocument = gql`
    mutation VoteOnComment($value: Int!, $commentId: Int!) {
  voteOnComment(value: $value, commentId: $commentId)
}
    `;
export type VoteOnCommentMutationFn = Apollo.MutationFunction<VoteOnCommentMutation, VoteOnCommentMutationVariables>;

/**
 * __useVoteOnCommentMutation__
 *
 * To run a mutation, you first call `useVoteOnCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteOnCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteOnCommentMutation, { data, loading, error }] = useVoteOnCommentMutation({
 *   variables: {
 *      value: // value for 'value'
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function useVoteOnCommentMutation(baseOptions?: Apollo.MutationHookOptions<VoteOnCommentMutation, VoteOnCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VoteOnCommentMutation, VoteOnCommentMutationVariables>(VoteOnCommentDocument, options);
      }
export type VoteOnCommentMutationHookResult = ReturnType<typeof useVoteOnCommentMutation>;
export type VoteOnCommentMutationResult = Apollo.MutationResult<VoteOnCommentMutation>;
export type VoteOnCommentMutationOptions = Apollo.BaseMutationOptions<VoteOnCommentMutation, VoteOnCommentMutationVariables>;
export const GetCommentsDocument = gql`
    query getComments($postId: Int!) {
  comments(postId: $postId) {
    ...recursiveComment
  }
}
    ${RecursiveCommentFragmentDoc}`;

/**
 * __useGetCommentsQuery__
 *
 * To run a query within a React component, call `useGetCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommentsQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useGetCommentsQuery(baseOptions: Apollo.QueryHookOptions<GetCommentsQuery, GetCommentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCommentsQuery, GetCommentsQueryVariables>(GetCommentsDocument, options);
      }
export function useGetCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCommentsQuery, GetCommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCommentsQuery, GetCommentsQueryVariables>(GetCommentsDocument, options);
        }
export type GetCommentsQueryHookResult = ReturnType<typeof useGetCommentsQuery>;
export type GetCommentsLazyQueryHookResult = ReturnType<typeof useGetCommentsLazyQuery>;
export type GetCommentsQueryResult = Apollo.QueryResult<GetCommentsQuery, GetCommentsQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    username
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const GetPostDocument = gql`
    query getPost($id: Int!) {
  post(id: $id) {
    id
    title
    text
    score
    createdAt
    updatedAt
    voteStatus
    creatorId
    subreddit
    creator {
      id
      username
    }
  }
}
    `;

/**
 * __useGetPostQuery__
 *
 * To run a query within a React component, call `useGetPostQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPostQuery(baseOptions: Apollo.QueryHookOptions<GetPostQuery, GetPostQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, options);
      }
export function useGetPostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostQuery, GetPostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, options);
        }
export type GetPostQueryHookResult = ReturnType<typeof useGetPostQuery>;
export type GetPostLazyQueryHookResult = ReturnType<typeof useGetPostLazyQuery>;
export type GetPostQueryResult = Apollo.QueryResult<GetPostQuery, GetPostQueryVariables>;
export const GetPostsDocument = gql`
    query getPosts($limit: Int!, $cursor: String, $subreddit: String) {
  posts(limit: $limit, cursor: $cursor, subreddit: $subreddit) {
    hasMore
    posts {
      ...PostSnippet
    }
  }
}
    ${PostSnippetFragmentDoc}`;

/**
 * __useGetPostsQuery__
 *
 * To run a query within a React component, call `useGetPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *      subreddit: // value for 'subreddit'
 *   },
 * });
 */
export function useGetPostsQuery(baseOptions: Apollo.QueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
      }
export function useGetPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
        }
export type GetPostsQueryHookResult = ReturnType<typeof useGetPostsQuery>;
export type GetPostsLazyQueryHookResult = ReturnType<typeof useGetPostsLazyQuery>;
export type GetPostsQueryResult = Apollo.QueryResult<GetPostsQuery, GetPostsQueryVariables>;