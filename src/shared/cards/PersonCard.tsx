import {Card, CardActionArea, CardContent, CardMedia, Skeleton, Tooltip, Typography} from "@mui/material";
import {range} from "lodash";
import React from "react";
import {PersonCredit} from "../../../server/generated/graphql";
import Link from "../general/Link";
import {getPosterUrl} from "../general/Poster";

interface PersonCardProps {
  person: Pick<PersonCredit, 'id' | 'profilePath' | 'name'> & { jobs?: PersonCredit['jobs'] }
}

export function PersonCard({person}: PersonCardProps) {
  return (
    <Card style={{width: 175}}>
      <Link to={`/person/${person.id}`}>
        <CardActionArea>
          <CardMedia
            component="img"
            image={getPosterUrl(person.profilePath)}
            alt={`${person.name} photo`}
            height="262px"
            style={{objectFit: person.profilePath ? 'fill' : 'contain', backgroundColor: 'white'}}
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
    </Card>
  )
}

export function LoadingPersonCard() {
  return (
    <Card style={{width: 175}}>
      <Skeleton variant="rectangular" animation="wave" height={262}/>
      <Skeleton variant="rectangular" animation={false} height={50} style={{marginTop: 1}}/>
    </Card>
  );
}

export function LoadingPeople() {
  return (
    <>
      {range(6).map((_, i) => <LoadingPersonCard key={i}/>)}
    </>
  )
}

function isCredit<T extends { jobs: string[] }>(person: any): person is T {
  return !!(person as any).jobs
}
