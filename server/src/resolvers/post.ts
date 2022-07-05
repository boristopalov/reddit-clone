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
    const upvote = await em.findOne(Upvote, { postId: postId, userId: userId });

    // the user has already voted on this post
    // and they are changing their vote
    const emFork = em.fork(false);
    const connection = emFork.getConnection();
    if (upvote && upvote.value !== realValue) {
      console.log("yooo");
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
    const em = context.em as EntityManager;
    const connection = em.getConnection();
    const user = context.req.session.userId;

    // i guess mikro-orm uses "?" as variables for native SQL queries
    // but since the params change and i can't
    // specify variables (ex. ?1, ?2) i need to dynamically change the order
    let queryParams =
      cursor && subreddit
        ? [subreddit, cursor, realLimit + 1]
        : cursor
        ? [cursor, realLimit + 1]
        : [subreddit, realLimit + 1, cursor];
    if (user) {
      queryParams = [user, ...queryParams];
    }

    const res: Post[] = await connection.execute(
      `select p.id, p.title, p.text, p,score, p.subreddit, p.creator_id as "creatorId", p.created_at as "createdAt", p.updated_at as "updatedAt",
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
    context: MyContext
  ) {
    return context.em.findOne(Post, { id }, ["creator"]);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { em, req }: MyContext
  ) {
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
    @Ctx() { em, req }: MyContext
  ): Promise<Post | null> {
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
    @Ctx() { em, req }: MyContext // destructuring context
  ) {
    const post = await em.findOne(Post, { id });
    const userId = req.session.userId;
    const upvotes = await em.findOne(Upvote, { postId: id });
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
    await em.removeAndFlush(post);

    return true;
  }
}
