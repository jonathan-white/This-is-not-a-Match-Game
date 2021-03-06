import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Intro from './components/Intro';
import Board from './components/Board';
import Footer from './components/Footer';
import images from './images.json';

const goodResponse = [
  "You guessed correctly!",
  "You're a natural!",
  "Keep it up!",
  "Your memory serves you well.",
  "Good job!"
];

const badResponse = [
  "You guessed incorrectly!",
  "So close, but that's not it!",
  "Better luck next time.",
  "You're running out of time...",
  "Don't click the same leaf twice!"
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images,
      clicked: [],
      score: 0,
      highScore: 0,
      correctChoice: null,
      counter: 60,
      shake: 0,
      status: 'Click a leaf below',
      statusClass: 'text-white',
      timeBonus: ''
    };
  }

  // reset the clicked array, score and shuffle images
  resetRound = () => {
    this.setState((prevState) => ({
      images: this.shuffleImages(prevState.images),
      clicked: [],
      score: 0,
    }));
  };

  // Reset the game if the clock runs out of time
  resetGame = () => {
    this.setState((prevState) => ({
      images: this.shuffleImages(prevState.images),
      clicked: [],
      score: 0,
      correctChoice: null,
      counter: 60,
      status: "Click a leaf below",
      statusClass: 'text-white',
      timeBonus: ''
    }));

    this.startCountdown();
  };

  winGame = () => {
    // Display celebration once the game has been won!
    this.setState({
      status: 'You Win!!!',
      statusClass: 'text-winner',
      timeBonus: 'increase-score',
    });
    this.stopCountdown();

    setTimeout(() => {
      this.setState((prevState) => {
        if((prevState.score * prevState.counter) >= prevState.highScore)
          return ({
              score: prevState.score * prevState.counter,
              highScore: prevState.score * prevState.counter
            })
        else
          return ({
              score: prevState.score * prevState.counter
            })
      });
    },3000);

    // Delay the start of the next game
    setTimeout(() => {
      this.resetGame();
    }, 5000);
  };

  correctGuess = () => {
    this.setState({
      correctChoice: true,
      shake: 0,
      status: goodResponse[Math.floor(Math.random() * goodResponse.length)],
      statusClass: 'text-white'
    });
  };

  incorrectGuess = () => {
    this.setState({
      correctChoice: false,
      shake: 1,
      status: badResponse[Math.floor(Math.random() * badResponse.length)],
      statusClass: 'text-danger'
    });
    this.resetRound();
  };

  handleClick = i => {
    const clickedItems = this.state.clicked;

    // If the player has already clicked the image reset the game
    if(clickedItems.includes(i)) {
      this.incorrectGuess();
      return;
    } else {
      this.correctGuess();

      // If score is at 11 and player has guessed correctly
      // the game has been won
      if(this.state.score === 11){
        this.winGame();
      }

      // Increment the score
      if (this.state.score >= this.state.highScore) {
        this.setState((prevState) => ({
          score: prevState.score + 1,
          highScore: prevState.highScore + 1
        }));
      } else {
        this.setState((prevState) => ({
          score: prevState.score + 1
        }));
      }
    };

    // record the index of the clicked image and reshuffle images
    this.setState((prevState) => ({
      clicked: [...clickedItems, i],
      images: this.shuffleImages(prevState.images)
    }));
  };

  // Shuffle image array
  shuffleImages = (arr) => (
    arr
      .map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1])
  );

  componentDidMount = () => {
    this.startCountdown();
  }

  componentWillUnmount = () => {
    clearInterval(this.timerID);
  }

  // Decrement the counter state
  decrement = () => {
    this.setState((prevState) => ({
      counter: (prevState.counter > 0) ? prevState.counter - 1 : 0,
      shake: 0
    }));

    if(this.state.counter === 0) {
      clearInterval(this.timerID);
      this.setState({
        shake: 1,
        status: "Time's up!",
        statusClass: 'text-white',
      });

      // Delay the start of the next game
      setTimeout(() => {
        this.resetGame();
      }, 4000);

      return;
    }
  }

  // Start the countdown clock
  startCountdown = () => {
    clearInterval(this.timerID);
    this.timerID = setInterval(
      () => this.decrement(),
      1000
    );
  }

  // Stop the countdown clock
  stopCountdown = () => {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <div className="App">
        <Navbar
          status={this.state.status}
          statusClass={this.state.statusClass}
          score={this.state.score}
          highScore={this.state.highScore}
          counter={this.state.counter}
          timeBonus={this.state.timeBonus}
        />
        <Intro />
        <Board
          images={this.state.images}
          onClick={this.handleClick}
          shake={this.state.shake}
          score={this.state.score}
          highScore={this.state.highScore}
        />
        <Footer
          counter={this.state.counter}
          timeBonus={this.state.timeBonus}
        />
        <div className="score">
  				<div className="score-round">Score: {this.state.score}</div>
  				<div className="score-highest">High: {this.state.highScore}</div>
  			</div>
      </div>
    );
  }
}

export default App;
