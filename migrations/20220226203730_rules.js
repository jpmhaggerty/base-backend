exports.up = function (knex) {
  return knex.schema.createTable("rules", (tbl) => {
    tbl.increments("number");
    tbl.string("name");
    tbl.string("startTime");
    tbl.string("endTime");
    tbl.boolean("isDaytime");
    tbl.integer("temperature");
    tbl.string("temperatureUnit");
    tbl.string("temperatureTrend");
    tbl.string("windSpeed");
    tbl.string("windDirection");
    tbl.string("icon", 512);
    tbl.string("shortForecast");
    tbl.string("detailedForecast", 2048);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("rules");
};
