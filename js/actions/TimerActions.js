'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');


var TimerActions = {
  START: 'TIMER_START',
  STOP: 'TIMER_STOP',
  SKIP: 'TIMER_SKIP',

  start: function(){
    AppDispatcher.dispatch({
      actionType: TimerActions.START
    });
  },

  stop: function(){
    AppDispatcher.dispatch({
      actionType: TimerActions.STOP
    });
  },

  skip: function(){
    AppDispatcher.dispatch({
      actionType: TimerActions.SKIP
    });
  }
};

module.exports = TimerActions;
