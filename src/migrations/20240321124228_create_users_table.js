const tableName = "users";

export function up(knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments("id");
    table.string("firstname", 255).notNullable();
    table.string("lastname", 255).notNullable();
    table.string("email", 255).notNullable();
    table.string("password", 255).notNullable();
    table.integer("role_id").unsigned().notNullable();
    table.foreign("role_id").references("roles.id");
    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTable(tableName);
}
