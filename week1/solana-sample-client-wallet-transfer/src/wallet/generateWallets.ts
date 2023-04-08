/**
 * Script for run alone once to generate N wallets.
 * The file wallets are stored under the "wallets" folder.
 */
import { Keypair } from '@solana/web3.js'
import fs from 'fs'

function generateWallet(n) {
    if (!fs.existsSync('./wallets')) {
        fs.mkdirSync('./wallets')
    }
    for (let i = 0; i < n; i++) {
        let keypair = Keypair.generate()
        console.log(keypair.publicKey.toString())
        fs.writeFileSync(`./wallets/${keypair.publicKey.toString()}.json`, '[' + keypair.secretKey.toString() + ']', 'utf-8')
    }
}

generateWallet(100)
