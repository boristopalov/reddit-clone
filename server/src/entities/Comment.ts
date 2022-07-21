import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Field, ObjectType, Int } from "type-graphql";
import { CommentUpvote } from "./CommentUpvote";
import { Post } from "./Post";
import { User } from "./User";

// this is a join table
// user <--> Comment <--> post
@ObjectType()
@Entity()
export class Comment {
  // up or down
  @Field()
  @Property({ type: "string" })
  text: string;

  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  userId!: number;

  @Field(() => User)
  @ManyToOne(() => User, { inversedBy: (user: User) => user.comments })
  user: User;

  @Field()
  @Property()
  postId!: number;

  @Field({ nullable: true })
  @Property({ nullable: true })
  parentId: number;

  @Field(() => Post)
  @ManyToOne(() => Post, {
    inversedBy: (post: Post) => post.comments,
    cascade: [Cascade.REMOVE],
  })
  post: Post;

  @Field(() => [CommentUpvote], { nullable: true })
  @OneToMany(() => CommentUpvote, (upvote: CommentUpvote) => upvote.comment)
  upvotes: Collection<CommentUpvote> = new Collection<CommentUpvote>(this);

  @Field(() => Int)
  @Property({ default: 1 })
  score: number = 1;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null; // 1 if user has previously upvoted, -1 if user has previously downvoted, otehrwise null

  @Field(() => Comment, { nullable: true })
  @ManyToOne(() => Comment, { inversedBy: "children" })
  parent: Comment;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, "parent")
  children: Collection<Comment> = new Collection<Comment>(this);

  // @Field(() => new ArrayType(), { nullable: true})
  // childrens: Comment[]

  @Field()
  @Property({ defaultRaw: "now()" })
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date(), defaultRaw: "now()" })
  updatedAt: Date = new Date();

  @Field()
  @Property({ default: false })
  deleted: boolean = false;
}
