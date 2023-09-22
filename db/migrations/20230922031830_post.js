/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("posts", tbl => {
        tbl.increments ('id');
        tbl.text("titulo", 150).notNullable;
        tbl.text ("conteudo", 1500).notNullable;
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("posts");
};
