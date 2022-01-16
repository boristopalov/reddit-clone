import { Migration } from "@mikro-orm/migrations";

export class Migration20220116021126 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" serial primary key, "username" text not null, "password" text not null, "email" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);'
    );
    this.addSql(
      'alter table "user" add constraint "user_username_unique" unique ("username");'
    );
    this.addSql(
      'alter table "user" add constraint "user_password_unique" unique ("password");'
    );
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");'
    );

    this.addSql(
      'create table "post" ("id" serial primary key, "title" varchar(255) not null, "text" varchar(255) not null, "score" int4 not null, "creator_id" int4 not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);'
    );

    this.addSql(
      'alter table "post" add constraint "post_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade;'
    );
  }
}
