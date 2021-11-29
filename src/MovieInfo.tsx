import React, {useEffect, useState} from 'react'
import {InterestingDivider} from "./InterestingDivider";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";
import {Link as RouterLink, useParams} from "react-router-dom";
import {getPosterUrl} from "./Poster";
import {Button, Fade, IconButton, Link, makeStyles, Tooltip, Typography} from "@material-ui/core";
import {PersonCard} from "./PersonCard";
import {AlarmAdd, AlarmOn, Clear, ThumbDown, ThumbsUpDown, ThumbUp, Visibility, VisibilityOff} from "@material-ui/icons";
import {LikableMovie, Movie, PersonCreditForMovie, Sentiment} from "../server/types";
import {TmdbRating} from "./TmdbRating";

export function MovieInfo() {
  const {id} = useParams<{ id: string }>();
  const [movie, setMovie] = useState<LikableMovie | undefined>()

  useEffect(() => {
    axios.get<LikableMovie>(`/api/movie/${id}`)
      .then(({data}) => setMovie(data));
  }, [setMovie])

  if (!movie) {
    return <LoadingSpinner/>
  }

  return (
    <div>
      <MovieSummary movie={movie}/>
      <InterestingDivider/>
      <CrewList movieId={movie.id}/>
    </div>
  );
}

function MovieSummary({movie}: { movie: LikableMovie }) {
  return (
    <div style={{display: 'flex', margin: '20px'}}>
      <div style={{marginRight: '20px'}}>
        <img style={{height: '400px'}} src={getPosterUrl(movie.poster_path)} alt={`poster of ${movie.title}`}/>
        <TmdbRating movie={movie}/>
      </div>
      <div>
        <Typography variant="h3">{movie.title}</Typography>
        <Typography variant="body2" style={{marginBottom: '20px'}}>{movie.tagline}</Typography>
        <Typography variant="body1">{movie.overview}</Typography>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start', marginTop: 30}}>
          <WatchedButton movieId={movie.id} initialWatched={movie.watched} withLabel/>
          <WatchlistButton movieId={movie.id} initialInWatchlist={movie.inWatchlist} withLabel/>
          <SentimentSelect movieId={movie.id} initialSentiment={movie.sentiment} withLabel/>
        </div>
      </div>
    </div>
  )
}

interface WatchedButtonProps {
  movieId: number;
  initialWatched: boolean;
  withLabel?: boolean;
}

export function WatchedButton({movieId, initialWatched, withLabel}: WatchedButtonProps) {
  const [watched, setWatched] = useState(initialWatched)

  function handleClick() {
    if (watched) {
      axios.delete(`/api/movie/${movieId}/watched`)
    } else {
      axios.put(`/api/movie/${movieId}/watched`)
    }
    setWatched(!watched)
  }

  return (
    <Tooltip
      placement="top"
      disableHoverListener={withLabel}
      disableFocusListener={withLabel}
      title={(watched ? 'Watched' : 'Unwatched')}
    >
      <Button onClick={handleClick}>
        {watched ? <Visibility style={{padding: '6px 12px 6px 4px'}}/> : <VisibilityOff style={{padding: '6px 12px 6px 4px'}}/>}
        {withLabel && (watched ? 'Watched' : 'Unwatched')}
      </Button>
    </Tooltip>
  )
}

interface WatchlistButtonProps {
  movieId: number;
  initialInWatchlist: boolean;
  withLabel?: boolean;
}

export function WatchlistButton({movieId, initialInWatchlist, withLabel}: WatchlistButtonProps) {
  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist)

  function handleClick() {
    if (inWatchlist) {
      axios.delete(`/api/movie/${movieId}/watchlist`)
    } else {
      axios.put(`/api/movie/${movieId}/watchlist`)
    }
    setInWatchlist(!inWatchlist)
  }

  return (
    <Tooltip
      placement="top"
      disableHoverListener={withLabel}
      disableFocusListener={withLabel}
      title={(inWatchlist ? 'Added to watchlist' : 'Add to watchlist')}
    >
      <Button onClick={handleClick}>
        {inWatchlist ? <AlarmOn style={{padding: '6px 12px 6px 4px'}}/> : <AlarmAdd style={{padding: '6px 12px 6px 4px'}}/>}
        {withLabel && (inWatchlist ? 'Added to watchlist' : 'Add to watchlist')}
      </Button>
    </Tooltip>
  )
}

const useTooltipStyles = makeStyles({
  tooltip: {
    backgroundColor: 'transparent',
    margin: 0
  },
});

interface SentimentSelectProps {
  movieId: number;
  initialSentiment: Sentiment;
  withLabel?: boolean;
  placement?: 'right' | 'top'
}

export function SentimentSelect({movieId, initialSentiment, withLabel, placement}: SentimentSelectProps) {
  const tooltipClx = useTooltipStyles()
  const [sentiment, setSentiment] = useState(initialSentiment)
  const [showOptions, setShowOptions] = useState(false)

  function changeSentiment(newSentiment: Sentiment) {
    axios.post(`/api/movie/${movieId}/sentiment/${newSentiment}`)
    setSentiment(newSentiment)
    setShowOptions(false)
  }

  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Tooltip
        interactive
        placement={placement || 'right'}
        open={showOptions}
        classes={tooltipClx}
        onClose={() => setShowOptions(false)}
        onOpen={() => setShowOptions(true)}
        TransitionComponent={Fade}
        TransitionProps={{timeout: 0}}
        title={
          <div style={{display: 'flex', flexDirection: placement === 'top' ? 'column-reverse' : 'row', backgroundColor: !withLabel ? 'rgba(0,0,0,0.8)' : undefined}}>
            <IconButton onClick={() => changeSentiment(Sentiment.LIKED)}>{getIconForSentiment(Sentiment.LIKED)}</IconButton>
            <IconButton onClick={() => changeSentiment(Sentiment.DISLIKED)}>{getIconForSentiment(Sentiment.DISLIKED)}</IconButton>
            <IconButton onClick={() => changeSentiment(Sentiment.NONE)}><Clear/></IconButton>
          </div>
        }
      >
        <IconButton disableRipple>
          {getIconForSentiment(sentiment)}
        </IconButton>
      </Tooltip>
      {showOptions || !withLabel || <SentimentText sentiment={sentiment} onClear={() => changeSentiment(Sentiment.NONE)}/>}
    </div>
  )
}

function SentimentText(props: { sentiment: Sentiment, onClear(): void }) {
  const tooltipClx = useTooltipStyles()

  if (props.sentiment === Sentiment.NONE) {
    return <Typography>{getTextForSentiment(props.sentiment)}</Typography>
  } else
    return (
      <Tooltip
        interactive
        placement="right"
        classes={tooltipClx}
        TransitionComponent={Fade}
        title={<IconButton onClick={props.onClear}><Clear/></IconButton>}
      >
        <Typography>{getTextForSentiment(props.sentiment)}</Typography>
      </Tooltip>
    )
}

function getIconForSentiment(sentiment: Sentiment): JSX.Element {
  if (sentiment === Sentiment.LIKED) {
    return <ThumbUp/>
  } else if (sentiment === Sentiment.DISLIKED) {
    return <ThumbDown/>
  } else {
    return <ThumbsUpDown/>
  }
}

function getTextForSentiment(sentiment: Sentiment) {
  if (sentiment === Sentiment.LIKED) {
    return 'Liked'
  } else if (sentiment === Sentiment.DISLIKED) {
    return 'Disliked'
  } else {
    return 'Set sentiment'
  }
}

const importantJobs = [
  "Screenplay",
  "Director",
  "Producer",
  "Sound",
  "Music",
  "Cinematography",
  "Editor",
  "Casting",
]

function CrewList({movieId}: { movieId: Movie['id'] }) {
  const [crew, setCrew] = useState<PersonCreditForMovie[]>()

  useEffect(() => {
    axios.get<PersonCreditForMovie[]>(`/api/movie/${movieId}/cast`)
      .then(({data}) => setCrew(data));
  }, [setCrew])

  if (!crew) {
    return <LoadingSpinner/>
  }

  const importantCrew = crew.filter(person => person.jobs.find(job => importantJobs.includes(job)))
  const unimportantCrew = crew.filter(person => !importantCrew.includes(person))

  return (
    <div>
      <Typography variant="h5">Main Crew</Typography>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
        {importantCrew.map(person => <PersonCard key={person.id} person={person}/>)}
      </div>
      <Typography variant="h5" style={{marginTop: 20}}>Other Crew</Typography>
      <div>
        {unimportantCrew.map(person => (
          <div key={person.id}>
            <Link
              underline="none"
              component={RouterLink}
              to={`/person/${person.id}`}
              style={{textDecoration: 'none', color: 'white'}}
            >
              {person.name} - {person.jobs.join(', ')}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
