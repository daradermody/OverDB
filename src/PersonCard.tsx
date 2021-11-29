import {Card, CardActionArea, CardContent, CardMedia, Link, Tooltip, Typography} from "@material-ui/core";
import {Link as RouterLink} from "react-router-dom";
import {getPosterUrl} from "./Poster";
import React from "react";

export function PersonCard({person}: { person: { id: number, profile_path: string, name: string, jobs?: string[] } }) {
  return (
    <Card style={{width: 175, margin: 10}}>
      <Link
        underline="none"
        component={RouterLink}
        to={`/person/${person.id}`}
        style={{textDecoration: 'none', color: 'white'}}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            image={getPosterUrl(person.profile_path)}
            alt={`${person.name} photo`}
            height="262px"
            style={{objectFit: person.profile_path ? 'fill' : 'contain', backgroundColor: 'white'}}
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

function isCredit<T extends { jobs: string[] }>(person: any): person is T {
  return !!(person as any).jobs
}
