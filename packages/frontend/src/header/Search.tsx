import { gql } from '@apollo/client'
import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { Autocomplete, Box, Fab, IconButton, InputAdornment, Modal, Skeleton, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useThrottleCallback } from '@react-hook/throttle'
import * as React from 'react'
import { HTMLAttributes, useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { Movie, PersonInfo, SearchResult, useSearchLazyQuery } from '../../types/graphql'
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
  const navigate = useNavigate()
  const location = useLocation()
  const showSearchInput: boolean = location.state?.showSearchInput

  const setShowSearchInput = useCallback((showSearchInput) => {
    navigate(location, {state: {showSearchInput}, replace: !showSearchInput})
  }, [navigate, location])

  const handleSelect = useCallback((...args: Parameters<typeof props.onSelect>) => {
    setShowSearchInput(false)
    props.onSelect(...args)
  }, [props.onSelect])

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
  const navigate = useNavigate()
  const [search, {data, loading, error}] = useSearchLazyQuery({notifyOnNetworkStatusChange: true})
  useMutationErrorHandler('Could not search', error)

  const goToSearchPage = useCallback((searchQuery) => {
    setQuery('')
    setIsOpen(false)
    navigate(`/search/${encodeURIComponent(searchQuery)}`)
  }, [setQuery, setIsOpen, navigate])

  const searchQuery = useThrottleCallback(query => search({variables: {query}}), 2, true)

  const handleKeyUp = useCallback(async e => {
    if (e.code === 'Escape') {
      (e.target as HTMLInputElement).blur()
      setIsOpen(false)
    } else if (e.code === 'Enter') {
      goToSearchPage(e.target.value.trim())
    } else if (e.target.value.trim()) {
      searchQuery(e.target.value.trim())
    }
  }, [setIsOpen, goToSearchPage, searchQuery])


  useEffect(() => setIsOpen(!!query), [query, setIsOpen])

  return (
    <Autocomplete<SearchResult, false, false, true>
      options={data?.search || []}
      noOptionsText="No results found"
      loadingText={<div style={{ maxHeight: 'calc(40vh - 16px)', margin: '-6px -16px' }}><LoadingResults/></div>}
      size="medium"
      clearOnBlur={false}
      clearOnEscape
      filterOptions={x => x}
      loading={loading}
      onFocus={() => setIsOpen(!!query)}
      onBlur={() => setIsOpen(false)}
      open={isOpen}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      inputValue={query}
      disabled={props.disabled}
      value={null}
      onInputChange={(e, value, reason) => {
        if (reason === 'input') setQuery(value)
      }}
      onChange={(e, result, reason, details) => {
        if (reason === 'selectOption') {
          (e.target as HTMLInputElement).blur()
          props.onSelect(result as SearchResult)
          setTimeout(() => setIsOpen(false), 0)
          if (props.clearOnSelect) {
            setTimeout(() => setQuery(''), 0)
          }
        }
      }}
      getOptionLabel={(option: SearchResult | string) => (option as Movie).title || (option as PersonInfo).name || ''}
      renderOption={(props, option) => {
        return option.__typename === 'Movie'
          ? <MovieResult key={option.id} liProps={props} movie={option}/>
          : <PersonResult key={option.id} liProps={props} person={option}/>
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Search for cast and crew you love..."
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => goToSearchPage(query)} edge="end">
                  <SearchIcon/>
                </IconButton>

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
  const navigate = useNavigate()
  const [search, {data, loading, error}] = useSearchLazyQuery({notifyOnNetworkStatusChange: true})
  useMutationErrorHandler('Could not search', error)

  const handleKeyUp = useCallback(async e => {
    if (e.code === 'Enter') {
      navigate(`/search/${encodeURIComponent(e.target.value.trim())}`, {replace: true})
    } else if (e.target.value.trim()) {
      searchQuery(e.target.value.trim())
    }
  }, [])

  const searchQuery = useThrottleCallback(query => search({variables: {query}}), 2, true)

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
        {data?.search.length === 0 && <Typography variant="subtitle1" sx={{ textAlign: 'center', mt: 2}}>No results found</Typography>}
        {loading && <LoadingResults/>}
        {data?.search.map((item) => {
          return item.__typename === 'Movie'
            ? <MovieResult key={item.id} onClick={() => props.onSelect(item as SearchResult)} movie={item}/>
            : <PersonResult key={item.id} onClick={() => props.onSelect(item as SearchResult)} person={item}/>
        })}
      </Box>
    </Box>
  )
}

function LoadingResults() {
  return (
    <>
      <LoadingResult titleWidth={80}/>
      <LoadingResult titleWidth={100}/>
      <LoadingResult titleWidth={60}/>
      <LoadingResult titleWidth={130}/>
      <LoadingResult titleWidth={100}/>
      <LoadingResult titleWidth={90}/>
      <LoadingResult titleWidth={80}/>
    </>
  )
}

function LoadingResult({titleWidth}: { titleWidth: number }) {
  return (
    <StyledSearchResult>
      <div style={{height: '80px', marginRight: '8px'}}>
        <Skeleton variant="rectangular" animation="wave" height={80} width={54}/>
      </div>
      <Skeleton variant="rectangular" animation="wave" height={28} width={titleWidth} sx={{marginRight: '4px'}}/>
      <Skeleton variant="rectangular" animation="wave" height={28} width={47}/>
    </StyledSearchResult>
  )
}

interface PersonResultProps {
  person: Pick<PersonInfo, 'name' | 'profilePath'>
  liProps?: HTMLAttributes<HTMLLIElement>
  onClick?: () => void
}

function PersonResult({person, liProps, onClick}: PersonResultProps) {
  return (
    <StyledSearchResult onClick={onClick} {...liProps}>
      <div style={{height: '80px'}}>
        <Poster src={person.profilePath} style={{height: '80px', width: '54px'}}/>
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
        <Poster src={movie.posterPath} style={{height: '80px', width: '54px'}}/>
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
      ... on PersonInfo {
        id
        name
        profilePath
      }
    }
  }
`
