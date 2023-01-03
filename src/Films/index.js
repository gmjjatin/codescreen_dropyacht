import React, { Component } from 'react';
import './style.css';

const axios = require('axios');

const filmsEndpointURL = "https://app.codescreen.com/api/assessments/films";

//Your API token. This is needed to successfully authenticate when calling the films endpoint. 
//This needs to be added to the Authorization header (using the Bearer authentication scheme) in the request you send to the films endpoint.
const apiToken = "8c5996d5-fb89-46c9-8821-7063cfbc18b1"

const headers = {
  Authorization: apiToken
}

export default class Films extends Component {
  constructor(props) {
    super(props)
    this.state = { filmsByDirectorName: [],loading:true }
    const { directorName } = this.props.match.params;
    if (directorName) {
      this.fetchFilms(directorName)
    }
  }
  //TODO Retrieve the director name passed to this component after clicking the Submit button, and use it to query the 
  componentDidUpdate(prevProps) {
    const { directorName } = this.props.match.params;
    if (prevProps.match.params.directorName !== directorName) {
      this.fetchFilms(directorName)
    }
  }
  //Films API endpoint. The director name needs to be passed into the films endpoint as a query param called 
  //directorName.
  fetchFilms = (directorName) => {
    this.setState(state => ({ ...state, loading: true }))
    axios.get(filmsEndpointURL, {
      params: {
        directorName: decodeURIComponent(directorName)
      }, headers
    }).then(resp => {
      this.setState({ loading: false,filmsByDirectorName: resp.data })
    }).catch(e => {
      console.log(e);
      this.setState(state => ({ ...state, loading: false }))
    })
  }

  render() {
    const { filmsByDirectorName, loading } = this.state;
    return (
      <div className="stats-boxes">
        <div className="stats-box-row">
          <div className="stats-box">
            <div className="stats-box-heading">Best rated film</div>
            <div id="best-rated-film" className="stats-box-info">
              {loading || this.getBestRatedFilm(filmsByDirectorName)}
            </div>
          </div>
          <div className="stats-box-right stats-box">
            <div className="stats-box-heading">Longest film duration</div>
            <div id="longest-film" className="stats-box-info">
              {loading || this.getLongestFilm(filmsByDirectorName)}
            </div>
          </div>
        </div>
        <div className="stats-box-row">
          <div className="stats-box">
            <div className="stats-box-heading">Average rating</div>
            <div id="average-rating" className="stats-box-info">
              {loading || this.getAverageRating(filmsByDirectorName)}
            </div>
          </div>
          <div className="stats-box-right stats-box">
            <div className="stats-box-heading">Shortest days between releases</div>
            <div id="shortest-days" className="stats-box-info">
              {loading || this.getShortestNumberOfDaysBetweenFilmReleases(filmsByDirectorName)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
    * Retrieves the name of the best rated film from the given list of films.
    * If the given list of films is empty, this method should return "N/A".
  */
  getBestRatedFilm(films) {
    //TODO Implement
    if (!films.length) return 'N/A';
    return films.reduce((prev, next) => prev.rating > next.rating ? prev : next).name

  }

  /**
    * Retrieves the length of the film which has the longest running time from the given list of films.
    * If the given list of films is empty, this method should return "N/A".
    * 
    * The return value from this function should be in the form "{length} mins"
    * For example, if the duration of the longest film is 120, this function should return "120 mins".
  */
  getLongestFilm(films) {
    //TODO Implement
    if (!films.length) return 'N/A';
    return `${films.reduce((prev, next) => prev.length > next.length ? prev : next).length} mins`
  }

  /**
    * Retrieves the average rating for the films from the given list of films, rounded to 1 decimal place.
    * If the given list of films is empty, this method should return 0.
  */
  getAverageRating(films) {
    //TODO Implement
    if (!films.length) return '0';
    return (films.reduce((prev, next) => prev + next.rating, 0) / films.length).toFixed(1)
  }

  /**
    * Retrieves the shortest number of days between any two film releases from the given list of films.
    * 
    * If the given list of films is empty, this method should return "N/A".
    * If the given list contains only one film, this method should return 0.
    * Note that no director released more than one film on any given day.
    * 
    * For example, if the given list is composed of the following 3 entries
    *
    * {
    *    "name": "Batman Begins",
    *    "length": 140,
    *
    *    "rating": 8.2,
    *    "releaseDate": "2006-06-16",
    *    "directorName": "Christopher Nolan"
    * },
    * {
    *    "name": "Interstellar",
    *    "length": 169,
    *    "rating": 8.6,
    *    "releaseDate": "2014-11-07",
    *    "directorName": "Christopher Nolan"
    * },
    * {
    *   "name": "Prestige",
    *   "length": 130,
    *   "rating": 8.5,
    *   "releaseDate": "2006-11-10",
    *   "directorName": "Christopher Nolan"
    * }
    *
    * then this method should return 147, as Prestige was released 147 days after Batman Begins.
  */
  getShortestNumberOfDaysBetweenFilmReleases(films) {
    //TODO Implement
    if (!films.length) return 'N/A';
    films.sort((prev, next) => new Date(prev.releaseDate) - new Date(next.releaseDate))
    let min = Infinity;
    for (let i = 1; i < films.length; i++) {
      min = Math.min(min, getDateDifferenceInDays(films[i].releaseDate, films[i - 1].releaseDate))
    }
    return min
  }

}
const getDateDifferenceInDays = (d1String, d2String) => {
  const date1 = new Date(d1String);
  const date2 = new Date(d2String);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}