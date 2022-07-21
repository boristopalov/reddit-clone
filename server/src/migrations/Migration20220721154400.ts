import { Migration } from "@mikro-orm/migrations";

export class Migration20220721154400 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "comment" add column "username" varchar(255) not null;'
    );
  }
}
