import React, { Component } from 'react';
import { Grommet } from 'grommet';

class App extends Component {
  render() {
    return (
	  <Grommet plain>
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </Grommet>
    );
  }
}

export default App;
