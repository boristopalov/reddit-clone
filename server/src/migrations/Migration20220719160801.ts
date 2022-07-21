import { Migration } from "@mikro-orm/migrations";

export class Migration20220719160801 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "comment" alter column "score" set default 1;');
  }
}
