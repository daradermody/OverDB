import {gql} from "@apollo/client";
import SearchIcon from "@mui/icons-material/Search";
import {Autocomplete, InputAdornment, TextField} from "@mui/material";
import {useThrottleCallback} from "@react-hook/throttle";
import React, {HTMLAttributes, useState} from "react";
import {Movie, Person, SearchResult, useSearchLazyQuery} from "../../server/generated/graphql";
import {Poster} from "../shared/general/Poster";

interface PersonSearchProps {
  onSelect: (result: SearchResult) => void;
  clearOnSelect?: boolean;
}

export function Search(props: PersonSearchProps) {
  const [query, setQuery] = useState('');
  const [search, {data, loading}] = useSearchLazyQuery({notifyOnNetworkStatusChange: true})

  const handleKeyUp = useThrottleCallback(async e => {
    if (e.target.value) {
      await search({variables: {query: e.target.value}})
    }
  }, 2, true);

  return (
    <Autocomplete
      options={data?.search || []}
      autoHighlight
      freeSolo
      size="small"
      blurOnSelect
      loading={loading}
      open={!!data && !!query}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      inputValue={query}
      onInputChange={(e, value) => setQuery(value)}
      onChange={(e, result) => {
        props.onSelect(result as SearchResult);
        if (props.clearOnSelect) {
          setTimeout(() => setQuery(''), 0)
        }
      }}
      getOptionLabel={(option) => option.__typename === 'Movie' ? option.title : option.name}
      renderOption={(props, option) => {
        return option.__typename === 'Movie'
          ? <MovieResult key={option.id} liProps={props} movie={option}/>
          : <PersonResult key={option.id} liProps={props} person={option}/>
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{width: 400}}
          variant="outlined"
          placeholder="Search for cast and crew you love..."
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon/>
              </InputAdornment>
            )
          }}
        />
      )}
    />
  );
}

interface PersonResultProps {
  person: Pick<Person, 'name' | 'profilePath'>
  liProps: HTMLAttributes<HTMLLIElement>
}

function PersonResult({person, liProps}: PersonResultProps) {
  return (
    <li {...liProps}>
      <div style={{height: '80px'}}>
        <Poster path={person.profilePath}/>
      </div>
      <span style={{marginLeft: '8px'}}>{person.name}</span>
    </li>
  )
}

interface MovieResultProps {
  movie: Pick<Movie, 'title' | 'posterPath'>
  liProps: HTMLAttributes<HTMLLIElement>
}

function MovieResult({movie, liProps}: MovieResultProps) {
  return (
    <li {...liProps}>
      <div style={{height: '80px'}}>
        <Poster path={movie.posterPath}/>
      </div>
      <span style={{marginLeft: '8px'}}>{movie.title}</span>
    </li>
  )
}

gql`
  query Search($query: String!) {
    search(query: $query) {
      ... on Movie {
        id
        title
        posterPath
      }
      ... on Person {
        id
        name
        profilePath
      }
    }
  }
`
