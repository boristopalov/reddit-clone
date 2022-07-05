import { Migration } from "@mikro-orm/migrations";

export class Migration20220704224731 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "post" add column "subreddit" varchar(255);');
    this.addSql(`update "post" set "subreddit" = 'testsub';`);
  }
}
