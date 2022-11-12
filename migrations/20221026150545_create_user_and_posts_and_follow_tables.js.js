/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("spotify_user_id").notNullable();
      table.string("name").notNullable();
      table.string("avatar_url");
      table.boolean("is_verified").defaultTo(false);
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("posts", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.string("song_id").notNullable();
      table.text("comment").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("posts").dropTable("users");
};
