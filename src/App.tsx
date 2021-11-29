import React from 'react';
import {Button, Container, createStyles, makeStyles, Typography} from '@material-ui/core';
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom';
import {PersonInfo} from "./PersonInfo";
import {Search} from "./Search";
import {Homepage} from "./Homepage";
import {MovieInfo} from "./MovieInfo";

const useStyles = makeStyles(theme => createStyles({
  page: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    minHeight: '100vh',
    padding: '0.05px 16px',
  },
}));

export default function App() {
  const clx = useStyles();
  return (
    <Container className={clx.page}>
      <BrowserRouter>
        <Header/>
        <Switch>
          <Route exact path="/">
            <Homepage/>
          </Route>
          <Route path="/person/:id">
            <PersonInfo/>
          </Route>
          <Route path="/movie/:id">
            <MovieInfo/>
          </Route>
        </Switch>
      </BrowserRouter>
    </Container>
  )
}

function Header() {
  const history = useHistory()
  return (
    <div style={{height: 40, display: 'flex', justifyContent: 'space-between', backgroundColor: 'purple', margin: '0 -16px', padding: 10, alignItems: 'center'}}>
      <Button onClick={() => history.push('/')} style={{textTransform: 'inherit'}}>
        <Typography variant="h4">OverDB</Typography>
      </Button>
      <Search clearOnSelect onSelect={person => history.push(`/person/${person.id}`, {person})}/>
    </div>
  )
}
