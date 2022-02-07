exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('weather').del()
    .then(function () {
      // Inserts seed entries
      return knex('weather').insert([
        {number: 1},
        {number: 2},
        {number: 3},
        {number: 4},
        {number: 5},
        {number: 6},
        {number: 7},
        {number: 8},
        {number: 9},
        {number: 10},
        {number: 11},
        {number: 12},
        {number: 13},
        {number: 14},
      ]);
    });
};
