import web3, { Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import _ from 'lodash'
import { confirmTrxs, createLookupTable, createSendV0Trx } from '../transaction/versionedTrxUtil.js'
import { sleepMs } from '../utils.js'

const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed')

const TEST_TRANSFER_AMOUNT = web3.LAMPORTS_PER_SOL * 0.001

/**
 * run transfer one by one
 */
export const runEach = async (payer: Keypair, receipients: PublicKey[]) => {
    console.log('#################### Test Transfer one by one #####################')
    const start = performance.now()
    const trxHashes: string[] = []
    for (let [i, receipient] of Object.entries(receipients)) {
        const trxStart = performance.now()
        const trx = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: payer.publicKey,
                toPubkey: receipient,
                lamports: TEST_TRANSFER_AMOUNT,
            }),
        )
        const hash = await connection.sendTransaction(trx, [payer])
        trxHashes.push(hash)
        console.log(`trx time=${performance.now() - trxStart} ms, send to wallet[${i}] ${receipient.toString()}, trx hash=${hash}`)
    }

    const sentAllTime = performance.now()
    console.log(`Sent all trx. Total elapsed time: ${sentAllTime - start} ms`)
    await confirmTrxs({ connection, trxHashes })
    console.log(`Confirmed all trxs. Total elapsed time: ${performance.now() - start} ms`)

    console.log('#########################################')
}

/**
 * run transfer in batch
 */
export const runBatch = async (payer: Keypair, receipients: PublicKey[], batchSize: number) => {
    console.log('#################### Test Transfer in batch #####################')
    const start = performance.now()
    const tasks: Promise<void>[] = []
    const trxHashes: string[] = []
    for (let [i, batch] of Object.entries(_.chunk(receipients, batchSize))) {
        tasks.push(
            (async () => {
                const trxStart = performance.now()
                const trx = new Transaction()
                const instructions = batch.map((receipient) =>
                    SystemProgram.transfer({
                        fromPubkey: payer.publicKey,
                        toPubkey: receipient,
                        lamports: TEST_TRANSFER_AMOUNT,
                    }),
                )
                trx.add(...instructions)

                const hash = await connection.sendTransaction(trx, [payer])
                console.log(`trx time=${performance.now() - trxStart} ms, send batch[${i}], trx hash=${hash}`)
                trxHashes.push(hash)
            })(),
        )
    }
    await Promise.all(tasks)

    const sentAllTime = performance.now()
    console.log(`Sent all trx. Total elapsed time: ${sentAllTime - start} ms`)
    await confirmTrxs({ connection, trxHashes })
    console.log(`Confirmed all trxs. Total elapsed time: ${performance.now() - start} ms`)

    console.log('#########################################')
}

/**
 * run transfer in batch of 55 with lookup table
 */
export const runLookupTableTransfer = async (payer: Keypair, receipients: PublicKey[]) => {
    console.log('#################### Test Transfer with lookup table #####################')
    const start = performance.now()

    const { lookupTableAddr, createLookupTableTrxHash, addAddrsHashes } = await createLookupTable({
        connection,
        payer,
        addresses: receipients,
    })
    console.log(
        `trx time=${performance.now() - start} ms. Created lookup table, address: ${lookupTableAddr.toBase58()}, trx=${createLookupTableTrxHash} \n`,
    )

    /**
     * if not sleep, sometimes may see thie error:
     * failed to send transaction: invalid transaction: Transaction address table lookup uses an invalid index
     */
    console.log('Wait for 0.4s...\n')
    await sleepMs(400)

    const lookupTable = (await connection.getAddressLookupTable(lookupTableAddr)).value
    if (!lookupTable) {
        throw new Error('Cannot get lookup table')
    }

    const trxHashes: string[] = []

    for (let batch of _.chunk(receipients, 55)) {
        const instructions = batch.map((receipient) =>
            SystemProgram.transfer({
                fromPubkey: payer.publicKey,
                toPubkey: receipient,
                lamports: TEST_TRANSFER_AMOUNT,
            }),
        )

        const { hash: v0TransferHash } = await createSendV0Trx({
            connection,
            instructions,
            lookupTableAddrs: [lookupTable],
            payer,
        })

        console.log(`send transfer trx hash=${v0TransferHash}`)
        trxHashes.push(v0TransferHash)
    }

    const sentAllTime = performance.now()
    console.log(`Sent all trx. Total elapsed time: ${sentAllTime - start} ms`)
    await confirmTrxs({ connection, trxHashes })
    console.log(`Confirmed all trxs. Total elapsed time: ${performance.now() - start} ms`)

    console.log('#########################################')
}
