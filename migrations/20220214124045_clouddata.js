exports.up = function(knex) {
  return knex.schema.createTable('clouddata', tbl => {
    tbl.increments('number');
    tbl.string('name');
    tbl.string('dtg');
    tbl.integer('latitude');
    tbl.integer('longitude');
    tbl.integer('disttofp');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('clouddata')
};
