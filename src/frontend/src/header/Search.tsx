import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import {Autocomplete, Box, Fab, IconButton, InputAdornment, Modal, Skeleton, TextField, Typography, useMediaQuery, useTheme} from '@mui/material'
import {type HTMLAttributes, type KeyboardEventHandler, useCallback, useEffect, useRef, useState} from 'react'
import {useLocation} from 'react-router'
import {useNavigate} from 'react-router-dom'
import {useDeclarativeErrorHandler} from '../shared/errorHandlers'
import {Poster} from '../shared/general/Poster'
import {useQuery} from '@tanstack/react-query'
import {trpc} from '../queryClient.ts'
import {type MovieSummary, type PersonSummary, type SearchResult, ThingType} from '../../../apiTypes.ts'

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
  const showSearchInput: boolean = location.state?.showSearchInput || false

  const setShowSearchInput = useCallback((showSearchInput: boolean) => {
    navigate(location, {state: {showSearchInput}, replace: !showSearchInput})
  }, [navigate, location])

  const handleSelect = useCallback((result: SearchResult) => {
    setShowSearchInput(false)
    props.onSelect(result)
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
  const throttledQuery = useThrottle(query, 500);
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const {data, isLoading, error} = useQuery(trpc.search.queryOptions(throttledQuery, {enabled: throttledQuery.trim().length > 2}))
  useDeclarativeErrorHandler('Could not search', error)

  const goToSearchPage = useCallback((searchQuery: string) => {
    if (!searchQuery) return
    setQuery('')
    setIsOpen(false)
    navigate(`/search/${encodeURIComponent(searchQuery)}`)
  }, [setQuery, setIsOpen, navigate])

  const handleKeyUp: KeyboardEventHandler<HTMLDivElement> = useCallback(async e => {
    if (e.key === 'Escape') {
      (e.target as HTMLInputElement).blur()
      setIsOpen(false)
    } else if (e.key === 'Enter') {
      goToSearchPage((e.target as HTMLInputElement).value.trim())
    }
  }, [setIsOpen, goToSearchPage])


  useEffect(() => setIsOpen(!!query), [query, setIsOpen])

  return (
    <Autocomplete<SearchResult, false, false, true>
      options={data || []}
      noOptionsText="No results found"
      loadingText={<div style={{maxHeight: 'calc(40vh - 16px)', margin: '-6px -16px'}}><LoadingResults/></div>}
      size="medium"
      clearOnBlur={false}
      clearOnEscape
      filterOptions={x => x}
      loading={isLoading}
      onFocus={() => setIsOpen(!!query)}
      onBlur={() => setIsOpen(false)}
      open={isOpen}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      inputValue={query}
      disabled={props.disabled}
      value={null}
      onInputChange={(_e, value, reason) => {
        if (reason === 'input') setQuery(value)
      }}
      onChange={(e, result, reason) => {
        if (reason === 'selectOption') {
          (e.target as HTMLInputElement).blur()
          props.onSelect(result as SearchResult)
          setTimeout(() => setIsOpen(false), 0)
          if (props.clearOnSelect) {
            setTimeout(() => setQuery(''), 0)
          }
        }
      }}
      getOptionKey={option => typeof option === 'string' ? option : option.id}
      getOptionLabel={(option: SearchResult | string) => {
        if (typeof option === 'string') {
          return option
        } else {
          return option.type === ThingType.Movie ? option.title : option.name
        }
      }}
      renderOption={(props, option) => {
        const {key, ...otherProps} = props
        return option.type === ThingType.Movie
          ? <MovieResult key={key} liProps={otherProps} movie={option}/>
          : <PersonResult key={key} liProps={otherProps} person={option}/>
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Search for cast and crew you love..."
          onKeyUp={handleKeyUp}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => goToSearchPage(query)} edge="end">
                    <SearchIcon/>
                  </IconButton>

                </InputAdornment>
              )
            }
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
  const throttledQuery = useThrottle(query, 500);
  const navigate = useNavigate()
  const {data, isLoading, error} = useQuery(trpc.search.queryOptions(throttledQuery, {enabled: throttledQuery.trim().length > 2}))
  useDeclarativeErrorHandler('Could not search', error)

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = useCallback(async e => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value.trim()
      navigate(`/search/${encodeURIComponent(value)}`, {replace: true})
    }
  }, [navigate])

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
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={props.onCancel}>
                  <CloseIcon/>
                </IconButton>
              </InputAdornment>
            )
          }
      }}
      />
      <Box sx={{overflowY: 'scroll', mt: '64px'}}>
        {data?.length === 0 && <Typography variant="subtitle1" sx={{textAlign: 'center', mt: 2}}>No results found</Typography>}
        {isLoading && <LoadingResults/>}
        {data?.map((item) => {
          return item.type === ThingType.Movie
            ? <MovieResult key={item.id} onClick={() => props.onSelect(item)} movie={item}/>
            : <PersonResult key={item.id} onClick={() => props.onSelect(item)} person={item}/>
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
  person: PersonSummary
  liProps?: HTMLAttributes<HTMLLIElement>
  onClick?: () => void
}

function PersonResult({person, liProps, onClick}: PersonResultProps) {
  return (
    <StyledSearchResult onClick={onClick} {...liProps}>
      <div style={{height: '80px'}}>
        <Poster src={person.profilePath || undefined} style={{height: '80px', width: '54px'}}/>
      </div>
      <span style={{marginLeft: '8px'}}>{person.name}</span>
    </StyledSearchResult>
  )
}

interface MovieResultProps {
  movie: MovieSummary
  liProps?: HTMLAttributes<HTMLLIElement>
  onClick?: () => void
}

function MovieResult({movie, liProps, onClick}: MovieResultProps) {
  return (
    <StyledSearchResult onClick={onClick} {...liProps}>
      <div style={{height: '80px'}}>
        <Poster src={movie.posterPath || undefined} style={{height: '80px', width: '54px'}}/>
      </div>
      <Box display="flex" gap="4px" alignItems="baseline" overflow="hidden">
        <Typography variant="body1" sx={{
          ml: '8px',
          overflowX: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>{movie.title}</Typography>
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


function useThrottle<T>(value: T, limitMs: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limitMs) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limitMs - (Date.now() - lastRan.current));

    return () => clearTimeout(handler);
  }, [value, limitMs]);

  return throttledValue;
}
