import { randomBytes, scryptSync } from 'node:crypto'

async function main() {
  const password = process.argv[2]
  if (!password) {
    throw new Error('No password provided')
  }
  const salt = randomBytes(32).toString('hex')
  const hash = scryptSync(password, salt, 64).toString("hex")
  console.log(`${hash}.${salt}`)
}

main().catch(console.error)
