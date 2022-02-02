exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('weather').del()
    .then(function () {
      // Inserts seed entries
      return knex('weather').insert([
        {id: 1, name: 'Apple'},
        {id: 2, name: 'Banana'},
        {id: 3, name: 'Cherry'}
      ]);
    });
};
