import styled from '@emotion/styled'
import { Card, CardActionArea, CardContent, CardMedia, Skeleton, Tooltip, Typography } from '@mui/material'
import { range } from 'lodash'
import * as React from 'react'
import { PersonCredit } from '../../../types/graphql'
import Link from '../general/Link'
import { getPosterUrl, handlePosterError } from '../general/Poster'

interface PersonCardProps {
  person: Pick<PersonCredit, 'id' | 'profilePath' | 'name'> & { jobs?: PersonCredit['jobs'] }
}

export function PersonCard({person}: PersonCardProps) {
  return (
    <StyledCard>
      <Link to={`/person/${person.id}`}>
        <CardActionArea>
          <CardMedia
            component="img"
            image={getPosterUrl(person.profilePath)}
            onError={handlePosterError}
            alt={`${person.name} photo`}
            height="256px"
            style={{
              objectFit: 'contain',
              backgroundColor: person.profilePath ? 'black' : 'white',
            }}
          />
          <CardContent style={{marginTop: -10}}>
            <Tooltip placement="top" title={<Typography>{person.name}</Typography>}>
              <Typography gutterBottom variant="body1" component="div" style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>
                {person.name}
              </Typography>
            </Tooltip>
            {isCredit(person) && (
              <Tooltip placement="top" title={<Typography>{person.jobs.join(', ')}</Typography>}>
                <Typography
                  gutterBottom
                  variant="subtitle2"
                  component="div"
                  style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}
                >
                  {person.jobs.join(', ')}
                </Typography>
              </Tooltip>
            )}
          </CardContent>
        </CardActionArea>
      </Link>
    </StyledCard>
  )
}

export function LoadingPersonCard() {
  return (
    <Card style={{width: 175}}>
      <Skeleton variant="rectangular" animation="wave" height={256}/>
      <Skeleton variant="rectangular" animation={false} height={50} style={{marginTop: 1}}/>
    </Card>
  )
}

export function LoadingPeople() {
  return (
    <>
      {range(6).map((_, i) => <LoadingPersonCard key={i}/>)}
    </>
  )
}

const StyledCard = styled(Card)`
  width: 100%;
  ${({theme}) => theme.breakpoints.up('sm')} {
    max-width: 200px;
  }
`

function isCredit<T extends { jobs: string[] }>(person: any): person is T {
  return !!(person as any).jobs
}
