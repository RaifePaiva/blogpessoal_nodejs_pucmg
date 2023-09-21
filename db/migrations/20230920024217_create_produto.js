/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("produtos", tbl => {
    tbl.increments ('id');
    tbl.text ("descricao", 100).notNullable;
    tbl.float ("valor", 18,2).notNullable;
    tbl.text ("marca", 100).notNullable;
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
