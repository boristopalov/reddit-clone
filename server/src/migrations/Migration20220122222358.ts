import { Migration } from "@mikro-orm/migrations";

export class Migration20220122222358 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "upvote" ("user_id" int4 not null, "post_id" int4 not null, "value" int4 not null);'
    );
    this.addSql(
      'alter table "upvote" add constraint "upvote_pkey" primary key ("user_id", "post_id");'
    );

    this.addSql(
      'alter table "upvote" add constraint "upvote_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "upvote" add constraint "upvote_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;'
    );
  }
}
