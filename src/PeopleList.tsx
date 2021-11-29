import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Collapse, Typography} from "@material-ui/core";
import LoadingSpinner from "./LoadingSpinner";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import {PersonCard} from "./PersonCard";
import {FavouritablePerson} from "../server/types";

export function PeopleList() {
  const [expanded, setExpanded] = useState(false)
  const [people, setPeople] = useState<FavouritablePerson[] | undefined>()

  useEffect(() => {
    axios.get<FavouritablePerson[]>(`/api/person/favourites`)
      .then(response => setPeople(response.data))
  }, [])

  if (!people) {
    return <LoadingSpinner/>
  }

  const buttonIcon = expanded ? <ExpandLess/> : <ExpandMore/>
  return (
    <div style={{margin: '20px 0'}}>
      <Typography variant="h4">Favourite People</Typography>
      <Collapse in={expanded} collapsedHeight={315}>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
          {people.map(person => <PersonCard key={person.id} person={person}/>)}
        </div>
      </Collapse>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Button onClick={() => setExpanded(!expanded)} startIcon={buttonIcon} endIcon={buttonIcon}>
          {expanded ? 'Show less' : 'Show more'}
        </Button>
      </div>
    </div>
  )
}

