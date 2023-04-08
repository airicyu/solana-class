import web3, { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { loadWalletAddresses } from './wallet/loadWallets.js'
import { wallet as defaultPayer, fallbackWallet as fallbackPayer } from './wallet/loadPayerWallet.js'
import _ from 'lodash'
import { runBatch, runEach, runLookupTableTransfer } from './wallet/transfer.js'
import { sleepMs } from './utils.js'

const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed')

/**
 * Loading payer wallet
 */
let payer = defaultPayer
let balance = await connection.getBalance(payer.publicKey)
{
    if (balance < web3.LAMPORTS_PER_SOL * 2) {
        // try airdrop
        await connection.requestAirdrop(payer.publicKey, web3.LAMPORTS_PER_SOL * 2)
        await sleepMs(800)
        balance = await connection.getBalance(payer.publicKey)

        // if airdrop not work, use fallback
        if (balance < web3.LAMPORTS_PER_SOL * 2) {
            payer = fallbackPayer
            balance = await connection.getBalance(payer.publicKey)
            if (balance < web3.LAMPORTS_PER_SOL * 2) {
                await connection.requestAirdrop(payer.publicKey, web3.LAMPORTS_PER_SOL * 2)
                await sleepMs(800)
            }
            balance = await connection.getBalance(payer.publicKey)
        }
    }
    console.log(`Payer wallet address: ${payer.publicKey}, balance: ${balance}`)
}

/**
 * Loading receipt wallets
 */
const receipients = loadWalletAddresses().map((_) => new PublicKey(_))

// await runEach(payer, receipients) // run transfer one by one
await runBatch(payer, receipients, 20) // run transfer in batch of size 20
// await runLookupTableTransfer(payer, receipients) // run transfer in batch of 55 with lookup table
await sleepMs(400)
const afterBalance = await connection.getBalance(payer.publicKey)
const transferAmount = 100 * web3.LAMPORTS_PER_SOL * 0.001
console.log(`Trx fee = ${(balance - transferAmount - afterBalance) / web3.LAMPORTS_PER_SOL} SOL`)
