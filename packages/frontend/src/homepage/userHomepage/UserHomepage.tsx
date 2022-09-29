import * as React from 'react'
import PageWrapper from '../../shared/PageWrapper'
import { PeopleList } from './PeopleList'
import { MovieSuggestions } from './MovieSuggestions'

export function UserHomepage() {
  return (
    <PageWrapper>
      <PeopleList/>
      <MovieSuggestions/>
    </PageWrapper>
  )
}
