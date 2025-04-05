import styled from '@emotion/styled'
import { Card, CardMedia, Tooltip, Typography } from '@mui/material'
import type {Person} from '../../../../apiTypes.ts'
import Link from '../general/Link'
import { getPosterUrl, handlePosterError } from '../general/Poster'

export interface PersonCardProps {
  person: {
    id: Person['id'];
    name: Person['name'];
    profilePath?: Person['profilePath'];
    jobs?: string[];
    characters?: string[];
  };
  compressed?: boolean
  showCharactersOnly?: boolean
}

export function PersonCard({person, showCharactersOnly, compressed}: PersonCardProps) {
  return (
    <StyledCard sx={{height: compressed ? '75px' : undefined}}>
      <Link to={`/person/${person.id}`} sx={{display: compressed ? 'flex' : 'initial', height: '100%'}}>
        <PersonImage person={person} compressed={compressed}/>
        <PersonSummary person={person} compressed={compressed} showCharactersOnly={showCharactersOnly}/>
      </Link>
    </StyledCard>
  )
}

const StyledCard = styled(Card)`
  width: 100%;
  -webkit-tap-highlight-color: transparent;
`

function PersonImage({person, compressed}: PersonCardProps) {
  return (
    <CardMedia
      component="img"
      image={getPosterUrl(person.profilePath)}
      onError={handlePosterError}
      alt={`${person.name} photo`}
      style={{
        height: '100%',
        width: compressed ? 'unset' : undefined,
        aspectRatio: '185 / 278',
        objectFit: 'contain',
        backgroundColor: person.profilePath ? 'black' : 'white',
      }}
    />
  )
}

function PersonSummary({person, showCharactersOnly, compressed}: PersonCardProps) {
  return (
    <div style={{width: '100%', minWidth: 0, padding: compressed ? '11px 16px' : '16px'}}>
      <Tooltip placement="top" title={<Typography>{person.name}</Typography>}>
        <Typography gutterBottom variant="body1" component="div" style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {person.name}
        </Typography>
      </Tooltip>
      {(isCredit(person) || isCast(person)) && (
        <Tooltip placement="top" title={<Typography>{person.jobs?.join(', ') || person.characters?.join(', ')}</Typography>}>
          <Typography
            gutterBottom
            variant="subtitle2"
            component="div"
            style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}
          >
            {showCharactersOnly ? person.characters?.join(', ') : person.jobs?.join(', ')}
          </Typography>
        </Tooltip>
      )}
    </div>
  )
}

function isCredit<T extends { jobs: string[] }>(person: any): person is T {
  return 'jobs' in person
}

function isCast<T extends { character: string }>(person: any): person is T {
  return 'character' in person
}
