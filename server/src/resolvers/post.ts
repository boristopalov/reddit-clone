import { Post } from "../entities/Post";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Int,
  Query,
  Resolver,
  Mutation,
  InputType,
  Field,
  UseMiddleware,
  ObjectType,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { EntityManager } from "@mikro-orm/mysql"; // or any other driver package
import { Upvote } from "../entities/Upvote";
import { Comment } from "../entities/Comment";
import { CommentUpvote } from "../entities/CommentUpvote";
import { UserInputError } from "apollo-server-express";
import { User } from "../entities/User";
import { QueryOrder } from "@mikro-orm/core";

@InputType()
class PostInput {
  @Field()
  title: string;

  @Field()
  text: string;

  @Field()
  subreddit: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post])
  async test(@Ctx() context: MyContext): Promise<Post[]> {
    const em = context.em as EntityManager;
    return await em.find(Post, {});
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async comment(
    @Arg("postId", () => Int) postId: number,
    @Arg("text", () => String) text: string,
    @Ctx() { req, em: oldEm }: MyContext,
    @Arg("parentId", () => Int, { nullable: true }) parentId?: number
  ) {
    const em = oldEm.fork();
    const userId = req.session.userId;
    const connection = em.getConnection();
    const user = await em.findOne(User, { id: userId });
    const username = user!.username;

    if (parentId) {
      //check if a comment on the post with the given parent id exists
      const parent = await em.findOne(Comment, {
        id: parentId,
        postId: postId,
      });
      if (!parent) {
        throw new UserInputError(
          `ERROR: no parent comment found with id ${parentId} and post id ${postId}`
        );
      }
      await connection.execute(
        `
          insert into comment(user_id, username, post_id, text, parent_id)
          values (?, ?, ?, ?, ?);
          `,
        [userId, username, postId, text, parentId]
      );
    } else {
      await connection.execute(
        `
          insert into comment(user_id, username, post_id, text)
          values (?, ?, ?, ?);
          `,
        [userId, username, postId, text]
      );
    }
    return text;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req, em }: MyContext
  ) {
    const isUpvote = value !== -1;
    const realValue = isUpvote ? 1 : -1;
    const userId = req.session.userId;

    const emFork = em.fork(false);
    const connection = emFork.getConnection();
    const upvote = await emFork.findOne(Upvote, {
      postId: postId,
      userId: userId,
    });

    // the user has already voted on this post
    // and they are changing their vote
    if (upvote && upvote.value !== realValue) {
      try {
        await emFork.begin();
        await connection.execute(
          `
          update upvote
          set value = ? 
          where post_id = ? and user_id = ?;

          update post 
          set score = score + ?
          where id = ?;
          `,
          [realValue, postId, userId, 2 * realValue, postId]
        );
        await emFork.commit();
      } catch (e) {
        console.log(e.message);
        await emFork.rollback();
        throw e;
      }
    }

    // user has not voted before
    else if (!upvote) {
      try {
        await emFork.begin();
        await connection.execute(
          `
          insert into upvote(user_id, post_id, value)
          values (?, ?, ?);
    
          update post 
          set score = score + ?
          where post.id = ?;
          `,
          [userId, postId, realValue, realValue, postId]
        );
        await emFork.commit();
      } catch (e) {
        console.log(e.message);
        await emFork.rollback();
        throw e;
      }
    }
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async voteOnComment(
    @Arg("commentId", () => Int) commentId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req, em }: MyContext
  ) {
    const isUpvote = value !== -1;
    const realValue = isUpvote ? 1 : -1;
    const userId = req.session.userId;
    const emFork = em.fork(false);
    const connection = emFork.getConnection();
    const upvote = await emFork.findOne(CommentUpvote, {
      commentId: commentId,
      userId: userId,
    });

    if (upvote && upvote.value !== realValue) {
      try {
        await emFork.begin();
        await connection.execute(
          `
          update comment_upvote
          set value = ? 
          where comment_id = ? and user_id = ?;

          update comment 
          set score = score + ?
          where id = ?;
          `,
          [realValue, commentId, userId, 2 * realValue, commentId]
        );
        await emFork.commit();
      } catch (e) {
        console.log(e.message);
        await emFork.rollback();
        throw e;
      }
    }

    // user has not voted before
    else if (!upvote) {
      try {
        await emFork.begin();
        await connection.execute(
          `
          insert into comment_upvote(user_id, comment_id, value)
          values (?, ?, ?);
    
          update comment 
          set score = score + ?
          where comment.id = ?;
          `,
          [userId, commentId, realValue, realValue, commentId]
        );
        await emFork.commit();
      } catch (e) {
        console.log(e.message);
        await emFork.rollback();
        throw e;
      }
    }

    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("subreddit", () => String, { nullable: true })
    subreddit: string | null,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx()
    context: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const oldEm = context.em as EntityManager;
    const em = oldEm.fork();
    const connection = em.getConnection();
    const user = context.req.session.userId;

    // i guess mikro-orm uses "?" as variables for native SQL queries
    // but since the params change and i can't
    // specify variables (ex. ?1, ?2) i need to dynamically change the order
    let queryParams: (string | number)[] = [];
    if (cursor && subreddit) {
      queryParams = [subreddit, cursor, realLimit + 1];
    } else if (subreddit) {
      queryParams = [subreddit, realLimit + 1];
    } else if (cursor) {
      queryParams = [cursor, realLimit + 1];
    } else queryParams = [realLimit + 1];

    if (user) {
      queryParams = [user, ...queryParams];
    }

    const res: Post[] = await connection.execute(
      `select p.id, p.title, p.text, p.score, p.subreddit, p.creator_id as "creatorId", p.created_at as "createdAt", p.updated_at as "updatedAt",
      json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email
        ) creator,
      ${
        user
          ? '(select value from upvote where user_id = ? and post_id = p.id) "voteStatus"'
          : 'null as "voteStatus"'
      }
      from post p
      inner join public.user u 
      on p.creator_id = u.id
      ${subreddit ? `where p.subreddit = ?` : ""}
    ${
      subreddit && cursor
        ? "and p.created_at < ?"
        : cursor
        ? `where p.created_at < ?`
        : ""
    } 
    order by p.created_at DESC 
    limit ?`,
      queryParams
    );

    return {
      posts: res.slice(0, realLimit),
      hasMore: res.length === realLimit + 1,
    };
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg("id", () => Int)
    id: number,
    @Ctx()
    { em: oldEm }: MyContext
  ) {
    const em = oldEm.fork();
    return em.findOne(Post, { id }, ["creator", "comments", "upvotes"]);
  }

  @Query(() => [Comment], { nullable: true })
  async comments(
    @Arg("postId", () => Int)
    postId: number,
    @Ctx()
    { em: oldEm, req }: MyContext
  ): Promise<Comment[]> {
    // https://stackoverflow.com/questions/18017869/build-tree-array-from-flat-array-in-javascript
    type ParentMap = {
      [key: number]: number;
    };
    type VoteStatus = {
      id: number;
      voteStatus: number | null;
    };

    const map: ParentMap = {};
    const roots: Comment[] = [];
    const em = oldEm.fork() as EntityManager;
    const connection = em.getConnection();

    const comments = await em.find(
      Comment,
      { postId },
      {
        orderBy: { createdAt: QueryOrder.DESC },
        populate: ["upvotes", "user"],
      }
    );
    const user = req.session.userId;
    let voteStatuses: VoteStatus[] = [];
    if (user) {
      voteStatuses = await connection.execute(
        `
      select c.id,
      (select value from comment_upvote where user_id = ? and comment_id = c.id) "voteStatus"
      from comment c
      where c.post_id = ?
      order by c.created_at desc;
      `,
        [user, postId]
      );
      // console.log("vote status", voteStatuses);
    }

    for (let i = 0; i < comments.length; i++) {
      map[comments[i].id] = i;
      console.log("id frmo comments", comments[i].id);
      if (user) {
        comments[i].voteStatus = voteStatuses[i].voteStatus;
      }
    }
    for (let i = 0; i < comments.length; i++) {
      const node = comments[i];
      if (node.parentId) {
        comments[map[node.parentId]].children.add(node);
      } else {
        roots.push(node);
      }
    }

    // console.log("roots", roots);
    return roots;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteComment(
    @Arg("id", () => Int) id: number,
    @Ctx() { em: oldEm, req }: MyContext
  ) {
    const em = oldEm.fork();
    const comment = await em.findOne(Comment, { id });
    if (!comment) {
      return false;
    }
    if (comment.userId !== req.session.userId) {
      throw new Error("not authorized");
    }
    comment.text = "[deleted]";
    comment.deleted = true;
    await em.persistAndFlush(comment);
    return true;
  }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async editComment(
    @Arg("id", () => Int) id: number,
    @Arg("newText") newText: string,
    @Ctx() { em: oldEm, req }: MyContext
  ) {
    const em = oldEm.fork();
    const comment = await em.findOne(Comment, { id });
    if (!comment) {
      return null;
    }
    if (comment.userId !== req.session.userId) {
      throw new Error("not authorized");
    }
    comment.text = newText;
    await em.persistAndFlush(comment);
    return comment;
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { em: oldEm, req }: MyContext
  ) {
    const em = oldEm.fork();
    const userId = req.session.userId;

    const post: Post = em.create(Post, {
      ...input,
      creatorId: userId,
    });
    await em.persistAndFlush(post);
    console.log({ ...post });
    return { ...post };
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Arg("text", () => String, { nullable: true }) text: string,
    @Ctx() { em: oldEm, req }: MyContext
  ): Promise<Post | null> {
    const em = oldEm.fork();
    const userId = req.session.userId;
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }

    if (post.creatorId !== userId) {
      throw new Error("not authorized");
    }

    if (typeof title !== "undefined") {
      post.title = title;
    }

    if (typeof text !== "undefined") {
      post.text = text;
    }
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { em: oldEm, req }: MyContext // destructuring context
  ) {
    const em = oldEm.fork();

    const post = await em.findOne(Post, { id });
    const userId = req.session.userId;
    const upvotes = await em.findOne(Upvote, { postId: id });
    const comments = await em.findOne(Comment, { postId: id });
    console.log("POST:", post);
    console.log("UPVOTES:", upvotes);

    // delete will only happen if the creator of the post is the one deleting the post
    if (!post) {
      return false;
    }
    if (post.creatorId !== userId) {
      throw new Error("not authorized");
    }

    if (upvotes) {
      await em.removeAndFlush(upvotes);
    }
    if (comments) {
      await em.removeAndFlush(comments);
    }
    await em.removeAndFlush(post);

    return true;
  }
}
