import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Post } from "./Post";
import { User } from "./User";

// this is a join table
// user <--> upvote <--> post
@ObjectType()
@Entity()
export class Upvote {
  // up or down
  @Property({ type: "int" })
  value: number;

  @Field()
  @PrimaryKey()
  userId!: number;

  @Field(() => User)
  @ManyToOne(() => User, { inversedBy: (user: User) => user.upvotes })
  user: User;

  @Field()
  @PrimaryKey()
  postId: number;

  @Field(() => Post)
  @ManyToOne(() => Post, {
    inversedBy: (post: Post) => post.upvotes,
    cascade: [Cascade.REMOVE],
  })
  post: Post;
}
