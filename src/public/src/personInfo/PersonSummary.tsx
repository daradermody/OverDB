import styled from '@emotion/styled'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import {Box, Button, Skeleton, Typography} from '@mui/material'
import {useMutation, useQuery} from '@tanstack/react-query'
import {trpc} from '../queryClient.ts'
import {ErrorMessage, useDeclarativeErrorHandler} from '../shared/errorHandlers'
import {Poster} from '../shared/general/Poster'
import useSetTitle from '../shared/useSetTitle'
import useUser from '../useUser.ts'

export function PersonSummary({id}: { id: string }) {
  const {user} = useUser()
  const {data: person, isLoading: loadingPerson, error: fetchError, refetch} = useQuery(trpc.person.queryOptions({id}))
  const {data: isFavourited, isLoading: loadingIsFavourite, error: isFavouriteError} = useQuery(trpc.isFavourite.queryOptions({id}, {enabled: !!user}))
  const {mutate: setFavourite, isPending: loadingSetFavourite, error: setFavouriteError, variables} = useMutation(trpc.setFavourite.mutationOptions())

  useDeclarativeErrorHandler(`Could not ${variables?.isFavourited ? 'favourite' : 'unfavourite'}`, setFavouriteError)
  useSetTitle(person?.name)

  if (fetchError) return <ErrorMessage error={fetchError} onRetry={refetch}/>

  if (loadingPerson) return <LoadingPersonSummary/>

  return (
    <StyledWrapper>
      <Poster
        style={{height: '400px', width: '266.66px', backgroundColor: 'white'}}
        src={person!.profilePath}
        size="l"
        alt={`image of ${person!.name}`}
      />
      <div style={{width: '100%'}}>
        <Typography variant="h1" sx={{mt: 0}}>{person!.name}</Typography>
        <Typography variant="body2" style={{marginBottom: '20px'}}>Known for {person!.knownForDepartment}</Typography>
        <Typography variant="body1">{person!.biography}</Typography>
        {!!user && !isFavouriteError && (
          <Button
            loading={loadingIsFavourite || loadingSetFavourite}
            style={{marginTop: 20}}
            variant="contained"
            startIcon={isFavourited ? <FavoriteIcon style={{color: 'red'}}/> : <FavoriteBorderIcon style={{color: 'red'}}/>}
            onClick={() => setFavourite({id, isFavourited: !isFavourited})}
          >
            {isFavourited ? 'Favourited' : 'Favourite'}
          </Button>
        )}
      </div>
    </StyledWrapper>
  )
}

function LoadingPersonSummary() {
  return (
    <StyledWrapper>
      <Skeleton variant="rectangular" height={400} width={266.66} sx={{flexShrink: 0}}/>
      <Box gap="10px" width="100%">
        <Skeleton variant="rectangular" height={28} sx={{maxWidth: '200px'}}/>
        <Skeleton variant="rectangular" height={16} sx={{maxWidth: '125px', m: '24px 0 24px'}}/>
        <Skeleton variant="rectangular" height={170}/>
        <Skeleton variant="rectangular" height={37} sx={{maxWidth: '150px', mt: '20px'}}/>
      </Box>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  ${({theme}) => theme.breakpoints.up('md')} {
    flex-direction: row;
    align-items: start;
  }
`
