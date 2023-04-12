/**
 * Sample for demo only. I used shadow-cli to do upload with my private wallets.
 */
import web3, { Transaction, SystemProgram, Keypair, Connection, PublicKey } from '@solana/web3.js'
import { wallet as payerWallet } from './wallet/loadPayerWallet.js'
import { ShdwDrive } from '@shadow-drive/sdk'
import anchor from '@project-serum/anchor'

const endpoint = web3.clusterApiUrl('mainnet-beta')
const connection = new Connection(endpoint, 'confirmed')

const wallet = new anchor.Wallet(payerWallet)
const drive = await new ShdwDrive(connection, wallet).init()

const newAcct = await drive.createStorageAccount('SmaMetadata', '1MB', 'v2')
console.log(newAcct)
const uploadFile = await drive.uploadFile(new PublicKey(newAcct.shdw_bucket), {
    name: 'smaMetadata.json',
    file: Buffer.from(
        `{"name":"SMA Token","symbol":"SMA","description":"This is SMA token!","image":"https://shdw-drive.genesysgo.net/2sifduzHDN47cJJQQcHKpFfb7iZuuZoQTJSK2JGgpoqd/sma.png"}`,
    ),
})
console.log(uploadFile)
