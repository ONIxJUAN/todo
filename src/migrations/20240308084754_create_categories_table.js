const tableName = "categories";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id").primary();
    table.string("categorie").notNullable();
    table.boolean("active").defaultTo("false");
    table.integer("user").unsigned().notNullable();
    table.foreign("user").references("id").inTable("users");
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
