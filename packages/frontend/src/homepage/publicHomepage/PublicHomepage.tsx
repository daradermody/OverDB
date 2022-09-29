import PageWrapper from '../../shared/PageWrapper'
import { Button, Typography } from '@mui/material'
import Link from '../../shared/general/Link'
import styled from '@emotion/styled'
import * as React from 'react'
import { TrendingMoves } from './TrendingMovies'
import HomepageCarousel from './HomepageCarousel'

export function PublicHomepage() {
  return (
    <div>
      <HomepageCarousel/>
      <InterstitialMessage/>
      <TrendingMoves/>
    </div>
  )
}

function InterstitialMessage() {
  return (
    <PrimaryBackground>
      <PageWrapper>
        <StyledMessage>
          <Typography variant="h1" textAlign="center">
            Follow your favourite movies and people. Get suggestions for new movies.
          </Typography>
          <Link to="/login">
            <Button variant="contained">Login</Button>
          </Link>
        </StyledMessage>
      </PageWrapper>
    </PrimaryBackground>
  )
}

const PrimaryBackground = styled.div`
  background-color: ${({theme}) => theme.palette.primary.dark};
`
const StyledMessage = styled.div`
  display: flex;
  width: fit-content;
  margin: 0 auto;
  padding: 60px 0 80px;
  align-items: center;
  flex-direction: column;
  gap: 30px;
`
