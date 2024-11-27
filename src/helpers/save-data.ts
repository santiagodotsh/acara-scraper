import * as fs from 'fs'
import { AcaraData } from '../interfaces/acara.interface'

export function saveData(data: Partial<AcaraData>) {
  fs.writeFileSync('acara-data.json', JSON.stringify(data, null, 2))
}
