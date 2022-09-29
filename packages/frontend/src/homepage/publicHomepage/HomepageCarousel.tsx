import PageWrapper from '../../shared/PageWrapper'
import { Typography } from '@mui/material'
import * as React from 'react'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

export default function HomepageCarousel() {
  return (
    <PageWrapper>
      <StyledHeroThing>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Typography variant="h1" fontSize="inherit" textAlign="right">Love</Typography>
        </div>
        <StyledCarousel>
          <JobList order={0}/>
          <JobList order={1}/>
        </StyledCarousel>
        <StyledMask/>
      </StyledHeroThing>
    </PageWrapper>
  )
}

function JobList({order}: {order: number}) {
  const roles = [
    'Actors',
    'Directors',
    'Movies',
    'Screenwriters',
    'Editors',
    'Composers',
    'Animators',
    'Costume designers',
    'Gaffers',
    'Set designers',
    'Makeup artists',
    'Art directors',
    'Special effects',
    'Sound designers',
    'Stunt performers',
  ]
  return <>{roles.map((role, i) => <StyledJob key={`${order}${i}`} variant="h1" index={i}>{role.toLowerCase()}</StyledJob>)}</>
}

const ROUND_TIME = 30

const highlight = keyframes`
  0% { color: inherit }
  4% { color: white }
  8% { color: inherit }
`

const StyledJob = styled(Typography)<{ index: number }>`
  animation: ${highlight} ${ROUND_TIME}s linear;
  font-size: inherit;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
  animation-delay: ${({index}) => index * 2 - 5}s;
  ${({theme}) => theme.breakpoints.up('sm')} {
    animation-delay: ${({index}) => index * 2  - 5.3}s;
  }
  color: ${({index}) => index === 2 ? 'white' : 'inherit'};
`

const StyledHeroThing = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  gap: 40px;
  max-height: 300px;
  font-size: 2rem;
  margin: 50px 0;
  overflow: hidden;

  ${({theme}) => theme.breakpoints.up('sm')} {
    font-size: 3rem;
    max-height: 400px;
    margin: 70px 0;
  }
  ${({theme}) => theme.breakpoints.up('md')} {
    font-size: 4rem;
    max-height: 500px;
    margin: 100px 0;
  }
  ${({theme}) => theme.breakpoints.up('lg')} {
    font-size: 5rem;
  }
`

const StyledMask = styled.div`
  position: absolute;
  width: 200%;
  height: 100%;
  box-shadow: inset 0 0 30px 50px ${({theme}) => theme.palette.background.default};
`

const scroll = keyframes`
  0% {
    transform: translateY(-0.3%)
  }
  100% {
    transform: translateY(-49.8%)
  }
`
const scrollSm = keyframes`
  0% {
    transform: translateY(-1.3%)
  }
  100% {
    transform: translateY(-50.6%)
  }
`
const scrollMd = keyframes`
  0% {
    transform: translateY(-1.8%)
  }
  100% {
    transform: translateY(-51.2%)
  }
`
const scrollLg = keyframes`
  0% {
    transform: translateY(-3.2%)
  }
  100% {
    transform: translateY(-52.6%)
  }
`

const StyledCarousel = styled.div`
  color: #ffffff4f;
  height: fit-content;
  overflow-x: hidden;
  animation: ${scroll} ${ROUND_TIME}s linear;
  transform: translateY(-0.3%);
  ${({theme}) => theme.breakpoints.up('sm')} {
    animation: ${scrollSm} ${ROUND_TIME}s linear;
    transform: translateY(-1.3%);
  }
  ${({theme}) => theme.breakpoints.up('md')} {
    animation: ${scrollMd} ${ROUND_TIME}s linear;
    transform: translateY(-1.8%);
  }
  ${({theme}) => theme.breakpoints.up('lg')} {
    animation: ${scrollLg} ${ROUND_TIME}s linear;
    transform: translateY(-52.6%);
  }
`
