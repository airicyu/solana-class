import { Keypair } from '@solana/web3.js'

//SMAnja1DeYqgBov2epS4322Ltxb7yiN6d5wQhsWvUX4
const privateKey = Uint8Array.from(
    [
        228, 72, 162, 55, 33, 13, 4, 38, 103, 13, 33, 181, 202, 57, 5, 243, 95, 143, 28, 111, 93, 76, 188, 196, 75, 140, 78, 30, 151, 238, 6, 130, 6,
        126, 83, 59, 100, 167, 69, 84, 2, 169, 236, 137, 155, 61, 218, 119, 56, 220, 22, 81, 174, 194, 99, 99, 27, 127, 103, 235, 162, 3, 57, 115,
    ].slice(0, 32),
)

const mintAccount = Keypair.fromSeed(privateKey)

export { mintAccount }
