import { JSDOM } from 'jsdom'
import { type Tomatometer, TomatometerState } from '../../types'
import getToken from '../utils/getToken'
const OMDB_TOKEN = getToken('OMDB_TOKEN')

export default class RottenTomatoes {
  static async getScore(imdbId: string): Promise<Tomatometer | null> {
    try {
      const moviePageLink = await this.getMoviePageLink(imdbId)
      if (!moviePageLink) return null
      return await this.getScoreFromPage(moviePageLink)
    } catch (e) {
      console.error((e as Error))
      return null
    }
  }

  static async getMoviePageLink(imdbId: string): Promise<string | null> {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_TOKEN}&tomatoes=true`)
    const { tomatoURL } = await response.json() as { tomatoURL: string }
    return tomatoURL === 'N/A' ? null : tomatoURL
  }

  static async getScoreFromPage(link: string): Promise<Tomatometer | null> {
    const response = await fetch(link)
    const data: string = await response.text()
    const dom = new JSDOM(data)

    const score = parseInt(dom.window.document.querySelector('[slot="criticsScore"]')?.textContent?.trim() || '')
    const criticsScoreIcon = dom.window.document.querySelector('media-scorecard score-icon-critics')!
    const state = stateMap[`${criticsScoreIcon.getAttribute('sentiment')}:${criticsScoreIcon.getAttribute('certified')}`]
    const consensus = dom.window.document.querySelector('#critics-consensus > p')?.textContent?.trim()

    return (state && score) ? {state, score, consensus, link} : null
  }
}

const stateMap: Record<string, TomatometerState> = {
  'POSITIVE:true': TomatometerState.CertifiedFresh,
  'POSITIVE:false': TomatometerState.Fresh,
  'NEGATIVE:true': TomatometerState.Rotten,
  'NEGATIVE:false': TomatometerState.Rotten,
}
