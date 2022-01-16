import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { Post } from "./Post";

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

  @Field()
  @Property()
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
