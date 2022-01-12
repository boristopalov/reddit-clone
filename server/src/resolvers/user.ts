import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Resolver,
  Ctx,
  Arg,
  Field,
  Mutation,
  Query,
  ObjectType,
} from "type-graphql";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
// promisify scrypt so we can use await syntax instead of callback
const scryptAsync = promisify(scrypt);

import { COOKIE_NAME } from "../constants";
import UsernamePasswordInput from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";

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
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Ctx() { em }: MyContext
  ) {}
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    // not logged in
    if (!req.session.userId) {
      return null;
    }
    // if the user has a cookie they are logged in
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("input", () => UsernamePasswordInput) input: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const errors = await validateRegister(input);
    if (errors) {
      return { errors };
    }

    const salt = randomBytes(16).toString("hex");
    const buffer = (await scryptAsync(input.password, salt, 64)) as Buffer;
    const hashedPassword = `${salt}.${buffer.toString("hex")}`;
    const user = em.create(User, {
      username: input.username,
      password: hashedPassword,
      email: input.email,
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      console.error(err);
      if (err.code === "23505") {
        // trying to register an existing username
        return {
          errors: [
            {
              field: "username",
              message: "username is already taken",
            },
          ],
        };
      }
    }

    // when someone registers, the server sets a cookie which will log them in automatically
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async loginUser(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(
      User,
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
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
    const derivedBuffer = (await scryptAsync(password, salt, 64)) as Buffer;
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
    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Query(() => [User])
  getUsers(@Ctx() { em }: MyContext) {
    return em.find(User, {});
  }

  @Mutation(() => Boolean)
  logoutUser(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((e) => {
        res.clearCookie(COOKIE_NAME);
        if (e) {
          console.error(e);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
