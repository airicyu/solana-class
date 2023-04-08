import { Keypair } from '@solana/web3.js'
import fs from 'fs'

/**
 * load file wallet addresses
 * @returns
 */
export function loadWalletAddresses() {
    // const fileNames = fs.readdirSync("./wallets");
    // return fileNames.map((fileName) => fileName.replace(".json", ""));
    const addresses: string[] = []
    for (let i = 0; i < 100; i++) {
        let keypair = Keypair.generate()
        addresses.push(keypair.publicKey.toString())
    }
    return addresses
}
