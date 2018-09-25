class TimeLeft extends React.Component {
  render() {
    return (
      <div id="time-left">
        {this.props.minutesLeft < 10
          ? "0" + this.props.minutesLeft
          : this.props.minutesLeft}
        :
        {this.props.secondsLeft < 10
          ? "0" + this.props.secondsLeft
          : this.props.secondsLeft}
      </div>
    );
  }
}

class Break extends React.Component {
  render() {
    return <div id="break-length">{Number(this.props.breakLength)}</div>;
  }
}

class Session extends React.Component {
  render() {
    return <div id="session-length">{this.props.sessionLength}</div>;
  }
}

class Decrement extends React.Component {
  render() {
    return (
      <button onClick={this.props.onClick}>
        <i className="fas fa-angle-double-down" />
      </button>
    );
  }
}

class Increment extends React.Component {
  render() {
    return (
      <button onClick={this.props.onClick}>
        <i className="fas fa-angle-double-up" />
      </button>
    );
  }
}

class StartStop extends React.Component {
  render() {
    return (
      <button onClick={this.props.onClick}>
        <span>
          <i className="fas fa-play" />
        </span>
        <span>
          <i className="fas fa-pause" />
        </span>
      </button>
    );
  }
}

class Reset extends React.Component {
  render() {
    return (
      <button id="reset" onClick={this.props.onClick}>
        <i className="fas fa-sync-alt" />
      </button>
    );
  }
}

// class Audio extends React.Component {
//   render() {
//     return <audio id="beep" src={this.props.soundSrc} />;
//   }
// }

class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: true,
      minutesLeft: 25,
      secondsLeft: 0,
      breakLength: 5,
      sessionLength: 25,
      running: false
    };

    this.decrement = this.decrement.bind(this);
    this.increment = this.increment.bind(this);
    this.toggleStartStop = this.toggleStartStop.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.countdown(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  countdown() {
    if (this.state.running) {
      let seconds = this.state.secondsLeft;
      let minutes = this.state.minutesLeft;
      if (seconds == 0) {
        this.setState({
          secondsLeft: 59,
          minutesLeft: (this.state.minutesLeft -= 1)
        });
      } else {
        this.setState({
          secondsLeft: (this.state.secondsLeft -= 1)
        });
      }
      if (minutes == 0 && seconds == 0) {
        this.alarm();
        this.changeInterval();
      }
    }
  }

  alarm() {
    var beep = document.getElementById("beep");
    beep.play();
  }

  changeInterval() {
    if (this.state.session) {
      this.setState({
        session: !this.state.session,
        minutesLeft: this.state.breakLength,
        secondsLeft: 0
      });
    } else {
      this.setState({
        session: !this.state.session,
        minutesLeft: this.state.sessionLength,
        secondsLeft: 0
      });
    }
  }

  decrement(interval) {
    if (!this.state.running) {
      let minutes = this.state.sessionLength;
      switch (interval) {
        case "break":
          this.setState({
            breakLength: (this.state.breakLength -= 1)
          });
          break;
        case "session":
          this.setState({
            sessionLength: (minutes -= 1),
            minutesLeft: (this.state.sessionLength -= 1),
            secondsLeft: 0
          });
          break;
        default:
          console.log("Default");
      }
    }
  }

  increment(interval) {
    if (!this.state.running) {
      let minutes = this.state.sessionLength;
      switch (interval) {
        case "break":
          this.setState({
            breakLength: (this.state.breakLength += 1)
          });
          break;
        case "session":
          this.setState({
            sessionLength: (minutes += 1),
            minutesLeft: (this.state.sessionLength += 1),
            secondsLeft: 0
          });
          break;
        default:
          console.log("Default");
      }
    }
  }

  toggleStartStop() {
    this.setState({
      running: !this.state.running
    });
  }

  reset() {
    this.setState({
      session: true,
      minutesLeft: 25,
      secondsLeft: 0,
      breakLength: 5,
      sessionLength: 25,
      running: false
    });
  }

  render() {
    return (
      <div className="text-center" id="pomodoro-clock">
        <audio id="beep" src="sound/alarm.mp3" />
        <h1>Pomodoro Clock</h1>
        <div id="timer-label">
          {this.state.session ? "Session" : "Break"}
          <TimeLeft
            minutesLeft={this.state.minutesLeft}
            secondsLeft={this.state.secondsLeft}
          />
        </div>
        <div id="timer-controls">
          <div id="break-label">
            Break Length
            <Break breakLength={this.state.breakLength} />
            <div id="break-controls">
              <div id="break-decrement">
                <Decrement
                  onClick={
                    this.state.breakLength > 1
                      ? () => this.decrement("break")
                      : null
                  }
                />
              </div>
              <div id="break-increment">
                <Increment
                  onClick={
                    this.state.breakLength < 60
                      ? () => this.increment("break")
                      : null
                  }
                />
              </div>
            </div>
          </div>
          <div id="session-label">
            Session Length
            <Session sessionLength={this.state.sessionLength} />
            <div id="session-controls">
              <div id="session-decrement">
                <Decrement
                  onClick={
                    this.state.sessionLength > 1
                      ? () => this.decrement("session")
                      : null
                  }
                />
              </div>
              <div id="session-increment">
                <Increment
                  onClick={
                    this.state.sessionLength < 60
                      ? () => this.increment("session")
                      : null
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div id="controls">
          <div id="start_stop">
            <StartStop onClick={this.toggleStartStop} />
          </div>
          <div>
            <Reset onClick={this.reset} />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Pomodoro />, document.getElementById("root"));
