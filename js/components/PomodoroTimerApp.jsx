
'use strict';

var React = require('react');

var TimerStore = require('../stores/TimerStore.js');
var TimerActions = require('../actions/TimerActions.js');

var Timer = require('./Timer.jsx');
var ProgressBar = require('./ProgressBar.jsx');
var Input = require('react-bootstrap').Input;

module.exports = React.createClass({
  getInitialState: function() {
    return this.getState();
  },

  render: function(){
    var stopOrStartBtn = this.state.isCounting ? <Input type='submit' value='Stop' onClick={this.handleStop}/> :
                                          <Input type='submit' value='Start' onClick={this.handleStart}/>;

    return (
      <div className="pomodoro-timer-app">
        <h1>Pomodoro</h1>
        <Timer seconds={this.state.targetSeconds - this.state.elapsedSeconds}/>
        <ProgressBar/>

        {stopOrStartBtn}
        <Input type='submit' value='Skip' onClick={this.handleSkip}/>
      </div>
    );
  },

  handleStart: function(){
    TimerActions.start();
  },

  handleStop: function(){
    TimerActions.stop();
  },

  handleSkip: function(){
    TimerActions.skip();
  },

  componentDidMount: function(){
    TimerStore.addChangeListener(this.updateState);
  },

  componentWillUnmount: function(){
    TimerStore.removeChangeListener(this.updateState);
  },

  updateState: function(){
    this.setState(this.getState());
  },

  getState: function(){
    return {
      targetSeconds: TimerStore.getTargetSeconds(),
      elapsedSeconds: TimerStore.getElapsedSeconds(),

      isCounting: TimerStore.isCounting()
    };
  }
});

