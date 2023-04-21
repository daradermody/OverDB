import * as React from 'react'
import PageWrapper from '../../shared/PageWrapper'
import { MovieSuggestions } from './MovieSuggestions'

export function UserHomepage() {
  return (
    <PageWrapper>
      <MovieSuggestions/>
    </PageWrapper>
  )
}

