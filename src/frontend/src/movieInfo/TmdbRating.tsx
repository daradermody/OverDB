import { Box, CircularProgress, Tooltip, Typography } from '@mui/material'

interface TmdbRatingProps {
  id: string;
  vote: number;
  release?: string;
}

export function TmdbRating({id, vote, release}: TmdbRatingProps) {
  return (
    <div
      style={{
        position: 'relative',
        display: (!release || release > new Date().toISOString()) ? 'none' : 'flex',
        top: -68,
        height: 0,
        right: 10,
        width: '100%',
        justifyContent: 'right'
      }}
    >
      <Tooltip placement="top" arrow title={<Typography>See on The Movie Database</Typography>}>
        <a
          style={{color: 'white'}}
          target="_blank"
          href={`https://www.themoviedb.org/movie/${id}`}
        >
          <CircularProgressWithLabel value={vote * 10}/>
        </a>
      </Tooltip>
    </div>
  )
}

function CircularProgressWithLabel(props: { value: number }) {
  return (
    <Box style={{position: 'relative', display: 'inline-flex'}}>
      <Box
        style={{
          backgroundColor: '#081c22',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%'
        }}
      >
        <Typography
          variant="body1"
          component="div"
        >
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
      <CircularProgress
        variant="determinate"
        size="50px"
        style={{margin: '2px', color: getColor(props.value)}}
        value={props.value}
      />
    </Box>
  )
}

function getColor(rating: number) {
  if (rating >= 70) {
    return '#21d07a'
  } else if (rating >= 40) {
    return '#d2d531'
  } else {
    return '#db2360'
  }
}
