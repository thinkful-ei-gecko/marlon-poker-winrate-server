'use strict';

const knex = require('knex');

const SessionsService = {
  getAllSessions(knex, user_id) {
    return knex('poker_sessions')
      .where('user_id', user_id)
    ;
  },
  getById(knex, id) {
    return knex
      .from('poker_sessions')
      .select('*')
      .where('id', id)
      .first();
  },
  deleteSession(knex, id){
    return knex('poker_sessions')
      .where({ id })
      .delete();
  },
  updateSession(knex, id, newSessionValues){
    return knex('poker_sessions')
      .where({ id })
      .update(newSessionValues)
      .returning('*')
      .then(rows => rows[0]);
  },
  addSession(knex, newSession){
    return knex
      .insert(newSession)
      .into('poker_sessions')
      .returning('*')
      .then(rows => rows[0]);
  }
};

module.exports = SessionsService;

