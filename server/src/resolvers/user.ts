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
  FieldResolver,
  Root,
} from "type-graphql";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
// promisify scrypt so we can use await syntax instead of callback
const scryptAsync = promisify(scrypt);

import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import UsernamePasswordInput from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";

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

@Resolver(() => User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    // if logged in user is the user getting fetched
    if (req.session.userId === user.id) {
      return user.email;
    }
    return "";
  }

  @Mutation(() => UserResponse)
  async resetPassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { em: oldEm, redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 3) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "password must be longer than 3 characters!",
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "reset password link is expired",
          },
        ],
      };
    }
    await redis.del(key);
    const em = oldEm.fork();
    const user = await em.findOne(User, { id: parseInt(userId) });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }
    const salt = randomBytes(16).toString("hex");
    const buffer = (await scryptAsync(newPassword, salt, 64)) as Buffer;
    const hashedPassword = `${salt}.${buffer.toString("hex")}`;
    user.password = hashedPassword;
    await em.persistAndFlush(user);

    // log the user in after they reset the password
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Ctx() { em: oldEm, redis }: MyContext
  ) {
    const em = oldEm.fork();
    const user = await em.findOne(
      User,
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
    // return true so that a user can't abuse and search for emails until it works
    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24
    );

    await sendEmail(
      user.email,
      `<a href="http://localhost:3000/resetpass/${token}"> Reset password </a>`
    );
    return true;
  }
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em: oldEm, req }: MyContext) {
    // not logged in
    if (!req.session.userId) {
      return null;
    }
    const em = oldEm.fork();
    // if the user has a cookie they are logged in
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("input", () => UsernamePasswordInput) input: UsernamePasswordInput,
    @Ctx() { em: oldEm, req }: MyContext
  ): Promise<UserResponse> {
    const em = oldEm.fork();
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
    @Ctx() { em: oldEm, req }: MyContext
  ): Promise<UserResponse> {
    const em = oldEm.fork();
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
            field: "usernameOrEmail",
            message: "an account with that username or email does not exist",
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
  getUsers(@Ctx() { em: oldEm }: MyContext) {
    const em = oldEm.fork();
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
