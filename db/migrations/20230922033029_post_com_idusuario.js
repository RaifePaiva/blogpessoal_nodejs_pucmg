/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable("posts", tbl => {
        tbl.integer('fk_usuario').nullable;
    }).createTable("usuarios", tbl =>{
        tbl.increments('id');
        tbl.text('login');
        tbl.text('nome');
        tbl.text('senha');
        tbl.text('perfil');
    }).table('posts', (table) => {
        table.foreign('fk_usuario').references('usuarios.id')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
