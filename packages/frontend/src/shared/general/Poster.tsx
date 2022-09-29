import * as React from 'react'

export function Poster(props: { path?: string }) {
  if (props.path) {
    return <img style={{height: '81px', width: '54px'}} src={getPosterUrl(props.path)} alt="movie or person poster"/>
  } else {
    return (
      <div style={{display: 'flex', height: '81px', width: '54px', justifyContent: 'center', backgroundColor: '#dbdbdb', alignItems: 'center'}}>
        <img
          src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg"
          alt="placeholder poster"/>
      </div>
    )
  }
}

export function getPosterUrl(path?: string) {
  if (path) {
    return `https://image.tmdb.org/t/p/w220_and_h330_face${path}`
  } else {
    return 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'
  }
}
