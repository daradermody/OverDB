import axios from 'axios';
import {JSDOM} from 'jsdom';
import {Tomatometer, TomatometerState} from '../../types';

export default class RottenTomatoes {
  static async getScore(title: string, year: number): Promise<Tomatometer | null> {
    try {
      const moviePageLink = await this.getMoviePageLink(title, year)

      if (!moviePageLink) {
        return null
      }
      return await this.getScoreFromPage(moviePageLink)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  static async getMoviePageLink(title: string, year: number): Promise<string | null> {
    const {data} = await axios.get(`https://www.rottentomatoes.com/search?search=${title}`)
    const dom = new JSDOM(data)
    const elements = dom.window.document.querySelectorAll(`search-page-media-row[releaseyear="${year}"]`)

    for (const el of Array.from(elements)) {
      const titleElement = el.querySelector<HTMLAnchorElement>('a[slot="title"]')
      if (titleElement && titleElement.innerHTML.trim() === title) {
        return titleElement.href
      }
    }
    return null
  }

  static async getScoreFromPage(link: string): Promise<Tomatometer | null> {
    const {data} = await axios.get(link)
    const dom = new JSDOM(data)
    const scoreboard = dom.window.document.getElementsByTagName('score-board').item(0)
    const state = stateMap[scoreboard!.getAttribute('tomatometerstate') as string]
    const score = parseInt(scoreboard!.getAttribute('tomatometerscore') as string, 10)
    const consensus = dom.window.document.querySelector<HTMLSpanElement>('[data-qa="critics-consensus"]')?.innerHTML

    return state ?? score ? { state, score, consensus, link } : null
  }
}

const stateMap: Record<string, TomatometerState> = {
  'certified-fresh': TomatometerState.CertifiedFresh,
  fresh: TomatometerState.Fresh,
  rotten: TomatometerState.Rotten,
}
