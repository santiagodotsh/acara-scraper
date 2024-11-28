export async function awaitTimeout(min: number, max: number): Promise<void> {
  const timeout = Math.floor(Math.random() * (max - min + 1) + min)

  return new Promise(resolve => setTimeout(resolve, timeout))
}
