const tableName = "tasks";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.string("task").notNullable();
    table.integer("categorie").notNullable().defaultTo(1);
    table.foreign("categorie").references("categories.id");
    table.boolean("finished").notNullable().defaultTo(0);
    table.integer("user").notNullable();
    table.foreign("user").references("users.id");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
