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
  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx()
    context: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const em = context.em as EntityManager;
    const qb = em
      .createQueryBuilder(Post)
      .select("*")
      .orderBy({ createdAt: "desc" })
      .limit(realLimit + 1);

    if (cursor) {
      qb.where({ createdAt: { $lt: cursor } });
    }

    console.log("QUERY: ", qb.getQuery());
    const res = await qb.execute();

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
