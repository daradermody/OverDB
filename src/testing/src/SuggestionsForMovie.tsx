import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, createStyles, IconButton, makeStyles, Typography} from "@material-ui/core";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import {Search} from "./Search";
import {getPosterUrl} from "./Poster";
import {Movie} from "../../../server/get_suggestions";
import axios from "axios";
import Masonry from "react-masonry-component";

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

export function SuggestionsForMovie(): ReactElement {
  const history = useHistory<{ movie: { id: number, title: string } }>();
  const id = useParams<{ id: string }>().id;

  const [movie, setMovie] = useState<{ id: number; title: string }>();

  useEffect(() => {
    if (history.location.state.movie) {
      setMovie(history.location.state.movie);
    } else {
      new Promise(resolve => setTimeout(resolve, 1000))
        .then(() => setMovie({ id: parseInt(id), title: id}));
    }
  }, [id, movie, setMovie])

  if (!movie) {
    return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <CircularProgress/>
      </div>
    )
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <img
          src="https://resizing.flixster.com/5eB_hJojQwNnWXHzUD7_AiHslyE=/506x652/v2/https://flxt.tmsimg.com/v9/AllPhotos/168418/168418_v9_bb.jpg"
          style={{borderRadius: '50%', height: '48px', width: '48px', margin: '4px 8px 4px 4px', objectFit: 'cover'}}
        />
        <Search onSelect={movie => history.push(`/movie/${movie.id}`, { movie })} />
      </div>
      <h1>Suggestions for {movie.title}</h1>
      <SuggestionList initialMovie={parseInt(id)}/>
    </div>
  )
}

function SuggestionList(props: { initialMovie: number }) {
  const clx = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Movie[]>();
  const [likes, setLikes] = useState<number[]>([props.initialMovie]);
  const [dislikes, setDislikes] = useState<number[]>([]);

  const fetchMoreSuggestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = {
        selected: likes,
        ignored: (suggestions || []).filter(m => !likes.includes(m.id)).map(m => m.id)
      };
      const response = await axios.post(`/test-api/suggestions`, data)
      setSuggestions(prevState => [...(prevState || []), ...response.data]);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, suggestions, setSuggestions, likes]);

  useEffect(() => {
    setSuggestions(undefined)
    setLikes([props.initialMovie]);
    setDislikes([]);
  }, [props.initialMovie]);

  useEffect(() => {
    function onScroll() {
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = document.documentElement.clientHeight;
      const viewportTop = document.documentElement.scrollTop;
      if (docHeight === viewportHeight + viewportTop) {
        fetchMoreSuggestions();
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [fetchMoreSuggestions]);

  useEffect(() => {
    void fetchMoreSuggestions()
  }, []);

  if (!suggestions) {
    return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <CircularProgress/>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', margin: '8px -8px' }}>
      <Masonry className={clx.masonry}>
        {suggestions.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            like={likes.includes(movie.id)}
            dislike={dislikes.includes(movie.id)}
            onLike={() => {
              setLikes(likes => {
                if (!likes.includes(movie.id)) {
                  setDislikes(dislikess => dislikess.filter(id => id !== movie.id));
                }
                return togglePresence(likes, movie.id);
              });
            }}
            ondislikes={() => {
              setDislikes(notLikes => {
                if (!notLikes.includes(movie.id)) {
                  setLikes(likes => likes.filter(id => id !== movie.id));
                }
                return togglePresence(notLikes, movie.id);
              });
            }}
          />
        ))}
      </Masonry>
      <div className={clx.footer}>
        {isLoading && <CircularProgress/>}
        <i>{isLoading ? 'Loading more suggestions...' : 'Scroll for more suggestions'}</i>
      </div>
    </div>
  )
}

export function togglePresence<T>(list: T[], item: T) {
  if (list.includes(item)) {
    return list.filter(i => i !== item);
  } else {
    return [...list, item];
  }
}

interface MovieCardProps {
  movie: Movie;
  like: boolean;
  dislike: boolean;
  onLike: () => void;
  ondislikes: () => void;
}

export function MovieCard(props: MovieCardProps) {
  const clx = useStyles();

  return (
    <Card className={clx.card}>
      <CardMedia className={clx.media} image={getPosterUrl(props.movie.poster_path)} title={props.movie.title}/>

      <CardContent>
        <Typography className={clx.title} variant="h6">{props.movie.title}</Typography>
      </CardContent>

      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={props.onLike}>
          <ThumbUpIcon color={props.like ? 'secondary' : 'inherit'}/>
        </IconButton>
        <IconButton aria-label="not interested" onClick={props.ondislikes}>
          <ThumbDownIcon color={props.dislike ? 'primary' : 'inherit'}/>
        </IconButton>
      </CardActions>
    </Card>
  )
}
