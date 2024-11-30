import { AcaraData } from './interfaces/acara.interface'

export const ACARA_URL: string = 'https://www.acara.org.ar/guia-oficial-de-precios.php'
export const TIMEOUT: [number, number] = [500, 1000]
export const MAX_RETRIES: number = 3

let ACARA_DATA: AcaraData = {}

async function main() {
  console.log('Acara scraper is running')
}

main()
