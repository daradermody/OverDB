import { Theme as MuiTheme } from '@mui/material'
import { Movie, Person } from './graphql'

declare module '@emotion/react' {
  export interface Theme extends MuiTheme {}
}

export function isMovie(item: {title: Movie['title']} | { name: Person['name']}): item is {title: Movie['title']} {
  return 'title' in item
}
