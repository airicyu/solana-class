import {
    Keypair,
    LAMPORTS_PER_SOL,
    MessageV0,
    ParsedAccountData,
    PublicKey,
    SystemProgram,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
    sendAndConfirmTransaction,
} from '@solana/web3.js'
import { config } from '../config.js'
import {
    createBurnCheckedInstruction,
    createMintToInstruction,
    createTransferInstruction,
    getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token'
import { sign } from '../sign.js'

const connection = config.solana.connection

export class TokenManagement {
    /**
     * Draft Trx for mint
     *
     * @param minter
     * @param mintAmount
     * @returns
     */
    static async draftMintTokenTrx(minter: Keypair, mintAmount: number) {
        /**
         * Input validations, pre-processing
         */
        if (mintAmount <= 0) {
            throw new Error('Invalid mint amount!')
        }

        const inputAmount = mintAmount / config.conversionRate

        const tokenSupply = TokenManagement.getTokenAmountFromNumber(await TokenManagement.getTokenSupply())
        if (config.maxSupply - tokenSupply - mintAmount < 0) {
            throw new Error('Exceed token max supply!')
        }

        console.log(`Mint token operation, minter: ${minter.publicKey.toString()}, input ${inputAmount} SOL to get ${mintAmount} token.`)

        /**
         * Prep associate token account
         */
        const minterATA = await getOrCreateAssociatedTokenAccount(connection, minter, config.mintAccount.publicKey, minter.publicKey)
        console.log(
            `minter Account: ${minterATA.address.toString()}, original holding ${TokenManagement.getTokenAmountFromNumber(
                +minterATA.amount.toString(),
            )} tokens.`,
        )

        const instructions: TransactionInstruction[] = []

        /**
         * Prep 2 instructions,
         *
         * 1) User transfer SOL to Vault
         * 2) Mint token to user
         */
        instructions.push(
            SystemProgram.transfer({
                fromPubkey: minter.publicKey,
                toPubkey: config.vaultWallet.publicKey,
                lamports: LAMPORTS_PER_SOL * inputAmount,
            }),
            createMintToInstruction(
                config.mintAccount.publicKey, //Mint
                minterATA.address, //Destination Token Account
                config.vaultWallet.publicKey, //Authority
                TokenManagement.getTokenNumber(mintAmount), //number of tokens
            ),
        )

        const latestBlockHash = await connection.getLatestBlockhash()
        const message = new TransactionMessage({
            payerKey: minter.publicKey,
            recentBlockhash: latestBlockHash.blockhash,
            instructions,
        }).compileToV0Message()

        const v0Trx = new VersionedTransaction(message)

        const messageData = v0Trx.message.serialize()

        // transaction signed by authority owner
        v0Trx.addSignature(config.vaultWallet.publicKey, sign(messageData, config.vaultWallet.secretKey))

        return v0Trx
    }

    /**
     * Draft Trx for free mint to Vault
     *
     * @param mintAmount
     * @returns
     */
    static async draftVaultMintTokenTrx(mintAmount: number) {
        /**
         * Input validations, pre-processing
         */
        if (mintAmount <= 0) {
            throw new Error('Invalid mint amount!')
        }

        const tokenSupply = TokenManagement.getTokenAmountFromNumber(await TokenManagement.getTokenSupply())
        if (config.maxSupply - tokenSupply - mintAmount < 0) {
            throw new Error('Exceed token max supply!')
        }

        console.log(`Vault Mint token operation, get ${mintAmount} token.`)

        /**
         * Prep associate token account
         */
        const vaultATA = await getOrCreateAssociatedTokenAccount(
            connection,
            config.vaultWallet,
            config.mintAccount.publicKey,
            config.vaultWallet.publicKey,
        )
        console.log(
            `Vault Account: ${vaultATA.address.toString()}, original holding ${TokenManagement.getTokenAmountFromNumber(
                +vaultATA.amount.toString(),
            )} tokens.`,
        )

        const instructions: TransactionInstruction[] = []

        /**
         * Prep instruction for free mint to vault
         */
        instructions.push(
            createMintToInstruction(
                config.mintAccount.publicKey, //Mint
                vaultATA.address, //Destination Token Account
                config.vaultWallet.publicKey, //Authority
                TokenManagement.getTokenNumber(mintAmount), //number of tokens
            ),
        )

        const latestBlockHash = await connection.getLatestBlockhash()
        const message = new TransactionMessage({
            payerKey: config.vaultWallet.publicKey,
            recentBlockhash: latestBlockHash.blockhash,
            instructions,
        }).compileToV0Message()

        const v0Trx = new VersionedTransaction(message)

        const messageData = v0Trx.message.serialize()

        // transaction signed by authority owner
        v0Trx.addSignature(config.vaultWallet.publicKey, sign(messageData, config.vaultWallet.secretKey))

        return v0Trx
    }

    /**
     * Draft Trx for buy token from Vault
     *
     * @param buyer
     * @param buyAmount
     * @returns
     */
    static async draftBuyTokenTrx(buyer: Keypair, buyAmount: number) {
        /**
         * Input validations, pre-processing
         */
        if (buyAmount <= 0) {
            throw new Error('Invalid buy amount!')
        }

        const inputAmount = buyAmount / config.conversionRate

        const tokenSupply = TokenManagement.getTokenAmountFromNumber(await TokenManagement.getTokenSupply())
        if (config.maxSupply - tokenSupply - buyAmount < 0) {
            throw new Error('Exceed token max supply!')
        }

        console.log(`Buy token operation, buyer: ${buyer.publicKey.toString()}, input ${inputAmount} SOL to get ${buyAmount} token.`)

        /**
         * Prep associate token account
         */
        const vaultATA = await getOrCreateAssociatedTokenAccount(
            connection,
            config.vaultWallet,
            config.mintAccount.publicKey,
            config.vaultWallet.publicKey,
        )
        console.log(`Vault Account: ${vaultATA.address.toString()}`)

        const minterATA = await getOrCreateAssociatedTokenAccount(connection, buyer, config.mintAccount.publicKey, buyer.publicKey)
        console.log(
            `minter Account: ${minterATA.address.toString()}, original holding ${TokenManagement.getTokenAmountFromNumber(
                +minterATA.amount.toString(),
            )} tokens.`,
        )

        const instructions: TransactionInstruction[] = []

        /**
         * Prep 2 instructions,
         *
         * 1) User transfer SOL to Vault
         * 2) Vault transfer token to user
         */
        instructions.push(
            SystemProgram.transfer({
                fromPubkey: buyer.publicKey,
                toPubkey: vaultATA.address,
                lamports: LAMPORTS_PER_SOL * inputAmount,
            }),
            createTransferInstruction(vaultATA.address, minterATA.address, config.vaultWallet.publicKey, TokenManagement.getTokenNumber(buyAmount)),
        )

        const latestBlockHash = await connection.getLatestBlockhash()
        const message = new TransactionMessage({
            payerKey: buyer.publicKey,
            recentBlockhash: latestBlockHash.blockhash,
            instructions,
        }).compileToV0Message()

        const v0Trx = new VersionedTransaction(message)

        const messageData = v0Trx.message.serialize()

        // transaction signed by authority owner
        v0Trx.addSignature(config.vaultWallet.publicKey, sign(messageData, config.vaultWallet.secretKey))

        return v0Trx
    }

    /**
     * Draft Trx for burn
     *
     * @param burner
     * @param burnAmount
     * @returns
     */
    static async draftBurnTokenTrx(burner: Keypair, burnAmount: number) {
        /**
         * Input validations, pre-processing
         */
        if (burnAmount <= 0) {
            throw new Error('Invalid burn amount!')
        }

        console.log(`Burn token operation, burner: ${burner.publicKey.toString()}, burn ${burnAmount} token.`)

        /**
         * Prep associate token account
         */
        const burnerATA = await getOrCreateAssociatedTokenAccount(connection, burner, config.mintAccount.publicKey, burner.publicKey)
        const holdingAmount = TokenManagement.getTokenAmountFromNumber(+burnerATA.amount.toString())
        console.log(`burner Account: ${burnerATA.address.toString()}, original holding ${holdingAmount} tokens.`)

        if (holdingAmount < burnAmount) {
            throw new Error('Insufficient token amount to burn!')
        }

        const instructions: TransactionInstruction[] = []

        /**
         * Prep instruction for burn user token
         */
        instructions.push(
            createBurnCheckedInstruction(
                burnerATA.address,
                config.mintAccount.publicKey,
                burner.publicKey,
                TokenManagement.getTokenNumber(burnAmount),
                config.tokenConfig.decimals,
            ),
        )

        const latestBlockHash = await connection.getLatestBlockhash()
        const message = new TransactionMessage({
            payerKey: burner.publicKey,
            recentBlockhash: (await latestBlockHash).blockhash,
            instructions,
        }).compileToV0Message()

        const v0Trx = new VersionedTransaction(message)

        return v0Trx
    }

    static async sendTrx(transaction: VersionedTransaction) {
        const trxHash = await (sendAndConfirmTransaction as any)(connection, transaction)

        console.log(`Transaction Success!🎉\n https://explorer.solana.com/tx/${trxHash}?cluster=devnet`)
        return trxHash
    }

    static async getTokenSupply(): Promise<number> {
        const tokenAccountInfo = await connection.getParsedAccountInfo(config.mintAccount.publicKey)
        return (tokenAccountInfo.value?.data as ParsedAccountData)?.parsed?.info?.supply as number
    }

    /**
     * 1 => 1000
     * 0.1 => 100
     *
     * @param tokenAmount
     * @returns
     */
    static getTokenNumber(tokenAmount: number) {
        return tokenAmount * 10 ** config.tokenConfig.decimals
    }

    static getTokenAmountFromNumber(tokenNumber: number) {
        return tokenNumber / 10 ** config.tokenConfig.decimals
    }
}
