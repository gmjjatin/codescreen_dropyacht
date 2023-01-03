import React, { Component } from 'react';
import Films from '../Films';
import { Router, Route } from 'react-router-dom';
import {createBrowserHistory} from 'history';
import './style.css';
const history = createBrowserHistory()

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { directorName: '' }
  }
  onChange = (e) => {
    this.setState({ directorName: e.target.value })
  }
  onSubmit = (e) => {
    e.preventDefault()
    if (this.state.directorName) {
      history.push(`/films/${this.state.directorName}`)
    }
  }
  render() {
    return <Router history={history}>
      <div>
        <p className="films-analysis-service">Films Analysis Service </p>
        {/* 
           TODO Navigate to the Films component, passing in the director name that was entered into the director name input box.
           This must be implemented as a Form. 
           The id of the form must be "input-form".
           The id of the director name input box must be "input-box".
           Note we use <div> below for display purposes only.
          */}
        <form action="" onSubmit={this.onSubmit} id="input-form" >
          <input id="input-box" placeholder="Enter director name" type="text" onChange={this.onChange} />
          <button type="submit" className="submit-button">SUBMIT</button>
        </form>
        <Route exact path='/films/:directorName' component={Films} />
      </div>
    </Router>
  }

}

export default App;