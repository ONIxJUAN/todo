const tableName = "categories";

const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(tableName).del();
  await knex(tableName).insert([
    { id: 1, categorie: "default", active: 1, user: 1},
    { id: 2, categorie: "household", active: 0, user: 1},
    { id: 3, categorie: "default", active: 1, user: 2},
    { id: 4, categorie: "household", active: 0, user: 2},
    { id: 5, categorie: "default", active: 1, user: 3},
    { id: 6, categorie: "household", active: 0, user: 3},
  ]);
};

export { seed };
