import { gql } from '@apollo/client'
import { Typography } from '@mui/material'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useGetListQuery } from '../../types/graphql'
import MoviesPeopleCards from '../shared/cards/MoviesPeopleCards'
import { ErrorMessage } from '../shared/errorHandlers'
import PageWrapper from '../shared/PageWrapper'
import UserBadge from '../shared/UserBadge'
import useSetTitle from '../shared/useSetTitle';
import useUser from '../useUser'

export default function List() {
  const {user} = useUser()
  const {id, username} = useParams<{ id: string, username: string }>()
  const {data, loading, error, refetch} = useGetListQuery({variables: {id, username}})
  useSetTitle(data?.user.list.name)

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  return (
    <PageWrapper>
      <Typography variant="h1">
        {user?.username === username ? data?.user.list.name : <UserBadge username={username}>{username}'s {data?.user.list.name}</UserBadge>}
      </Typography>
      <MoviesPeopleCards moviesAndPeople={data?.user.list.items} loading={loading}/>
      {!data?.user.list.items.length && <div>No items in this list</div>}
    </PageWrapper>
  )
}

gql`
  query GetList($username: ID!, $id: ID!) {
    user(username: $username) {
      list(id: $id) {
        id
        name
        type
        items {
          ... on Movie {
            id
            posterPath
            title
            releaseDate
            watched
            inWatchlist
            sentiment
          }
          ... on Person {
            id
            name
            profilePath
          }
        }
      }
    }
  }
`
