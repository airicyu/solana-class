import { mintAccount } from './wallet/loadMintAccount.js'

export const config = {
    mintAccount: mintAccount,
    mintConfig: {
        numDecimals: 3,
        numberTokens: 4990,
    },
}
