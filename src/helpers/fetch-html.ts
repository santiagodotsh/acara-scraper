import axios, {
  type AxiosResponse,
  type AxiosRequestConfig
} from 'axios'
import * as cheerio from 'cheerio'
import 'dotenv/config'
import { awaitTimeout } from './await-timeout'

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Version/13.1 Safari/537.36'
]

export async function fetchHTML(url: string, useProxy?: boolean): Promise<cheerio.CheerioAPI | null> {
  const selectedUserAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
  
  const config: AxiosRequestConfig = {
    method: 'GET',
    url,
    maxBodyLength: Infinity,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': selectedUserAgent
    }
  }

  const proxyConfig: AxiosRequestConfig = {
    ...config,
    url: 'https://api.scraperapi.com',
    params: {
      api_key: process.env.SCRAPER_API_KEY,
      url
    }
  }

  delete proxyConfig.headers!['User-Agent']

  if (!useProxy) {
    await awaitTimeout()
  }

  try {
    const { data }: AxiosResponse<string> = await axios.request(useProxy ? proxyConfig : config)

    return cheerio.load(data)
  } catch (error) {
    return null
  }
}
