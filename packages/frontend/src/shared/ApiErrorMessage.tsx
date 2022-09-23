import { ApolloError } from '@apollo/client'
import * as React from 'react'

export default function ApiErrorMessage({error}: { error: ApolloError }) {
  console.error(error)
  return <div>An error occurred: {error.message}</div>
}
