import { fetchHTML } from '../helpers/fetch-html'
import { handleError } from '../helpers/handle-error'
import { ACARA_URL, MAX_RETRIES } from '..'

export async function getVehicleVersions(vehicleType: string, vehicleBrand: string, vehicleModel: string, useProxy?: boolean) {
  let retry = 0

  while (retry < MAX_RETRIES) {
    try {
      const $ = await fetchHTML(`${ACARA_URL}?tipo=${vehicleType}&marca=${vehicleBrand}&modelo=${vehicleModel}`, useProxy)

      if (!$) {
        throw new Error((useProxy ? '[P] ' : '[D] ') + `Failed to fetch vehicle versions for ${vehicleType} - ${vehicleBrand} - ${vehicleModel}`)
      }

      const vehicleVersions: string[] = []

      let isOpen: boolean = false

      $('.opt-select').each((_i, el) => {
        const version = $(el).text().trim()

        if (version === 'TODAS LAS VERSIONES') {
          isOpen = true
        }

        if (isOpen) {
          vehicleVersions.push(version)
        }
      })

      vehicleVersions.shift()

      console.log((useProxy ? '[P] ' : '[D] ') + `Step 4: Vehicle versions fetched for ${vehicleType} - ${vehicleBrand} - ${vehicleModel}`)

      return vehicleVersions
    } catch (error) {
      handleError(error)

      retry++

      if (retry === MAX_RETRIES) {
        return await getVehicleVersions(vehicleType, vehicleBrand, vehicleModel, true)
      }
    }
  }

  throw new Error('Failed to fetch vehicle versions after maximum retries')
}
