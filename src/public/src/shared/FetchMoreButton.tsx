import { Box } from '@mui/material'
import * as React from 'react'
import { ObservableQuery } from '@apollo/client'

interface FetchMoreProps {
  fetchMore: ObservableQuery['fetchMore']
  currentLength?: number
  endReached: boolean
  loading: boolean
}

export default function FetchMoreButton({fetchMore, currentLength, endReached, loading}: FetchMoreProps) {
  if ((!currentLength && loading) || endReached) return null

  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <Button
        loading={loading}
        variant="outlined"
        onClick={() => fetchMore({variables: {offset: currentLength}})}
      >
        Show More
      </Button>
    </Box>
  )
}
