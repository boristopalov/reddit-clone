import { Migration } from "@mikro-orm/migrations";

export class Migration20220719160500 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "comment" drop constraint if exists "comment_parent_id_check";'
    );
    this.addSql(
      'alter table "comment" alter column "parent_id" type int4 using ("parent_id"::int4);'
    );
    this.addSql(
      'alter table "comment" alter column "parent_id" drop not null;'
    );
    this.addSql(
      'alter table "comment_upvote" drop constraint if exists "comment_upvote_value_check";'
    );
    this.addSql(
      'alter table "comment_upvote" drop constraint if exists "comment_upvote_comment_id_check";'
    );
    this.addSql(
      'alter table "comment_upvote" alter column "comment_id" type int4 using ("comment_id"::int4);'
    );
  }
}
