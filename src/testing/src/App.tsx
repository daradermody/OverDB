import React from 'react';
import {Container, createStyles, makeStyles} from '@material-ui/core';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Homepage} from "./Homepage";
import {SuggestionsForMovie} from "./SuggestionsForMovie";
import {Suggestions} from './Suggestions';

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
        <Switch>
          <Route exact path="/">
            <Homepage/>
          </Route>
          <Route path="/movie/:id">
            <SuggestionsForMovie/>
          </Route>
          <Route path="/suggestions">
            <Suggestions/>
          </Route>
        </Switch>
      </BrowserRouter>
    </Container>
  )
}

