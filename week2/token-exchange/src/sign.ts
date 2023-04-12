import { sha512 } from '@noble/hashes/sha512'
import * as ed25519 from '@noble/ed25519'
import { Ed25519SecretKey } from '@solana/web3.js'

ed25519.etc.sha512Sync = (...m) => sha512(ed25519.etc.concatBytes(...m))
export const sign = (message: Parameters<typeof ed25519.sign>[0], secretKey: Ed25519SecretKey) => ed25519.sign(message, secretKey.slice(0, 32))
