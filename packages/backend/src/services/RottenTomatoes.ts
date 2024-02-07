import axios, { AxiosError } from 'axios'
import { JSDOM } from 'jsdom'
import { Tomatometer, TomatometerState } from '../../types'
import getToken from '../utils/getToken'

const OMDB_TOKEN = getToken('OMDB_TOKEN')

export default class RottenTomatoes {
  static async getScore(imdbId: string): Promise<Tomatometer | null> {
    try {
      const moviePageLink = await this.getMoviePageLink(imdbId)
      if (!moviePageLink) return null
      return await this.getScoreFromPage(moviePageLink)
    } catch (e) {
      console.error((e as Error).message)
      return null
    }
  }

  static async getMoviePageLink(imdbId: string): Promise<string | null> {
    try {
      const {data} = await axios.get(`https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_TOKEN}&tomatoes=true`, {timeout: 10000})
      return data.tomatoURL === 'N/A' ? null : data.tomatoURL
    } catch (e) {
      if (e instanceof AxiosError && e.code === 'ECONNABORTED') return null
      throw e
    }
  }

  static async getScoreFromPage(link: string): Promise<Tomatometer | null> {
    const {data} = await axios.get(link)
    const dom = new JSDOM(data)
    const scoreboard = dom.window.document.getElementsByTagName('score-board-deprecated').item(0)
    const state = stateMap[scoreboard!.getAttribute('tomatometerstate') as string]
    const score = parseInt(scoreboard!.getAttribute('tomatometerscore') as string, 10)
    const consensus = dom.window.document.querySelector<HTMLSpanElement>('[data-qa="critics-consensus"]')?.innerHTML

    return state ?? score ? {state, score, consensus, link} : null
  }
}

const stateMap: Record<string, TomatometerState> = {
  'certified-fresh': TomatometerState.CertifiedFresh,
  fresh: TomatometerState.Fresh,
  rotten: TomatometerState.Rotten,
}
