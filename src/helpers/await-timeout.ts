import { TIMEOUT } from '..'

export async function awaitTimeout(): Promise<void> {
  const timeout = Math.floor(Math.random() * (TIMEOUT[1] - TIMEOUT[0] + 1) + TIMEOUT[0])

  return new Promise(resolve => setTimeout(resolve, timeout))
}
