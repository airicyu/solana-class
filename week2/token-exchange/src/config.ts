import { mintAccount } from './wallet/loadMintAccount.js'
import { wallet as vaultWallet } from './wallet/loadPayerWallet.js'
import web3, { Connection, ParsedAccountData } from '@solana/web3.js'

const endpoint = web3.clusterApiUrl('devnet')
const connection = new Connection(endpoint, 'confirmed')

const tokenAccountInfo = await connection.getParsedAccountInfo(mintAccount.publicKey)
const decimals = (tokenAccountInfo.value?.data as ParsedAccountData)?.parsed?.info?.decimals as number

export const config = {
    solana: {
        endpoint,
        connection,
    },
    conversionRate: 1000, // 1 SOL = 1000 SMA
    maxSupply: 6_000, // max supply = 5000 SMA
    vaultWallet,
    mintAccount: mintAccount,
    tokenConfig: {
        decimals,
    },
}
