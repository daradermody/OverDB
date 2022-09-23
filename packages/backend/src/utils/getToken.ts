export default function getToken(varName: string): string {
  const secret = process.env[varName]
  if (!secret) {
    throw new Error(`The ${varName} environment variable is not set, exiting.`)
  }
  return secret
}