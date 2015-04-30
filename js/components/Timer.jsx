
'use strict';

var React = require('react');

module.exports = React.createClass({
  getDefaultProps: function(){
    return {
      seconds: 0
    };
  },

  render: function(){
    var minutes = Math.floor(this.props.seconds / 60);
    var seconds = this.props.seconds % 60;
    var minutesStr = minutes >= 10 ? minutes.toString() : '0' + minutes;
    var secondsStr = seconds >= 10 ? seconds.toString() : '0' + seconds;

    return (
      <div className="timer">
        <span className="timer-minutes">{minutesStr}</span>
        <span className="timer-separator">:</span>
        <span className="timer-seconds">{secondsStr}</span>
      </div>
    );
  }
});
