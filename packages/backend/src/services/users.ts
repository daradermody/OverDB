import { readFileSync } from 'fs'
import { scryptSync, timingSafeEqual } from 'crypto'
import YAML from 'yaml'
import { dataDir } from './dataStorage'
import {User as ApiUser} from '../../types/graphql'

const usersInfo: UsersFile = YAML.parse(readFileSync(`${dataDir}/users.yml`, 'utf8'))

export async function isLoginValid(username: string, password: string): Promise<boolean> {
  if (!(username in usersInfo)) return false

  const [hashedPassword, salt] = usersInfo[username].passwordHash.split('.')
  const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex')
  const suppliedPasswordBuf = scryptSync(password, salt, 64)
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf)
}

export function getUser(username: string): User {
  if (!(username in usersInfo)) throw new Error('User does not exist')
  const {passwordHash, ...userInfo} = usersInfo[username]
  return {username, ...userInfo}
}

export function getUsers(): User[] {
  return Object.entries(usersInfo)
    .map(([username, userInfo]) => {
    const {passwordHash, ...rest} = userInfo
    return {username, ...rest}
  })
}

export type User = Pick<ApiUser, 'username' | 'avatarUrl' | 'isAdmin' | 'public'>

type UserWithHash = User & { passwordHash: string }

type UsersFile = Record<User['username'], Omit<UserWithHash, 'username'>>
