import { getVehicleTypes } from './scrapers/vehicle-types'
import { getVehicleBrands } from './scrapers/vehicle-brands'
import { getVehicleModels } from './scrapers/vehicle-models'
import { getVehicleVersions } from './scrapers/vehicle-versions'
import { getVehiclePrices } from './scrapers/vehicle-prices'
import { saveData } from './helpers/save-data'
import { AcaraData } from './interfaces/acara.interface'

export const ACARA_URL: string = 'https://www.acara.org.ar/guia-oficial-de-precios.php'
export const TIMEOUT: [number, number] = [500, 1000]
export const MAX_RETRIES: number = 3

let ACARA_DATA: AcaraData = {}

async function main() {
  const vehicleTypes = await getVehicleTypes()

  for (const vehicleType of vehicleTypes) {
    ACARA_DATA[vehicleType] = {}
    saveData(ACARA_DATA)

    const vehicleBrands = await getVehicleBrands(vehicleType)

    for (const vehicleBrand of vehicleBrands) {
      ACARA_DATA[vehicleType][vehicleBrand] = {}
      saveData(ACARA_DATA)

      const vehicleModels = await getVehicleModels(vehicleType, vehicleBrand)

      for (const model of vehicleModels) {
        ACARA_DATA[vehicleType][vehicleBrand][model] = {}
        saveData(ACARA_DATA)

        const vehicleVersions = await getVehicleVersions(vehicleType, vehicleBrand, model)

        for (const version of vehicleVersions) {
          ACARA_DATA[vehicleType][vehicleBrand][model][version] = {}
          saveData(ACARA_DATA)

          const vehiclePrices = await getVehiclePrices(vehicleType, vehicleBrand, model, version)

          ACARA_DATA[vehicleType][vehicleBrand][model][version] = vehiclePrices
          saveData(ACARA_DATA)
        }
      }
    }
  }

  console.log('Data saved!')
}

main()
