# Solana do 100 wallet transfer

## Send one by one
- Number of transactions = 100
- Trx fee = 0.0005 SOL
- Time taken = 15.5s

## Send in batch (size=20)
- Number of transactions = 5
- Trx fee = 0.000025 SOL
- Time taken = 0.9s

## Send with address lookup table
- Number of transactions = 7
- Trx fee = 0.000025 SOL
- Time taken = 3.2s

## Remarks
- Send one by one is low efficiency.
- Address lookup table has a lot of setup overhead (5 trx for setup), though it only have 2 trx for final batch transfer (size=55).
- Send in batch has the best efficiency.

---

# Aptos do 10 wallet transfer

- Number of transactions = 10
- Trx fee = 0.00006 APT
- Time taken = 61s

## Remarks
- Aptos has limitation that all transactions under an account must have a nonce counter. This is strict and preventing parallel transaction submission running for same account.
- We test in Devnet which is much slower than mainnet. Mainnet block time is ~1s while Devnet block time is ~4-6s. This would make the measured total time in devnet much slower than expected in mainnet.
- Rough guess of mainnet, it may takes ~10-15s to finish 10 wallet transfer.