import yargs from 'yargs'
import { Keypair } from '@solana/web3.js'
import fs from 'fs'
import { TokenManagement } from './lib/tokenManagement.js'
import { sign } from './sign.js'
import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const args = yargs(process.argv.slice(2)).argv

const mintAmount = args.amount

const transaction = await TokenManagement.draftVaultMintTokenTrx(mintAmount)

const rl = readline.createInterface({ input, output })
const answer = await rl.question('Do you want to proceed mint? (Y/n)')
rl.close()

if (!(answer === 'n' || answer === 'N')) {
    // Send transaction
    await TokenManagement.sendTrx(transaction)
}
