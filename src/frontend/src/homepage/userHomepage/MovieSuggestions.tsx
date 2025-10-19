import {Loop} from '@mui/icons-material'
import {CircularProgress, IconButton, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {trpc} from '../../queryClient.ts'
import {MovieCards} from '../../shared/cards'
import {ErrorMessage} from '../../shared/errorHandlers'

export function MovieSuggestions() {
  const recommended = useQuery(trpc.recommendedMovies.queryOptions({size: 18}))
  const trending = useQuery(trpc.trendingMovies.queryOptions({size: 18}, {enabled: !recommended.isLoading && !recommended.data?.length}))

  const error = recommended.error || trending.error
  if (error) {
    return <ErrorMessage error={error} onRetry={recommended.isError ? recommended.refetch : trending.refetch}/>
  }

  if (recommended.isLoading || recommended.data?.length) {
    return (
      <div>
        <div style={{display: 'flex', alignItems: 'center', gap: 4, marginBottom: '42px'}}>
          <Typography variant="h1">Recommended</Typography>
          <IconButton onClick={() => recommended.refetch()} disabled={recommended.isLoading} size="small">
            {recommended.isLoading ? <CircularProgress size={20}/> : <Loop/>}
          </IconButton>
        </div>
        <MovieCards movies={recommended.data} loading={recommended.isLoading} loadingCount={18}/>
      </div>
    )
  } else {
    return (
      <div>
        <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
          <Typography variant="h1">Recommended</Typography>
        </div>
        <Typography variant="body1" sx={{mb: 2}}>
          Favourite some people and movies to start getting movie recommendations. Here are some trending movies to get your started.
        </Typography>
        <MovieCards movies={trending.data} loading={trending.isLoading} loadingCount={18}/>
      </div>
    )
  }
}
