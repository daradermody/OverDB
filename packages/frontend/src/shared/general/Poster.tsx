import * as React from 'react'
import { ImgHTMLAttributes } from 'react'

export function Poster(props: ImgHTMLAttributes<Element> & { size?: 'm' | 'l' } = {size: 'm'}) {
  if (props.src) {
    return <img alt="movie or person poster" {...props} src={getPosterUrl(props.src, props.size)} data-attempts={0} onError={handlePosterError}/>
  } else {
    return (
      <div {...props} style={{display: 'flex', justifyContent: 'center', backgroundColor: '#dbdbdb', alignItems: 'center', flexShrink: 0, ...props.style}}>
        <img
          src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg"
          alt="placeholder poster"
        />
      </div>
    )
  }
}

export function getPosterUrl(path?: string, size: 'm' | 'l' = 'm') {
  const fileSize = size === 'l' ? 'w342' :  'w185'
  if (path) {
    return `https://image.tmdb.org/t/p/${fileSize}${path}`
  } else {
    return 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'
  }
}

export function handlePosterError(e) {
  const attempts = Number(e.target.getAttribute('data-attempts')) + 1
  e.target.setAttribute('data-attempts', attempts.toString())
  if (attempts < 3) {
    setTimeout(() => e.target.src = e.target.src, 1000)
  }
}
