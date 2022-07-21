import { Migration } from "@mikro-orm/migrations";

export class Migration20220719154046 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "comment" ("id" serial primary key, "text" varchar(255) not null, "user_id" int4 not null, "post_id" int4 not null, "parent_id" int4 not null, "score" int4 not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);'
    );

    this.addSql(
      'create table "comment_upvote" ("user_id" int4 not null, "comment_id" int4 not null, "value" int4 not null);'
    );
    this.addSql(
      'alter table "comment_upvote" add constraint "comment_upvote_pkey" primary key ("user_id", "comment_id");'
    );

    this.addSql(
      'alter table "comment" add constraint "comment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "comment" add constraint "comment_post_id_foreign" foreign key ("post_id") references "post" ("id") on delete cascade;'
    );

    this.addSql(
      'alter table "comment_upvote" add constraint "comment_upvote_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "comment_upvote" add constraint "comment_upvote_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on delete cascade;'
    );
  }
}
