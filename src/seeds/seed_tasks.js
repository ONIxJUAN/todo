const tableName = "tasks";

const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(tableName).del();
  await knex(tableName).insert([
    { id: 1, task: "finish this project", finished: 0, categorie: 1, user: 1 },
    { id: 2, task: "Make dinner", finished: 0, categorie: 1, user: 1 },
    { id: 3, task: "Walk the dog", finished: 0, categorie: 1, user: 1 },
    { id: 4, task: "iets", finished: 1, categorie: 1, user: 1 },
    { id: 5, task: "sleep", finished: 0, categorie: 1, user: 1 },
    { id: 6, task: "Do the laundry", finished: 0, categorie: 2, user: 1 },
    { id: 7, task: "finish this project", finished: 0, categorie: 3, user: 2 },
    { id: 8, task: "Make dinner", finished: 0, categorie: 3, user: 2 },
    { id: 9, task: "Walk the dog", finished: 0, categorie: 3, user: 2 },
    { id: 10, task: "iets", finished: 1, categorie: 3, user: 2 },
    { id: 11, task: "sleep", finished: 0, categorie: 3, user: 2 },
    { id: 12, task: "Do the laundry", finished: 0, categorie: 4, user: 2 },
  ]);
};

export { seed };
