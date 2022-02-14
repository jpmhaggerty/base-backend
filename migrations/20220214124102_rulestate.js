exports.up = function(knex) {
  return knex.schema.createTable('rulestate', tbl => {
    tbl.increments('number');
    tbl.string('name');
    tbl.string('dtg');
    tbl.integer('attr1');
    tbl.integer('attr2');
    tbl.integer('attr3');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('rulestate')
};
