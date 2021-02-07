
exports.up = function (knex) {
    // migration functions must return a promise in order to work correctly
    return knex.schema
        .createTable('todos', function (table) {
            table.increments('id').primary();
            table.string('title');
            table.boolean('completed');

            table.timestamps(true, true);
        })
        .createTable('notes', function (table) {
            table.increments('id').primary();
            table.string('content');
            table.integer('todo_id').unsigned()
            table.foreign('todo_id')
                .references('todos.id');

            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTable('todos')
        .dropTable('notes');
};
