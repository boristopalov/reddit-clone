import { Migration } from "@mikro-orm/migrations";

export class Migration20220721113408 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "comment" add column "deleted" bool not null default false;'
    );
  }
}
