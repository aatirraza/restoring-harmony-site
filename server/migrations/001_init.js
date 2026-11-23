// Tables: leads, events, admins.

export async function up(knex) {
  await knex.schema.createTable('leads', (t) => {
    t.increments('id').primary();
    t.string('name', 120).notNullable();
    t.string('email', 254).notNullable();
    // Which option on the unlock page the visitor picked: see LEAD_CHOICES in server/validate.js.
    t.string('choice', 20).notNullable();
    t.string('visitor_id', 36);
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.index(['created_at']);
    t.index(['email']);
  });

  // One row per (visitor, event name). Names look like "egg:beam" or "coin:3".
  await knex.schema.createTable('events', (t) => {
    t.increments('id').primary();
    t.string('visitor_id', 36).notNullable();
    t.string('name', 40).notNullable();
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.unique(['visitor_id', 'name']);
    t.index(['name']);
  });

  await knex.schema.createTable('admins', (t) => {
    t.increments('id').primary();
    t.string('email', 254).notNullable().unique();
    t.string('password_hash', 255).notNullable();
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.timestamp('last_login_at');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('admins');
  await knex.schema.dropTableIfExists('events');
  await knex.schema.dropTableIfExists('leads');
}
