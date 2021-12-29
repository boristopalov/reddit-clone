import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import config from "./mikro-orm.config";
import express from "express";

const main = async () => { 
    // connect to database
    const orm = await MikroORM.init(config);

    // run migrations
    orm.getMigrator().up();

    // creates an instance of post, doesn't add it to the database yet
    // const post = orm.em.create(Post, {title: 'My first post'});
    // adds post to the database
    // await orm.em.persistAndFlush(post); 

    const app = express();

    app.get("/", (_, res) => { 
        res.send("hello")
    })

    app.listen(8080, () => { 
        console.log("listening on port 8080")
    })

    // console.log(await orm.em.find(Post, {}))
};

main();
