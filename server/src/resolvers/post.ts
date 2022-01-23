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
    const connection = em.getConnection();
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
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx()
    context: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const em = context.em as EntityManager;
    const connection = em.getConnection();

    // i guess mikro-orm uses "?" as variables for native SQL queries
    // but since the params change and i can't
    // specify variables (ex. ?1, ?2) i need to dynamically change the order
    const queryParams = cursor
      ? [cursor, realLimit + 1]
      : [realLimit + 1, cursor];

    const res: Post[] = await connection.execute(
      `select p.id, p.title, p.text, p,score, p.creator_id as "creatorId", p.created_at as "createdAt", p.updated_at as "updatedAt",
      json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email
        ) creator 
      from post p
      inner join public.user u 
      on p.creator_id = u.id
    ${cursor ? `where p.created_at < ?` : ""} 
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
    return context.em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { em, req }: MyContext
  ) {
    const user = req.session.userId;

    const post = em.create(Post, { ...input, creatorId: user });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    // destructuring context
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }

    if (typeof title !== "undefined") {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext // destructuring context
  ) {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return false;
    }
    await em.nativeDelete(Post, { id });
    return true;
  }
}
