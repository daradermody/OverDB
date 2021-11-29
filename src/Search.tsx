import React, {useState} from "react";
import {Autocomplete} from "@material-ui/lab";
import {Poster} from "./Poster";
import {createStyles, InputAdornment, makeStyles, TextField} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import {useThrottleCallback} from "@react-hook/throttle";
import {FavouritablePerson} from "../server/types";

const useStyles = makeStyles(createStyles({
  search: {
    width: '50%',
  }
}));

interface PersonSearchProps {
  onSelect: (person: FavouritablePerson) => void;
  clearOnSelect?: boolean;
}

export function Search(props: PersonSearchProps) {
  const clx = useStyles();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FavouritablePerson[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const onKeyUp = useThrottleCallback(async e => {
    setIsLoading(true);
    setIsOpen(true);
    if (e.target.value) {
      try {
        const {data} = await axios.get<FavouritablePerson[]>(`/api/person/search/${e.target.value}`)
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
      getOptionSelected={(option, value) => option.id === value.id}
      inputValue={query}
      onInputChange={(e, value) => setQuery(value)}
      onChange={(e, person) => {
        setIsOpen(false);
        props.onSelect(person as FavouritablePerson);
        if (props.clearOnSelect) {
          setQuery('')
        }
      }}
      getOptionLabel={(option) => option.name}
      renderOption={(person) => (
        <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
          <div style={{height: '80px'}}>
            <Poster path={person.profile_path}/>
          </div>
          <span style={{marginLeft: '8px'}}>{person.name}</span>
        </div>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Search for cast and crew you love..."
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
