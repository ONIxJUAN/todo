import knex from "../lib/Knex.js";
import { Model } from "objection";

// instantiate the model
Model.knex(knex);

// import related models
import categories from "./categories.js";
import User from "./User.js";

export default class tasks extends Model {
  static get tableName() {
    return "tasks";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["task"],
      properties: {
        id: { type: "integer" },
        task: { type: "string", minLength: 1, maxLength: 55 },
        category: { type: "integer" },
        finished: { type: "boolean" },
      },
    };
  }

  static get relationMappings() {
    return {
      Cat: {
        relation: Model.BelongsToOneRelation,
        modelClass: categories,
        join: {
          from: "tasks.categorie",
          to: "categories.id",
        },
      },
      User: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "tasks.user",
          to: "users.id",
        },
      },
    };
  }
}
