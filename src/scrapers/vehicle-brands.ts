import { fetchHTML } from '../helpers/fetch-html'
import { handleError } from '../helpers/handle-error'
import { ACARA_URL, MAX_RETRIES } from '..'

export async function getVehicleBrands(vehicleType: string, useProxy?: boolean) {
  let retry = 0

  while (retry < MAX_RETRIES) {
    try {
      const $ = await fetchHTML(`${ACARA_URL}?tipo=${vehicleType}`, useProxy)

      if (!$) {
        throw new Error((useProxy ? '[P] ' : '[D] ') + `Failed to fetch vehicle brands for ${vehicleType}`)
      }

      const vehicleBrands: string[] = []

      $('.link-selector').each((i, el) => {
        if (i >= 4)
          vehicleBrands.push($(el).text().trim())
      })

      console.log((useProxy ? '[P] ' : '[D] ') + `Step 2: Vehicle brands fetched for ${vehicleType}`)

      return vehicleBrands
    } catch (error) {
      handleError(error)

      retry++

      if (retry === MAX_RETRIES) {
        return await getVehicleBrands(vehicleType, true)
      }
    }
  }

  throw new Error('Failed to fetch vehicle brands after maximum retries')
}