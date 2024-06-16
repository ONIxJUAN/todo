import knex from "../lib/Knex.js";
import { Model } from "objection";

// instantiate the model
Model.knex(knex);

// import related models
import users from "./User.js";

export default class categories extends Model {
  static get tableName() {
    return "categories";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["categorie"],
      properties: {
        id: { type: "integer" },
        categorie: { type: "string", minLength: 1, maxLength: 55 },
        active: { type: "boolean" },
      },
    };
  }

  static get relationMappings() {
    return {
      userRelation: {
        relation: Model.BelongsToOneRelation,
        modelClass: users,
        join: {
          from: "categories.user",
          to: "users.id",
        },
      },
    }
  }
}
