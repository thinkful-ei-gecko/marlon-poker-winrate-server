'use strict';

const express = require('express');
const SessionsService = require('./sessions-service');
const sessionsRouter = express.Router();
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
  });

sessionsRouter
  .route('/:session_id')
  .all(checkSessionExists)
  .get((req, res) => {
    res.json(res.session);
  });

  
/* async/await syntax for promises */
async function checkSessionExists(req, res, next) {
  try {
    const session = await SessionsService.getById(
      req.app.get('db'),
      req.params.session_id
    )

    if (!session)
      return res.status(404).json({
        error: `Session doesn't exist`
      })

    res.session = session;
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = sessionsRouter;