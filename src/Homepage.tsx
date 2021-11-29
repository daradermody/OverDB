import React from 'react'
import {PeopleList} from "./PeopleList";
import {MovieSuggestions} from "./MovieSuggestions";

export function Homepage() {
  return (
    <div>
      <PeopleList/>
      <MovieSuggestions/>
    </div>
  )
}
