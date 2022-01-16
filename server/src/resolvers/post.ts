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
} from "type-graphql";
import { isAuth } from "src/middleware/isAuth";

@InputType()
class PostInput {
  @Field()
  title: string;

  @Field()
  text: string;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    @Ctx()
    context: MyContext
  ) {
    return context.em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
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
