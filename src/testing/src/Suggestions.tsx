import * as React from 'react';
import {useCallback, useEffect, useState} from "react";
import {CircularProgress, createStyles, makeStyles} from "@material-ui/core";
import {Movie} from "../../../server/get_suggestions";
import axios from "axios";
import Masonry from "react-masonry-component";
import {MovieCard, togglePresence} from "./SuggestionsForMovie";

const DARA_USER_ID = 0;

const useStyles = makeStyles(createStyles({
  masonry: {
    width: '100%',
  },
  card: {
    width: 194,
    margin: 8,
  },
  media: {
    height: 0,
    paddingTop: '150%', // 16:9
  },
  title: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
  },
  footer: {
    height: 250,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));

export function Suggestions() {
  const clx = useStyles();
  const [likes, setLikes] = useState<number[]>();
  const [dislikes, setDislikes] = useState<number[]>();
  const [suggestions, setSuggestions] = useState<Movie[]>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    async function getSuggestions() {
      const userPreferencesResponse = await axios
        .get<{ likes: number[]; dislikes: number[] }>(`/test-api/likesAndDislikes?userId=${DARA_USER_ID}`);
      setLikes(userPreferencesResponse.data.likes);
      setDislikes(userPreferencesResponse.data.dislikes);

      const suggestionsResponse = await axios.post<Movie[]>('/test-api/suggestions', { selected: userPreferencesResponse.data.likes, ignored: userPreferencesResponse.data.dislikes });
      setSuggestions(suggestionsResponse.data);
    }
    void getSuggestions();
  }, []);

  function toggleLike(movieId: number) {
    if (!likes.includes(movieId) && dislikes.includes(movieId)) {
      toggleDislike(movieId);
    }
    setLikes(prevState => togglePresence(prevState, movieId));
    if (likes.includes(movieId)) {
      axios.delete(`/test-api/likes/${movieId}?userId=${DARA_USER_ID}`)
        .catch(() => setLikes(prevState => togglePresence(prevState, movieId)))
    } else {
      axios.post(`/test-api/likes/${movieId}?userId=${DARA_USER_ID}`)
        .catch(() => setLikes(prevState => togglePresence(prevState, movieId)))
    }
  }

  function toggleDislike(movieId: number) {
    if (!dislikes.includes(movieId) && likes.includes(movieId)) {
      toggleLike(movieId);
    }
    setDislikes(prevState => togglePresence(prevState, movieId))
    if (likes.includes(movieId)) {
      axios.delete(`/test-api/dislikes/${movieId}?userId=${DARA_USER_ID}`)
        .catch(() => setDislikes(prevState => togglePresence(prevState, movieId)))
    } else {
      axios.post(`/test-api/dislikes/${movieId}?userId=${DARA_USER_ID}`)
        .catch(() => setDislikes(prevState => togglePresence(prevState, movieId)))
    }
  }

  const fetchMoreSuggestions = useCallback(async () => {
    setIsLoadingMore(true);
    const data = {
      selected: likes,
      ignored: (suggestions || []).filter(m => !likes.includes(m.id)).map(m => m.id)
    };
    const response = await axios.post(`/test-api/suggestions`, data)
    setSuggestions(prevState => [...(prevState || []), ...response.data]);
    setIsLoadingMore(false);
  }, [suggestions, setSuggestions, likes, dislikes]);

  useEffect(() => {
    function onScroll() {
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = document.documentElement.clientHeight;
      const viewportTop = document.documentElement.scrollTop;
      if (docHeight === viewportHeight + viewportTop) {
        void fetchMoreSuggestions();
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [fetchMoreSuggestions]);

  if (!suggestions) {
    return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <CircularProgress/>
      </div>
    )
  }

  return (
    <div>
      <h1>Suggestions for you</h1>
      <SuggestionList
        likes={likes}
        dislikes={dislikes}
        suggestions={suggestions}
        onLike={toggleLike}
        onDislike={toggleDislike}
      />
      <div className={clx.footer}>
        {isLoadingMore && <CircularProgress/>}
        <i>{isLoadingMore ? 'Loading more suggestions...' : 'Scroll for more suggestions'}</i>
      </div>
    </div>
  )
}

interface SuggestionListProps {
  likes: number[];
  dislikes: number[];
  suggestions: Movie[];
  onLike: (id: number) => void;
  onDislike: (id: number) => void;
}

function SuggestionList(props: SuggestionListProps) {
  const clx = useStyles();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', margin: '8px -8px' }}>
      <Masonry className={clx.masonry}>
        {props.suggestions.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            like={props.likes.includes(movie.id)}
            dislike={props.dislikes.includes(movie.id)}
            onLike={() => props.onLike(movie.id)}
            ondislikes={() => props.onDislike(movie.id)}
          />
        ))}
      </Masonry>
    </div>
  )
}
