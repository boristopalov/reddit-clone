import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import "reflect-metadata";
// import { Post } from "./entities/Post";
import config from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
const Redis = require("ioredis");
const session = require("express-session");
import { MyContext } from "./types";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";
import { COOKIE_NAME } from "./constants";
import { Redis } from "ioredis";
// import { Post } from "./entities/Post";

const main = async () => {
  const RedisStore = require("connect-redis")(session);
  const redisClient: Redis = new Redis();
  // connect to database
  const orm = await MikroORM.init(config);
  // orm.em.nativeDelete(Post, {});
  // sendEmail("boristopalov1@gmail.com", "hello!");

  // run migrations
  // const migrator = orm.getMigrator();
  // await migrator.up();

  const app = express();
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works with https (we use http in dev)
      },
      saveUninitialized: false,
      secret: "asdfiajsgei",
      resave: false,
    })
  );

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      em: orm.em,
      req,
      res,
      redis: redisClient,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await apolloServer.start();
  // creates a graphql endpoint
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(8080, () => {
    console.log("listening on port 8080");
  });
};

main();
