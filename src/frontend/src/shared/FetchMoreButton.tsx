import { Box, Button } from '@mui/material'

interface FetchMoreProps {
  fetchMore(): void;
  endReached?: boolean
  loading?: boolean
}

export default function FetchMoreButton({fetchMore, endReached, loading}: FetchMoreProps) {
  if (endReached) return null

  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <Button loading={loading} variant="outlined" onClick={() => fetchMore()}>
        Show More
      </Button>
    </Box>
  )
}
