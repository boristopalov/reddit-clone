import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Field, Int, ObjectType, Root } from "type-graphql";
import { Upvote } from "./Upvote";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  title!: string;

  @Field()
  @Property()
  text!: string;

  @Field(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Field(() => Int)
  @Property()
  score: number = 1;

  @Field(() => [Upvote], { nullable: true })
  @OneToMany(() => Upvote, (upvote: Upvote) => upvote.post)
  upvotes: Collection<Upvote> = new Collection<Upvote>(this);

  @Field(() => Int, { nullable: true })
  voteStatus: number | null; // 1 if user has previously upvoted, -1 if user has previously downvoted, otehrwise null

  @Field()
  @ManyToOne(() => User)
  creator: User;

  @Field()
  @Property()
  creatorId!: number;

  @Field()
  @Property()
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
