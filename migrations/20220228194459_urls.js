exports.up = function (knex) {
  return knex.schema.createTable("urls", (tbl) => {
    tbl.increments("number");
    tbl.string("cloudurl", 1024);
    tbl.integer("cloudperiod");
    tbl.string("lightningurl", 1024);
    tbl.integer("lightningperiod");
    tbl.string("millurl", 1024);
    tbl.integer("millperiod");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("urls");
};
