import { fetchHTML } from '../helpers/fetch-html'
import { handleError } from '../helpers/handle-error'
import { ACARA_URL, MAX_RETRIES } from '..'

export async function getVehiclePrices(vehicleType: string, vehicleBrand: string, vehicleModel: string, vehicleVersion: string, useProxy?: boolean) {
  let retry = 0

  while (retry < MAX_RETRIES) {
    try {
      const $ = await fetchHTML(`${ACARA_URL}?tipo=${vehicleType}&marca=${vehicleBrand}&modelo=${vehicleModel}&version=${vehicleVersion}`, useProxy)

      if (!$) {
        throw new Error((useProxy ? '[P] ' : '[D] ') + `Failed to fetch vehicle prices for ${vehicleType} - ${vehicleBrand} - ${vehicleModel} - ${vehicleVersion}`)
      }

      const years: string[] = []

      $('thead > tr > th').each((_i, el) => {
        years.push($(el).text().trim())
      })

      years.splice(0, 3)

      const prices: string[] = []

      $('tbody > tr > td').each((_i, el) => {
        prices.push($(el).text().trim())
      })

      prices.splice(0, 3)
      prices.pop()

      const pricesByYear: Record<string, string> = {}

      for (let i = 0; i < years.length; i++) {
        pricesByYear[years[i]] = prices[i]
      }

      for (const year in pricesByYear) {
        if (pricesByYear[year] === '-') {
          delete pricesByYear[year]
        }
      }

      console.log((useProxy ? '[P] ' : '[D] ') + `Step 5: Vehicle prices fetched for ${vehicleType} - ${vehicleBrand} - ${vehicleModel} - ${vehicleVersion}`)

      return pricesByYear
    } catch (error) {
      handleError(error)

      retry++

      if (retry === MAX_RETRIES) {
        return await getVehiclePrices(vehicleType, vehicleBrand, vehicleModel, vehicleVersion, true)
      }
    }
  }

  throw new Error('Failed to fetch vehicle prices after maximum retries')
}
