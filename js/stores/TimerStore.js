

'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TimerActions = require('../actions/TimerActions');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;


var CHANGE_EVENT = 'change';

var Status = {
  FOCUS: 'FOCUS',
  FOCUSING: 'FOCUSING',
  REST: 'REST',
  RESTING: 'RESTING',

  SEQUENCES: [
    'FOCUS',
    'FOCUSING',
    'REST',
    'RESTING'
  ],

  status: 'FOCUS',
  paused: false,

  next: function(){
    var nextIndex = (this.SEQUENCES.indexOf(this.status) + 1) % this.SEQUENCES.length;
    this.status = this.SEQUENCES[nextIndex];
    return this.status;
  },

  prev: function(){
    var curIndex = this.SEQUENCES.indexOf(this.status);
    if(curIndex === 0){
      return null;
    }

    this.status = this.SEQUENCES[curIndex - 1];
    return this.status;
  },

  getStatus: function(){
    return this.status;
  },

  isInRestSection: function(){
    return this.getStatus().indexOf('REST') !== -1;
  },

  isInFocusSection: function(){
    return this.getStatus().indexOf('FOCUS') !== -1;
  }
};


var MINUTES = 60;
var FOCUS_SECONDS = 25 * MINUTES;
var SHORT_REST_SECONDS = 5 * MINUTES;
var LONG_REST_SECONDS = 15 * MINUTES;
var MAX_SHORT_REST_COUNT = 4;

var targetSeconds = FOCUS_SECONDS;
var elapsedSeconds = 0;
var timerId;
var shortRestCount = 0;


var TimerStore = assign({}, EventEmitter.prototype, {
  getElapsedSeconds: function(){
    return elapsedSeconds;
  },
  getTargetSeconds: function(){
    return targetSeconds;
  },

  isCounting: function(){
    return !!timerId;
  },
  isInRestSection: function(){
    return Status.isInRestSection();
  },
  isInFocusSection: function(){
    return Status.isInFocusSection();
  },

  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },
  emitChange: function(callback){
    this.emit(CHANGE_EVENT);
  }
});

function start(){
  if(TimerStore.isCounting()){
    return;
  }

  Status.next();
  elapsedSeconds = 1;
  updateTargetSeconds();

  timerId = setInterval(function(){
    elapsedSeconds++;
    if(elapsedSeconds > targetSeconds){
      stop();
    }else{
      TimerStore.emitChange();
    }
  }, 1000);

  TimerStore.emitChange();
}
function stop(){
  if(!TimerStore.isCounting()){
    return;
  }

  clearInterval(timerId);
  timerId = null;
  elapsedSeconds = 0;
  Status.prev();

  TimerStore.emitChange();
}
function skip(){
  stop();
  Status.next();
  Status.next();
  updateTargetSeconds();
  TimerStore.emitChange();
}

function updateTargetSeconds(){
  if(TimerStore.isInRestSection()){
    shortRestCount++;
    if(shortRestCount > MAX_SHORT_REST_COUNT){
      shortRestCount = 0;
      targetSeconds = LONG_REST_SECONDS;
    }else{
      targetSeconds = SHORT_REST_SECONDS;
    }
  }else{
    targetSeconds = FOCUS_SECONDS;
  }
}

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case TimerActions.START:
      start();
      break;
    case TimerActions.STOP:
      stop();
      break;
    case TimerActions.SKIP:
      skip();
      break;

    default:
  }
});

module.exports = TimerStore;
