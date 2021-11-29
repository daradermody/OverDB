import * as React from "react";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import {Button, Typography} from "@material-ui/core";
import {getPosterUrl} from "./Poster";
import LoadingSpinner from "./LoadingSpinner";
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import {MovieCard} from "./MovieCard";
import {InterestingDivider} from "./InterestingDivider";
import {FavouritablePerson, MovieCreditForPerson} from "../server/types";

export function PersonInfo() {
  const id = useParams<{ id: string }>().id;
  const [person, setPerson] = useState<FavouritablePerson | undefined>()

  useEffect(() => {
    axios.get<FavouritablePerson>(`/api/person/${id}`)
      .then(response => setPerson(response.data))
  }, [setPerson, id])

  if (!person) {
    return (
      <LoadingSpinner/>
    )
  }

  return (
    <div>
      <PersonSummary person={person}/>
      <InterestingDivider/>
      <MovieList person={person}/>
    </div>
  )
}

function PersonSummary({person}: { person: FavouritablePerson }) {
  const [favourited, setFavourited] = useState(person.favourited)

  useEffect(() => setFavourited(person.favourited), [person.id])

  function handleFavouriteClick() {
    if (favourited) {
      axios.post(`/api/person/${person.id}/unfavourite`)
      setFavourited(false)
    } else {
      axios.post(`/api/person/${person.id}/favourite`)
      setFavourited(true)
    }
  }

  return (
    <div style={{display: 'flex', margin: '20px'}}>
      <img style={{height: '400px', marginRight: '20px'}} src={getPosterUrl(person.profile_path)} alt={`image of ${person.name}`}/>
      <div>
        <Typography variant="h3">{person.name}</Typography>
        <Typography variant="body2" style={{marginBottom: '20px'}}>Known for {person.known_for_department}</Typography>
        <Typography variant="body1">{person.biography}</Typography>
        <Button
          style={{marginTop: 50}}
          variant="outlined"
          startIcon={favourited ? <FavoriteIcon style={{color: 'red'}}/> : <FavoriteBorderIcon style={{color: 'red'}}/>}
          onClick={handleFavouriteClick}
        >
          {favourited ? 'Favourited' : 'Favourite'}
        </Button>
      </div>
    </div>
  )
}

function MovieList({person}: { person: FavouritablePerson }) {
  const [movies, setMovies] = useState<MovieCreditForPerson[] | undefined>()
  const [roleFilters, setRoleFilters] = useState<string[]>([])

  useEffect(() => {
    axios.get<MovieCreditForPerson[]>(`/api/person/${person.id}/movies`)
      .then(response => setMovies(response.data.sort((a, b) => a.release_date < b.release_date ? 1 : -1)))
  }, [setMovies, person.id])

  if (!movies) {
    return <LoadingSpinner/>
  }

  function handleFilterButton(e: React.MouseEvent<HTMLElement>, values: string[]) {
    setRoleFilters(values)
  }

  const roles = extractUniqueRoles(movies)
  return (
    <div>
      <div style={{display: 'flex', marginRight: 10, justifyContent: 'right'}}>
        <ToggleButtonGroup value={roleFilters} onChange={handleFilterButton} style={{margin: '0 5px 20px 0', display: roles ? 'block' : 'none'}}>
          {roles.map(role => <ToggleButton key={role} value={role}>{role}</ToggleButton>)}
        </ToggleButtonGroup>
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 20, marginLeft: 30}}>
        {
          movies
            .filter(movie => !roleFilters.length || movie.jobs.some(job => roleFilters.includes(job)))
            .map(movie => <MovieCard key={movie.id} movie={movie}/>)
        }
      </div>
    </div>
  )
}

function RottenTomatoesButton(props: { query: string }) {
  return (
    <Button
      size="small"
      target="_blank"
      href={`https://www.rottentomatoes.com/search?search=${props.query}`}
    >
      <img
        height="36px"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Rotten_Tomatoes.svg/1200px-Rotten_Tomatoes.svg.png"
        alt="rotten tomatoes"
      />
    </Button>
  )
}

function extractUniqueRoles(movies: MovieCreditForPerson[]): string[] {
  const roles = new Set<string>()
  for (let movie of movies) {
    for (let job of movie.jobs) {
      roles.add(job)
    }
  }
  return Array.from(roles)
}
