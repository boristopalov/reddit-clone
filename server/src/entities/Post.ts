import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Post {
  @Field( () => Int )
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  title!: string;

  @Field()
  @Property()
  createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

}