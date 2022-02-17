exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        {number: 1, name: 'R11A', rulevalue: '30' , ruleboundary: 'GT', uservalue: '21'},
        {number: 2, name: 'R11B', rulevalue: '10' , ruleboundary: 'GT', uservalue: '9'},
      ])
    });
};