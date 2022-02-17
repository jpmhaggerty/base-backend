exports.up = function(knex) {
  return knex.schema.createTable('user', tbl => {
    tbl.increments('number');
    tbl.string('name');
    tbl.datetime('dtg', {precision: 6}).defaultTo(knex.fn.now(6));
    tbl.string('rulevalue');
    tbl.string('ruleboundary');
    tbl.string('uservalue');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user')
};
