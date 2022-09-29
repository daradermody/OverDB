import * as React from 'react'
import { useParams } from 'react-router-dom'
import { InterestingDivider } from '../shared/general/InterestingDivider'
import PageWrapper from '../shared/PageWrapper'
import { MovieList } from './MovieList'
import { PersonSummary } from './PersonSummary'

export function PersonInfo() {
  const id = useParams<{ id: string }>().id
  return (
    <PageWrapper>
      <PersonSummary id={id}/>
      <InterestingDivider/>
      <MovieList id={id}/>
    </PageWrapper>
  )
}
