import web3, {
    SystemProgram,
    Keypair,
    Connection,
    PublicKey,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
} from '@solana/web3.js'
import {
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
    createInitializeMintInstruction,
    getMinimumBalanceForRentExemptMint,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction,
    getAssociatedTokenAddressSync,
} from '@solana/spl-token'
import { DataV2, createCreateMetadataAccountV2Instruction } from '@metaplex-foundation/mpl-token-metadata'
import { findMetadataPda, UploadMetadataInput } from '@metaplex-foundation/js'
import { wallet } from './wallet/loadPayerWallet.js'
import { config } from './config.js'

const endpoint = web3.clusterApiUrl('devnet')
const connection = new Connection(endpoint, 'confirmed')

const MY_TOKEN_METADATA: UploadMetadataInput = {
    name: 'SMA Token',
    symbol: 'SMA',
    description: 'This is SMA token!',
    image: 'https://shdw-drive.genesysgo.net/2sifduzHDN47cJJQQcHKpFfb7iZuuZoQTJSK2JGgpoqd/sma.png',
}
const ON_CHAIN_METADATA = {
    name: MY_TOKEN_METADATA.name,
    symbol: MY_TOKEN_METADATA.symbol,
    uri: 'https://shdw-drive.genesysgo.net/2sifduzHDN47cJJQQcHKpFfb7iZuuZoQTJSK2JGgpoqd/smaMetadata.json',
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
} as DataV2

const createNewMintTransaction = async (
    connect: Connection,
    payer: Keypair,
    mintKeypair: Keypair,
    destinationWallet: PublicKey,
    mintAuthority: PublicKey,
    freezeAuthority: PublicKey,
) => {
    //Get the minimum lamport balance to create a new account and avoid rent payments
    const requiredBalance = await getMinimumBalanceForRentExemptMint(connection)

    //metadata account associated with mint
    const metadataPDA = await findMetadataPda(mintKeypair.publicKey)
    //get associated token account of your wallet
    const tokenATA = getAssociatedTokenAddressSync(mintKeypair.publicKey, destinationWallet)

    const instructions: TransactionInstruction[] = []

    instructions.push(
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: MINT_SIZE,
            lamports: requiredBalance,
            programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
            mintKeypair.publicKey, //Mint Address
            config.mintConfig.numDecimals, //Number of Decimals of New mint
            mintAuthority, //Mint Authority
            freezeAuthority, //Freeze Authority
            TOKEN_PROGRAM_ID,
        ),
        createAssociatedTokenAccountInstruction(
            payer.publicKey, //Payer
            tokenATA, //Associated token account
            payer.publicKey, //Token account owner
            mintKeypair.publicKey, //Mint
        ),
        createMintToInstruction(
            mintKeypair.publicKey, //Mint
            tokenATA, //Destination Token Account
            mintAuthority, //Authority
            config.mintConfig.numberTokens * Math.pow(10, config.mintConfig.numDecimals), //number of tokens
        ),
        createCreateMetadataAccountV2Instruction(
            {
                metadata: metadataPDA,
                mint: mintKeypair.publicKey,
                mintAuthority: mintAuthority,
                payer: payer.publicKey,
                updateAuthority: mintAuthority,
            },
            {
                createMetadataAccountArgsV2: {
                    data: ON_CHAIN_METADATA,
                    isMutable: true,
                },
            },
        ),
    )

    const latestBlockHash = await connection.getLatestBlockhash()
    const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: latestBlockHash.blockhash,
        instructions,
    }).compileToV0Message()

    const trx = new VersionedTransaction(messageV0)
    trx.sign([payer, config.mintAccount])

    return trx
}

const main = async () => {
    console.log(`---STEP 1: Uploading MetaData---`)
    const userWallet = wallet

    console.log(`---STEP 2: Creating Mint Transaction---`)
    console.log(`New Mint Address: `, config.mintAccount.publicKey.toString())

    const newMintTransaction: VersionedTransaction = await createNewMintTransaction(
        connection,
        userWallet,
        config.mintAccount,
        userWallet.publicKey,
        userWallet.publicKey,
        userWallet.publicKey,
    )

    console.log(`---STEP 3: Executing Mint Transaction---`)
    const transactionId = await connection.sendTransaction(newMintTransaction)
    console.log(`Transaction ID: `, transactionId)
    console.log(`Succesfully minted ${config.mintConfig.numberTokens} ${ON_CHAIN_METADATA.symbol} to ${userWallet.publicKey.toString()}.`)
    console.log(`View Transaction: https://explorer.solana.com/tx/${transactionId}?cluster=devnet`)
    console.log(`View Token Mint: https://explorer.solana.com/address/${config.mintAccount.publicKey.toString()}?cluster=devnet`)
}

main()
