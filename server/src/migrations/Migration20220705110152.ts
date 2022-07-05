import { Migration } from "@mikro-orm/migrations";

export class Migration20220705110152 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "post" alter column "subreddit" set not null;');
  }
}
