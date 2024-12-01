import { fetchHTML } from '../helpers/fetch-html'
import { handleError } from '../helpers/handle-error'
import { ACARA_URL, MAX_RETRIES } from '..'

export async function getVehicleModels(vehicleType: string, vehicleBrand: string, useProxy?: boolean) {
  let retry = 0

  while (retry < MAX_RETRIES) {
    try {
      const $ = await fetchHTML(`${ACARA_URL}?tipo=${vehicleType}&marca=${vehicleBrand}`, useProxy)

      if (!$) {
        throw new Error((useProxy ? '[P] ' : '[D] ') + `Failed to fetch vehicle models for ${vehicleType} - ${vehicleBrand}`)
      }

      const vehicleModels: string[] = []

      $('.opt-select').each((_i, el) => {
        vehicleModels.push($(el).text().trim())
      })

      vehicleModels.shift()
      vehicleModels.pop()

      console.log((useProxy ? '[P] ' : '[D] ') + `Step 3: Vehicle models fetched for ${vehicleType} - ${vehicleBrand}`)

      return vehicleModels
    } catch (error) {
      handleError(error)

      retry++

      if (retry === MAX_RETRIES) {
        return await getVehicleModels(vehicleType, vehicleBrand, true)
      }
    }
  }

  throw new Error('Failed to fetch vehicle models after maximum retries')
}
