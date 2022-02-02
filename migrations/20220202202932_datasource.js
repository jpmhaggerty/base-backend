exports.up = function(knex) {
  return knex.schema.createTable('weather', tbl => {
    tbl.increments('id');
    tbl.string('name');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('weather')
};
