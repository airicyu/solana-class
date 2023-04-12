import yargs from 'yargs'
import { Keypair } from '@solana/web3.js'
import fs from 'fs'
import { TokenManagement } from './lib/tokenManagement.js'
import { sign } from './sign.js'
import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const args = yargs(process.argv.slice(2)).argv

const buyAmount = args.amount
const keypairPath = args.keypair

const testUserWallet = Keypair.fromSeed(Uint8Array.from(JSON.parse(fs.readFileSync(keypairPath, 'utf-8'))).slice(0, 32))

console.log(`Test user wallet: `, testUserWallet.publicKey.toString())

// connection.requestAirdrop(testUserWallet.publicKey, LAMPORTS_PER_SOL * 2)

const transaction = await TokenManagement.draftBuyTokenTrx(testUserWallet, buyAmount)

const rl = readline.createInterface({ input, output })
const answer = await rl.question('Do you want to proceed mint? (Y/n)')
rl.close()

if (!(answer === 'n' || answer === 'N')) {
    transaction.addSignature(testUserWallet.publicKey, sign(transaction.message.serialize(), testUserWallet.secretKey))
    await TokenManagement.sendTrx(transaction)
}
