import { Facebook, Instagram, Twitter, YouTube } from '@mui/icons-material'
import { Container, Link, styled, Typography } from '@mui/material'
import * as React from 'react'

export default function Footer() {
  return (
    <Root>
      <Container sx={{display: 'flex', justifyContent: 'space-between', gap: '4px 20px', flexWrap: 'wrap'}}>
        <div>
          <div style={{display: 'flex', gap: 20, flexWrap: 'wrap'}}>
            <Link href="/about"><Typography variant="subtitle1">About</Typography></Link>
            <Link href="/news"><Typography variant="subtitle1">News</Typography></Link>
            <Link href="/pro"><Typography variant="subtitle1">Pro</Typography></Link>
            <Link href="/podcast"><Typography variant="subtitle1">Podcast</Typography></Link>
            <Link href="/help"><Typography variant="subtitle1">Help</Typography></Link>
            <Link href="/terms"><Typography variant="subtitle1">Terms</Typography></Link>
            <Link href="/contact"><Typography variant="subtitle1">Contact</Typography></Link>
          </div>
          <Typography variant="subtitle2" marginTop="10px">
            © Caʒ Gmbh. Made by fans in Ireland. Movie data from <Link href="https://themoviedb.org" target="_blank" sx={{color: 'inherit'}}>TMDb</Link>
          </Typography>
        </div>
        <Typography variant="subtitle2" sx={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <Link sx={{color: 'inherit'}} href="https://twitter.com" target="_blank"><Twitter fontSize="large"/></Link>
          <Link sx={{color: 'inherit'}} href="https://facebook.com" target="_blank"><Facebook fontSize="large"/></Link>
          <Link sx={{color: 'inherit'}} href="https://instagram.com" target="_blank"><Instagram fontSize="large"/></Link>
          <Link sx={{color: 'inherit'}} href="https://youTube.com" target="_blank"><YouTube fontSize="large"/></Link>
        </Typography>
      </Container>
    </Root>
  )
}

const Root = styled('div')`
  background-color: #1b222b;
  margin-top: 100px;
  padding: 20px 0 40px;
`
