exports.up = function(knex) {
  return knex.schema.createTable('fieldmills', tbl => {
    tbl.increments('number');
    tbl.string('name');
    tbl.string('dtg');
    tbl.integer('latitude');
    tbl.integer('longitude');
    tbl.integer('fieldstrength');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('fieldmills')
};
