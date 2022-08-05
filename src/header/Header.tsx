import {Container, styled, Typography} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";
import {isMovieSummary} from "../../server/types";
import Link from "../shared/general/Link";
import {ProfileIcon} from "./ProfileIcon";
import {Search} from "./Search";

export function Header() {
  const navigate = useNavigate()
  return (
    <Root>
      <Container sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/">
          <Typography sx={{fontSize: 32}}>OverDB</Typography>
        </Link>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Search
            clearOnSelect
            onSelect={result => navigate(isMovieSummary(result) ? `/movie/${result.id}` : `/person/${result.id}`)}
          />
          <ProfileIcon/>
        </div>
      </Container>
    </Root>
  )
}

const Root = styled('div')(({theme}) => ({
  color: theme.palette.text.primary,
  backgroundColor: '#430568',
}))
