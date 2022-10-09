import { gql } from '@apollo/client'
import SearchIcon from '@mui/icons-material/Search'
import { Autocomplete, IconButton, InputAdornment, Modal, TextField, useMediaQuery, useTheme } from '@mui/material'
import { useThrottleCallback } from '@react-hook/throttle'
import * as React from 'react'
import { HTMLAttributes, useCallback, useState } from 'react'
import { Movie, Person, SearchResult, useSearchLazyQuery } from '../../types/graphql'
import { Poster } from '../shared/general/Poster'

interface PersonSearchProps {
  onSelect: (result: SearchResult) => void
  clearOnSelect?: boolean
  disabled?: boolean
}

export function Search(props: PersonSearchProps) {
  const theme = useTheme()
  const biggerDisplay = useMediaQuery(theme.breakpoints.up('md'))

  if (biggerDisplay) {
    return (
      <div style={{minWidth: '400px'}}>
        <SearchInput onSelect={props.onSelect} clearOnSelect={props.clearOnSelect} disabled={props.disabled}/>
      </div>
    )
  } else {
    return <SearchButton onSelect={props.onSelect} clearOnSelect={props.clearOnSelect} disabled={props.disabled}/>
  }
}

function SearchButton(props: PersonSearchProps) {
  const [showSearchInput, setShowSearchInput] = useState(false)

  const handleSelect = useCallback((...args: Parameters<typeof props.onSelect>) => {
    setShowSearchInput(false)
    props.onSelect(...args)
  }, [setShowSearchInput, props.onSelect])

  return (
    <>
      <IconButton size="large" disabled={props.disabled} onClick={() => setShowSearchInput(true)}>
        <SearchIcon fontSize="inherit"/>
      </IconButton>
      <Modal
        sx={{backgroundColor: 'secondary.main', p: 1}}
        open={showSearchInput}
        onClose={() => setShowSearchInput(false)}
      >
        <div>
          <SearchInput onSelect={handleSelect} clearOnSelect={props.clearOnSelect} disabled={props.disabled}/>
        </div>
      </Modal>
    </>
  )
}

function SearchInput(props: PersonSearchProps) {
  const [query, setQuery] = useState('')
  const [search, {data, loading}] = useSearchLazyQuery({notifyOnNetworkStatusChange: true})

  const handleKeyUp = useThrottleCallback(async e => {
    if (e.target.value) {
      await search({variables: {query: e.target.value}})
    }
  }, 2, true)

  return (
    <Autocomplete
      options={data?.search || []}
      autoHighlight
      freeSolo
      size="medium"
      blurOnSelect
      loading={loading}
      open={!!data && !!query}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      inputValue={query}
      disabled={props.disabled}
      onInputChange={(e, value) => setQuery(value)}
      onChange={(e, result) => {
        props.onSelect(result as SearchResult)
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
          variant="outlined"
          autoFocus
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
  )
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
