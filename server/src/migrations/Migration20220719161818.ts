import { Migration } from "@mikro-orm/migrations";

export class Migration20220719161818 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "comment" alter column "created_at" set default now();'
    );
    this.addSql(
      'alter table "comment" alter column "updated_at" set default now();'
    );
  }
}
