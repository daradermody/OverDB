import {TRPCError} from '@trpc/server'
import { scryptSync, timingSafeEqual } from 'crypto'
import YAML from 'yaml'
import { dataDir } from './dataStorage'

const usersInfo: UsersFile = YAML.parse(await Bun.file(`${dataDir}/users.yml`).text())

export async function isLoginValid(username: string, password: string): Promise<boolean> {
  if (!(username in usersInfo)) return false

  const [hashedPassword, salt] = usersInfo[username].passwordHash.split('.')
  const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex')
  const suppliedPasswordBuf = scryptSync(password, salt, 64)
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf)
}

export function getUser(username: string): User {
  if (!(username in usersInfo)) throw new TRPCError({code: 'NOT_FOUND', message: 'User not found'})
  const {passwordHash, ...userInfo} = usersInfo[username]
  return {username, ...userInfo}
}

export function verifyUserAccessible(requestedUser: User, currentUser?: User) {
  const canViewUser = currentUser?.username === requestedUser.username || currentUser?.isAdmin || requestedUser.public
  if (!canViewUser) {
    throw new TRPCError({code: 'NOT_FOUND', message: 'User not found'})
  }
}


export function getUsers(): User[] {
  return Object.entries(usersInfo)
    .map(([username, userInfo]) => {
    const {passwordHash, ...rest} = userInfo
    return {username, ...rest}
  })
}

interface User {
  username: string;
  avatarUrl: string;
  isAdmin?: boolean;
  public?: boolean;
}

type UserWithHash = User & { passwordHash: string }

type UsersFile = Record<User['username'], Omit<UserWithHash, 'username'>>
