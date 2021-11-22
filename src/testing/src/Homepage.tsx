import React from "react";
import {useHistory} from "react-router-dom";
import {Box, createStyles, makeStyles} from "@material-ui/core";
import {Search} from "./Search";

const useStyles = makeStyles(createStyles({
  homepage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    margin: '100px 0 100px',
    height: '300px',
    width: '300px',
    border: '5px solid gold',
    borderRadius: '50%',
  },
}));

export function Homepage() {
  const clx = useStyles();
  const history = useHistory();

  return (
    <Box className={clx.homepage}>
      <div className={clx.logo}/>
      <Search
        onSelect={movie => history.push(`/movie/${movie.id}`, { movie })}
      />
    </Box>
  )
}
