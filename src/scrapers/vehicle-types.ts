import { fetchHTML } from '../helpers/fetch-html'
import { handleError } from '../helpers/handle-error'
import { ACARA_URL, MAX_RETRIES } from '..'

export async function getVehicleTypes(useProxy?: boolean): Promise<string[]> {
  let retry = 0

  while (retry < MAX_RETRIES) {
    try {
      const $ = await fetchHTML(ACARA_URL, useProxy)

      if (!$) {
        throw new Error((useProxy ? '[P] ' : '[D] ') + 'Failed to fetch vehicle types')
      }

      const vehicleTypes: string[] = []

      $('.link-selector').each((i, el) => {
        if (i < 4)
          vehicleTypes.push($(el).text().trim())
      })

      console.log((useProxy ? '[P] ' : '[D] ') + 'Step 1: Vehicle types fetched')

      return vehicleTypes
    } catch (error) {
      handleError(error)

      retry++

      if (retry === MAX_RETRIES) {
        return await getVehicleTypes(true)
      }
    }
  }

  throw new Error('Failed to fetch vehicle types after maximum retries')
}
