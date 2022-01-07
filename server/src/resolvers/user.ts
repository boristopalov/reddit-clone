import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Resolver,
  Ctx,
  Arg,
  InputType,
  Field,
  Mutation,
  Query,
  ObjectType,
} from "type-graphql";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// promisify scrypt so we can use await syntax instead of callback
const scryptAsync = promisify(scrypt);

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

// if username or password is wrong
@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("input", () => UsernamePasswordInput) input: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {


    if (input.username.length <= 3) {
      return {
        errors: [
          {
            field: "username",
            message: "username must be longer than 3 characters!",
          },
        ],
      };
    }
    if (input.password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "password must be longer than 3 characters!",
          },
        ],
      };
    }
    const salt = randomBytes(16).toString("hex");
    const buffer = (await scryptAsync(input.password, salt, 64)) as Buffer;
    const hashedPassword = `${salt}.${buffer.toString("hex")}`;
    const user = em.create(User, {
      username: input.username,
      password: hashedPassword,
    });
    try { 

      await em.persistAndFlush(user);
    }
    catch (err)  {
      if (err.code === '2305') { 
        // trying to register an existing username
        return { 
          errors: [
            { 
              field: "username",
              message: "username is already taken"
            }
          ]
        }
      }
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async loginUser(
    @Arg("input", () => UsernamePasswordInput) input: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: input.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "an account with that username does not exist",
          },
        ],
      };
    }
    const [salt, hashedPassword] = user.password.split(".");
    const keyBuffer = Buffer.from(hashedPassword, "hex");
    const derivedBuffer = (await scryptAsync(input.password, salt, 64)) as Buffer;
    // compare the new supplied password with the stored hashed password
    if (!timingSafeEqual(keyBuffer, derivedBuffer)) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }
    return {
      user,
    };
  }

  @Query(() => [User])
  getUsers(@Ctx() { em }: MyContext) {
    return em.find(User, {});
  }
}
