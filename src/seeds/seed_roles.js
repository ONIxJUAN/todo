const tableName = "roles";

const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(tableName).del();
  await knex(tableName).insert([
    { id: 1, name: "Admin" },
    { id: 2, name: "Customer" },
    
  ]);
};

export { seed };
