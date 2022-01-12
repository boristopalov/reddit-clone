import { InputType, Field } from "type-graphql";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
  @Field()
  email: string;
}

export default UsernamePasswordInput;
