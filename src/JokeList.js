import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

const JokeList = ({ numJokesToGet = 5 }) => {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /*gets jokes if there are no jokes present */

  useEffect(() => {
    async function getJokes() {
      let j = [...jokes];
      let seenJokes = new Set();

      try {
        while (j.length < numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com/", {
            headers: { Accept: "application/json" }
          });
          let { status, ...jokeObj } = res.data;

          if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            j.push({ ...jokeObj, votes: 0 });
          }
          else {
            console.error("duplicate found");
          }
        }
        setJokes(j);
        setIsLoading(false);
      }
      catch (err) {
        console.error(err);
      }
    }
  
    if (jokes.length === 0) getJokes();
  }, [jokes, numJokesToGet]);

  /* empties joke list and afterwards calls getJokes*/

  const generateNewJokes = () => {
    setIsLoading(true);
    setJokes([]);
  };

  /* change vote for this id by +1 delta or -1 delta */

  const vote =(id, delta) => {
    setJokes(jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j)));
  }

  /* render joke list */

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
      )
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
        </button>

      {sortedJokes.map(({joke, id, votes}) => (
        <Joke text={joke} key={id} id={id} votes={votes} vote={vote} />
      ))}
    </div>
  );
}

export default JokeList;