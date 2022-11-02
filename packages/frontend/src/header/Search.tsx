import { gql } from '@apollo/client'
import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { Autocomplete, Box, Fab, IconButton, InputAdornment, Modal, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useThrottleCallback } from '@react-hook/throttle'
import * as React from 'react'
import { HTMLAttributes, KeyboardEvent, useCallback, useEffect, useState } from 'react'
import { Movie, Person, SearchResult, useSearchLazyQuery } from '../../types/graphql'
import { useMutationErrorHandler } from '../shared/errorHandlers'
import { Poster } from '../shared/general/Poster'

interface SearchProps {
  onSelect: (result: SearchResult) => void
  clearOnSelect?: boolean
  disabled?: boolean
}

export function Search(props: SearchProps) {
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

function SearchButton(props: SearchProps) {
  const [showSearchInput, setShowSearchInput] = useState(false)

  const handleSelect = useCallback((...args: Parameters<typeof props.onSelect>) => {
    setShowSearchInput(false)
    props.onSelect(...args)
  }, [setShowSearchInput, props.onSelect])

  return (
    <>
      <Fab
        sx={{position: 'fixed', bottom: 16, right: 16}}
        color="primary"
        aria-label="search"
        disabled={props.disabled}
        onClick={() => setShowSearchInput(true)}
      >
        <SearchIcon/>
      </Fab>
      <Modal
        sx={{backgroundColor: 'secondary.main', color: 'text.primary', p: 1, height: '100%'}}
        open={showSearchInput}
        onClose={() => setShowSearchInput(false)}
      >
        <div style={{height: '100%'}}>
          <MobileSearchInput onSelect={handleSelect} onCancel={() => setShowSearchInput(false)}/>
        </div>
      </Modal>
    </>
  )
}

function SearchInput(props: SearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [search, {data, loading, error}] = useSearchLazyQuery({notifyOnNetworkStatusChange: true})
  useMutationErrorHandler('Could not search', error)

  const handleKeyUp = useThrottleCallback(async (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.target as HTMLInputElement).value) {
      if (e.code === 'Escape') {
        setIsOpen(false)
      } else {
        await search({variables: {query: (e.target as HTMLInputElement).value.trim()}})
      }
    }
  }, 2, true)

  useEffect(() => setIsOpen(!!data && !!query), [data, query, setIsOpen])

  return (
    <Autocomplete<SearchResult, false, false, true>
      options={data?.search || []}
      autoHighlight
      freeSolo
      size="medium"
      filterOptions={x => x}
      loading={loading}
      onFocus={() => setIsOpen(!!data && !!query)}
      onBlur={() => setIsOpen(false)}
      open={isOpen}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      inputValue={query}
      disabled={props.disabled}
      onInputChange={(e, value) => setQuery(value)}
      onChange={(e, result) => {
        if (typeof result !== 'string') {
          (e.target as HTMLInputElement).blur()
          props.onSelect(result)
          if (props.clearOnSelect) {
            setTimeout(() => setQuery(''), 0)
          }
        }
      }}
      getOptionLabel={(option: SearchResult | string) => (option as Movie).title || (option as Person).name || (option as string)}
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

interface MobileSearchInputProps {
  onSelect: (result: SearchResult) => void
  onCancel: () => void
}

function MobileSearchInput(props: MobileSearchInputProps) {
  const [query, setQuery] = useState('')
  const [search, {data, error}] = useSearchLazyQuery({notifyOnNetworkStatusChange: true})
  useMutationErrorHandler('Could not search', error)

  const handleKeyUp = useThrottleCallback(async e => {
    if (e.target.value) {
      await search({variables: {query: e.target.value.trim()}})
    }
  }, 2, true)

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <TextField
        sx={{position: 'fixed', top: 8, left: 8, right: 8}}
        variant="outlined"
        autoFocus
        placeholder="Search for cast and crew you love..."
        value={query}
        onKeyUp={handleKeyUp}
        onChange={e => setQuery(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={props.onCancel}>
                <CloseIcon/>
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <Box sx={{overflowY: 'scroll', mt: '64px'}}>
        {data && data.search.map((item) => {
          return item.__typename === 'Movie'
            ? <MovieResult key={item.id} onClick={() => props.onSelect(item as SearchResult)} movie={item}/>
            : <PersonResult key={item.id} onClick={() => props.onSelect(item as SearchResult)} person={item}/>
        })}
      </Box>
    </Box>
  )
}

interface PersonResultProps {
  person: Pick<Person, 'name' | 'profilePath'>
  liProps?: HTMLAttributes<HTMLLIElement>
  onClick?: () => void
}

function PersonResult({person, liProps, onClick}: PersonResultProps) {
  return (
    <StyledSearchResult onClick={onClick} {...liProps}>
      <div style={{height: '80px'}}>
        <Poster src={person.profilePath} style={{height: '81px', width: '54px'}}/>
      </div>
      <span style={{marginLeft: '8px'}}>{person.name}</span>
    </StyledSearchResult>
  )
}

interface MovieResultProps {
  movie: Pick<Movie, 'title' | 'posterPath' | 'releaseDate'>
  liProps?: HTMLAttributes<HTMLLIElement>
  onClick?: () => void
}

function MovieResult({movie, liProps, onClick}: MovieResultProps) {
  return (
    <StyledSearchResult onClick={onClick} {...liProps}>
      <div style={{height: '80px'}}>
        <Poster src={movie.posterPath} style={{height: '81px', width: '54px'}}/>
      </div>
      <Box display="flex" gap="4px" alignItems="baseline" overflow="hidden">
        <Typography variant="body1" sx={{ml: '8px', overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{movie.title}</Typography>
        {movie.releaseDate && <Typography variant="subtitle1">({movie.releaseDate.split('-')[0]})</Typography>}
      </Box>
    </StyledSearchResult>
  )
}

const StyledSearchResult = styled.li`
  display: flex;
  overflow: hidden;
  align-items: center;
  cursor: pointer;
  padding: 6px 16px;
  list-style: none;
`

gql`
  query Search($query: String!) {
    search(query: $query) {
      ... on Movie {
        id
        title
        posterPath
        releaseDate
      }
      ... on Person {
        id
        name
        profilePath
      }
    }
  }
`
