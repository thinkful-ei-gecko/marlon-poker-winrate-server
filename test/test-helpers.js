'use strict';

function makeSessionsArray() {
  return [
    {
      id: 1,
      game_type_one: 'Live',
      game_type_two: 'Cash',
      date_played: '2019-10-21T10:11:16.285Z',
      small_blind: 1,
      big_blind: 2,
      buy_in: 200,
      cashed_out: 250,
      session_length: 4,
      notes: 'Notes 1'
    },
    {
      id: 2,
      game_type_one: 'Live',
      game_type_two: 'Cash',
      date_played: '2019-10-22T10:11:16.285Z',
      small_blind: 1,
      big_blind: 2,
      buy_in: 200,
      cashed_out: 300,
      session_length: 2,
      notes: 'Notes 1'
    },
    {
      id: 3,
      game_type_one: 'Live',
      game_type_two: 'Cash',
      date_played: '2019-10-23T10:11:16.285Z',
      small_blind: 1,
      big_blind: 2,
      buy_in: 200,
      cashed_out: 150,
      session_length: 3,
      notes: 'Notes 1'
    },
  ];
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      poker_sessions
      RESTART IDENTITY CASCADE`
  );
}

function seedSessions(db, sessions) {
  return db
    .insert(sessions)
    .into('poker_sessions');
}

module.exports = {
  makeSessionsArray,
  cleanTables,
  seedSessions,
};