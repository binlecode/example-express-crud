
exports.seed = async function (knex) {
  try {
    // Deletes ALL existing entries
    await knex('notes').del();
    await knex('todos').del();

    // del or insert returns a promise
    const todoId = await knex('todos')
      .insert(
        { title: 'Fooo', completed: false },
        'id'
      );
      
    return knex('notes').insert([
      { todo_id: todoId, content: 'first note' },
      { todo_id: todoId, content: 'second note' }
    ]);
  } catch (err) {
    console.log(`Error seeding data: ${err}`);
  }
};
