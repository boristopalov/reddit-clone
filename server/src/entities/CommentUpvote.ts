import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Comment } from "./Comment";
import { User } from "./User";

// this is a join table
// user <--> upvote <--> post
@ObjectType()
@Entity()
export class CommentUpvote {
  // up or down
  @Property({ type: "int" })
  value: number;

  @Field()
  @PrimaryKey()
  userId!: number;

  @Field(() => User)
  @ManyToOne(() => User, { inversedBy: (user: User) => user.commentUpvotes })
  user: User;

  @Field()
  @PrimaryKey()
  commentId: number;

  @Field(() => Comment)
  @ManyToOne(() => Comment, {
    inversedBy: (comment: Comment) => comment.upvotes,
    cascade: [Cascade.REMOVE],
  })
  comment: Comment;
}
