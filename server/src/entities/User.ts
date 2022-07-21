import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { Comment } from "./Comment";
import { CommentUpvote } from "./CommentUpvote";
import { Post } from "./Post";
import { Upvote } from "./Upvote";

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: "text", unique: true })
  username!: string;

  // no field property so we can't see it within graphQL
  @Property({ type: "text", unique: true })
  password!: string;

  @Field()
  @Property({ type: "text", unique: true })
  email!: string;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post: Post) => post.creator)
  posts: Collection<Post> = new Collection<Post>(this);

  @Field(() => [Upvote], { nullable: true })
  @OneToMany(() => Upvote, (upvote: Upvote) => upvote.user)
  upvotes: Collection<Upvote> = new Collection<Upvote>(this);

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment: Comment) => comment.user)
  comments: Collection<Comment> = new Collection<Comment>(this);

  @Field(() => [CommentUpvote], { nullable: true })
  @OneToMany(() => CommentUpvote, (upvote: CommentUpvote) => upvote.user)
  commentUpvotes: Collection<CommentUpvote> = new Collection<CommentUpvote>(
    this
  );

  @Field()
  @Property()
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
