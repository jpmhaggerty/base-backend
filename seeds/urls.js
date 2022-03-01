/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("urls")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("urls").insert([
        {
          number: 1,
          cloudurl: "https://api.weather.gov/gridpoints/MLB/46,69/forecast",
          cloudperiod: 10000,
          lightningurl: "https://api.weather.gov/gridpoints/MLB/51,69/forecast",
          lightningperiod: 10000,
          millurl: "https://api.weather.gov/gridpoints/MLB/56,69/forecast",
          millperiod: 10000,
        },
      ]);
    });
};
