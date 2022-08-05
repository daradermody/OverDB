import React, {useState} from "react";
import {Button, Collapse, Typography} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {LoadingPeople, PersonCard} from "../shared/cards/PersonCard";
import {gql} from "@apollo/client";
import {useGetFavouritePeopleQuery} from "../../server/generated/graphql";

export function PeopleList() {
  const [expanded, setExpanded] = useState(false)
  const {data, loading} = useGetFavouritePeopleQuery()

  const buttonIcon = expanded ? <ExpandLess/> : <ExpandMore/>
  return (
    <div>
      <Typography variant="h1">Favourite People</Typography>
      <Collapse in={expanded} collapsedSize={315}>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 20}}>
          {loading ? <LoadingPeople/> : data.favouritePeople.map(person => <PersonCard key={person.id} person={person}/>)}
        </div>
      </Collapse>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Button onClick={() => setExpanded(!expanded)} startIcon={buttonIcon} endIcon={buttonIcon}>
          {expanded ? 'Show less' : 'Show more'}
        </Button>
      </div>
    </div>
  );
}

gql`
  query GetFavouritePeople {
    favouritePeople {
      id
      profilePath
      name
    }
  }
`;
