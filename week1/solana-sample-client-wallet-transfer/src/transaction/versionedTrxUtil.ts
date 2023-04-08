import web3, {
    TransactionMessage,
    VersionedTransaction,
    AddressLookupTableProgram,
    PublicKey,
    Keypair,
    TransactionInstruction,
    AddressLookupTableAccount,
} from '@solana/web3.js'
import _ from 'lodash'

/**
 *
 * create V0 trx
 *
 * @param {*} param0
 * @returns
 */
export const createV0Trx = async ({
    connection,
    instructions,
    payer,
    signer,
    lookupTableAddrs,
}: {
    connection: web3.Connection
    instructions: TransactionInstruction[]
    payer: Keypair
    signer?: Keypair
    lookupTableAddrs?: AddressLookupTableAccount[]
    options?: any
}) => {
    let latestBlockHash = await connection.getLatestBlockhash()
    const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: latestBlockHash.blockhash,
        instructions: instructions,
    }).compileToV0Message(lookupTableAddrs)

    const trx = new VersionedTransaction(messageV0)
    trx.sign([signer ?? payer])
    return trx
}

/**
 * Create V0 trx, and then send it
 * @param {*} param0
 * @returns
 */
export const createSendV0Trx = async ({
    connection,
    instructions,
    payer,
    signer,
    lookupTableAddrs,
    options,
}: {
    connection: web3.Connection
    instructions: TransactionInstruction[]
    payer: Keypair
    signer?: Keypair
    lookupTableAddrs?: AddressLookupTableAccount[]
    options?: any
}) => {
    const trx = await createV0Trx({
        connection,
        instructions,
        lookupTableAddrs,
        payer,
        signer,
    })
    const hash = await connection.sendTransaction(trx, options)
    return { trx, hash }
}

/**
 * Create V0 trx, and then send and wait confirm
 * @param {*} param0
 * @returns
 */
export const createSendConfirmV0Trx = async ({
    connection,
    instructions,
    payer,
    signer,
    lookupTableAddrs,
    options,
}: {
    connection: web3.Connection
    instructions: TransactionInstruction[]
    payer: Keypair
    signer?: Keypair
    lookupTableAddrs?: AddressLookupTableAccount[]
    options?: any
}) => {
    const trx = await createV0Trx({
        connection,
        instructions,
        lookupTableAddrs,
        payer,
        signer,
    })

    /**
     * wordaround for the library not having correct method signature for versioned transaction
     */
    const hash = await (web3.sendAndConfirmTransaction as any)(connection, trx as any)
    return { trx, hash }
}

/**
 * wait confirm for the trxs
 * @param {*} param0
 */
export const confirmTrxs = async ({ connection, trxHashes }: { connection: web3.Connection; trxHashes: string[] }) => {
    const latestBlockHash = await connection.getLatestBlockhash()

    // if too fast will be rate limited
    const numBatch = trxHashes.length > 10 ? 1 : 5

    for (const batch of _.chunk(trxHashes, numBatch)) {
        let checkingTasks: Promise<any>[] = []
        for (const trxHash of batch) {
            checkingTasks.push(
                connection
                    .confirmTransaction({
                        blockhash: latestBlockHash.blockhash,
                        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                        signature: trxHash,
                    })
                    .then(() => {
                        console.log(`confirm trx ${trxHash}`)
                    }),
            )
        }
        await Promise.all(checkingTasks)
    }
}

/**
 * create lookup table
 * @param {*} param0
 * @returns
 */
export const createLookupTable = async ({
    connection,
    payer,
    addresses,
    options,
}: {
    connection: web3.Connection
    payer: Keypair
    addresses: PublicKey[]
    options?: any
}) => {
    const currentSlot = await connection.getSlot()
    const slots = await connection.getBlocks(currentSlot - 200)
    if (slots.length < 100) {
        throw new Error(`Could find only ${slots.length} ${slots} on the main fork`)
    }
    const slot = slots[slots.length - 100]
    console.log('currentSlot:', currentSlot, ', used slot', slot)

    const [lookupTableInst, lookupTableAddr] = AddressLookupTableProgram.createLookupTable({
        authority: payer.publicKey,
        payer: payer.publicKey,
        recentSlot: slot,
    })

    const { hash: createLookupTableTrxHash } = await createSendConfirmV0Trx({
        connection,
        instructions: [lookupTableInst],
        payer,
        options,
    })

    console.log(`created look up table with hash ${createLookupTableTrxHash}.`)

    const addAddrsHashes: string[] = []
    for (let [i, batch] of Object.entries(_.chunk(addresses, 30))) {
        const addAddressesInst = AddressLookupTableProgram.extendLookupTable({
            payer: payer.publicKey,
            authority: payer.publicKey,
            lookupTable: lookupTableAddr,
            addresses: batch,
        })

        const { trx, hash } = await createSendV0Trx({
            connection,
            instructions: [addAddressesInst],
            payer: payer,
        })
        console.log(`send extend lookup table trx ${hash}.`)
        addAddrsHashes.push(hash)
    }
    await confirmTrxs({ connection, trxHashes: addAddrsHashes })

    return {
        lookupTableAddr,
        createLookupTableTrxHash,
        addAddrsHashes,
    }
}
