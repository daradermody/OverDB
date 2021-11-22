import React, {useState} from "react";
import {Autocomplete} from "@material-ui/lab";
import {Poster} from "./Poster";
import {createStyles, InputAdornment, makeStyles, TextField} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import {useThrottleCallback} from "@react-hook/throttle";

const useStyles = makeStyles(createStyles({
  search: {
    width: '50%',
  }
}));

export function Search(props) {
  const clx = useStyles();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const onKeyUp = useThrottleCallback(async e => {
    setIsLoading(true);
    setIsOpen(true);
    if (e.target.value) {
      try {
        const {data} = await axios.get(`/test-api/search/${e.target.value}`)
        setSearchResults(data);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsOpen(false);
      setIsLoading(false);
      setSearchResults([]);
    }
  }, 2, true);

  return (
    <Autocomplete
      options={searchResults}
      className={clx.search}
      autoHighlight
      blurOnSelect
      clearOnBlur={false}
      loading={isLoading}
      open={isOpen}
      inputValue={query}
      onInputChange={(e, value) => setQuery(value)}
      onChange={(e, movie) => {
        setIsOpen(false);
        props.onSelect(movie);
      }}
      getOptionSelected={(option, value) => {
        return option.id === value.id
      }}
      getOptionLabel={option => option.title}
      renderOption={(movie) => (
        <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
          <div style={{height: '80px'}}>
            <Poster path={movie.poster_path}/>
          </div>
          <span style={{marginLeft: '8px'}}>{movie.title}</span>
        </div>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Search for a movie you love..."
          onKeyUp={onKeyUp}
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
