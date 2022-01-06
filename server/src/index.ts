import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import "reflect-metadata";
// import { Post } from "./entities/Post";
import config from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";

const main = async () => { 
    // connect to database
    const orm = await MikroORM.init(config);

    // run migrations
    await orm.getMigrator().up();

    // creates an instance of post, doesn't add it to the database yet
    // const post = orm.em.create(Post, {title: 'My first post'});
    // adds post to the database
    // await orm.em.persistAndFlush(post); 

    const app = express();
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                HelloResolver, PostResolver
            ],
            validate: false,
            
        }),
        context: () => ({em: orm.em})
    });

    await apolloServer.start();
    // creates a graphql endpoint
    apolloServer.applyMiddleware({ app })

    app.listen(8080, () => { 
        console.log("listening on port 8080")
    })

    // console.log(await orm.em.find(Post, {}))
};

main();
