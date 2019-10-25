'use strict';

const express = require('express');
const SessionsService = require('./sessions-service');
const sessionsRouter = express.Router();
const xss = require('xss');
const jsonParser = express.json();

sessionsRouter
  .route('/')
  .get((req, res, next) => {
    SessionsService.getAllSessions(
      req.app.get('db')
    )
      .then(sessions => {
        res.json(sessions);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {game_type_one, game_type_two, small_blind, big_blind, buy_in, cashed_out, session_length, notes} = req.body;
    const newSession = {game_type_one, game_type_two, small_blind, big_blind, buy_in, cashed_out, session_length, notes};

    SessionsService.addSession(
      req.app.get('db'),
      newSession
    )
    .then(session => {
      res
        .status(201)
        .json({
          id: session.session_id,
          game_type_one: session.game_type_one,
          game_type_two: session.game_type_two,
          date_played: session.date_played,
          small_blind: session.small_blind,
          big_blind: session.big_blind,
          buy_in: session.buy_in,
          cashed_out: session.cashed_out,
          session_length: session.session_length,
          notes: xss(session.notes)
        })
    })
    .catch(next)
  })


sessionsRouter
  .route('/:session_id')
  .all(checkSessionExists)
  .get((req, res) => {
    res.json({
      id: res.session.session_id,
      game_type_one: res.session.game_type_one,
      game_type_two: res.session.game_type_two,
      date_played: res.session.date_played,
      small_blind: res.session.small_blind,
      big_blind: res.session.big_blind,
      buy_in: res.session.buy_in,
      cashed_out: res.session.cashed_out,
      session_length: res.session.session_length,
      notes: xss(res.session.notes)
    });
  })  

  .delete((req, res, next) => {
    req.app.get('db')
    SessionsService.deleteSession(
      req.app.get('db'),
      req.params.session_id
    )
    .then(() => {
      res.status(204).end()
    })
    .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    console.log('Test')
    const {game_type_one, small_blind, big_blind, buy_in, cashed_out, session_length, notes} = req.body;
    const sessionToUpdate = {game_type_one, small_blind, big_blind, buy_in, cashed_out, session_length, notes}

    SessionsService.updateSession(
      req.app.get('db'),
      req.params.session_id,
      sessionToUpdate
      )
      .then(session => {
        res.status(200).json({
          id: session.session_id,
          game_type_one: session.game_type_one,
          game_type_two: session.game_type_two,
          date_played: session.date_played,
          small_blind: session.small_blind,
          big_blind: session.big_blind,
          buy_in: session.buy_in,
          cashed_out: session.cashed_out,
          session_length: session.session_length,
          notes: xss(session.notes)
        })
      })
      .catch(next)
  });

async function checkSessionExists(req, res, next) {
  try {
    const session = await SessionsService.getById(
      req.app.get('db'),
      req.params.session_id
    )
    console.log(session)
    if (!session)
      return res.status(404).json({
        error: `Session doesn't exist`
      })

    res.session = session;
    next()
  } catch (error) {
    console.log(error)
    next(error)
  }
}

module.exports = sessionsRouter;