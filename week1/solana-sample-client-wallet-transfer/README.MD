# Salana code sample - Client submit batch wallet transfer

This code is sample of using JS client to submit 100 wallet transfer transactions in Solana blockchain (Devnet).

More clear to say, we are using 1 payer wallet to transfer to 100 different receipient wallets.

We are demonstrating the amazing speed that solana can processing a tranasction very fast. Notice that our code only test for 1 confirm but not testing against the time-to-finality.

# How to run

`npm start`

# Summary

The main logic is inside `src/main.ts`.

There are 3 ways we can do the transfer:

## 1) Send transfer transaction one by one

We could use this to trigger:
```typescript
await runEach(payer, receipients)
```

- Number of transactions = 100
- Trx fee = 0.0005 SOL
- Time taken = 15.5s

## 2) Send transfer transaction in a batch of 20

We could use this to trigger:
```typescript
await runBatch(payer, receipients, 20)
```
- Number of transactions = 5
- Trx fee = 0.000025 SOL
- Time taken = 0.9s

## 3) Send batch with address lookup table
We could use this to trigger:
```typescript
await runLookupTableTransfer(payer, receipients) 
```

- Number of transactions = 7
- Trx fee = 0.000025 SOL
- Time taken = 3.2s

----

Run test log:

## Test Transfer one by one

```
#################### Test Transfer one by one #####################
trx time=186.4776000007987 ms, send to wallet[0] 12r3doQE9QMWSVf8RBcdtt8E2BVUDUwPtfKFQv9hW6My, trx hash=4EBrE1HnNoMKmWpxKThD8YedW7oARW5iWSiZ3RZVHykxA8AzRiwqvvT2YNK8HQKCT5e9Cv1HFzZnJbRRMGZzghzS
trx time=56.53090000152588 ms, send to wallet[1] 21PcEjZ5Zd5Vni5X8PjZBWZZi6jbJFmcqfGdXNDoHDDt, trx hash=3KgVh8eBLHbfKpu9zzmcQFcf81LaS7cxkbJqqdJqaAoezwhi1et54ch7uHmXEh5in5CV2HEH1Kg8MZS25NezheCe
trx time=50.51789999753237 ms, send to wallet[2] 2d6ZxBNRnqrA5e6pwnvpeYEAzq3xZnkvgLNUcUy42ABF, trx hash=5djHPuCqYiUUyzVWmRXWG19qEH18wRdmuzMKi8ZoLBitxMnvaFvDn5HwYfcT6BuHbRZ1fbtPWiBYen9U2rzKevUp
...
...
...
trx time=45.95659999549389 ms, send to wallet[98] rVquKuz95kYa1qSezp8kNcCPUzeYLSXZhWhu292LsNX, trx hash=rVeGNmhsPBjpn3MCutqNbS4YJ7uLoSpYFAFPpgiNkzhZfvPQhsRU7EP3n9pDeRv9wMKhH72jQWme4Ma9XbvVtwj
trx time=47.807700000703335 ms, send to wallet[99] zhAbvd9YJTQ7VXkhCwRpokJiXGSF45wyFBBkPSEjcJu, trx hash=2Reyfo46Bev7CKMXXUThhv6nhiEM2osHxs24etwqramJFVvuifMf6voiav6KDjb3ceX6NWPpQPmQbzjPjs7EVazF
Sent all trx. Total elapsed time: 4957.563299998641 ms
confirm trx 4EBrE1HnNoMKmWpxKThD8YedW7oARW5iWSiZ3RZVHykxA8AzRiwqvvT2YNK8HQKCT5e9Cv1HFzZnJbRRMGZzghzS
confirm trx 3KgVh8eBLHbfKpu9zzmcQFcf81LaS7cxkbJqqdJqaAoezwhi1et54ch7uHmXEh5in5CV2HEH1Kg8MZS25NezheCe
...
...
...
confirm trx rVeGNmhsPBjpn3MCutqNbS4YJ7uLoSpYFAFPpgiNkzhZfvPQhsRU7EP3n9pDeRv9wMKhH72jQWme4Ma9XbvVtwj
confirm trx 2Reyfo46Bev7CKMXXUThhv6nhiEM2osHxs24etwqramJFVvuifMf6voiav6KDjb3ceX6NWPpQPmQbzjPjs7EVazF
Confirmed all trxs. Total elapsed time: 15540.008500002325 ms
#########################################
Trx fee = 0.0005 SOL
```

## Test Transfer in batch

```
#################### Test Transfer in batch #####################
trx time=103.29119999706745 ms, send batch[1], trx hash=DbS7ZM4yEstTKkJPtRCqQC9tVT7UUM2Ye4YUeKnUmAa9JnV33qxrHH9z9HGzPmZKnKfDD6RPQDjbwnTYRRqrkuA
trx time=104.26439999789 ms, send batch[0], trx hash=2kSADoeq9KAmpGm4uPLZgzLz1khi47GQyjRvYmhwgtckj13J9vryo2VZSZy3QEnRWjyBtxNJZUaNoj45xtf9g9de
trx time=182.70139999687672 ms, send batch[4], trx hash=38WG3dZAZGumWRrrStJ7ENSmuTUDehYeqc2cRD5GWZ56gcLQ1Hrg25iDCCH1u7K574hcUyCoCs9iUnVaZ2SAAGJy
trx time=183.33809999376535 ms, send batch[2], trx hash=HjdfTFJcgx87Z6VSnSDpPZ844rUHK2wyq8yM8JUzQT5hASLnc9phW7fFUogLiAN2ZoRHppvB7SV1r2iTtQtjeTF
trx time=186.82880000025034 ms, send batch[3], trx hash=3eNSWQ7Hr9bpqFQdh4fSuifMmUceuM9prhJdihz1HZrFq6abr7NfTGuznSJntoAgE89uWeHTyEYJu1gs6sH9v1FQ
Sent all trx. Total elapsed time: 187.63710000365973 ms
confirm trx 3eNSWQ7Hr9bpqFQdh4fSuifMmUceuM9prhJdihz1HZrFq6abr7NfTGuznSJntoAgE89uWeHTyEYJu1gs6sH9v1FQ
confirm trx 2kSADoeq9KAmpGm4uPLZgzLz1khi47GQyjRvYmhwgtckj13J9vryo2VZSZy3QEnRWjyBtxNJZUaNoj45xtf9g9de
confirm trx 38WG3dZAZGumWRrrStJ7ENSmuTUDehYeqc2cRD5GWZ56gcLQ1Hrg25iDCCH1u7K574hcUyCoCs9iUnVaZ2SAAGJy
confirm trx HjdfTFJcgx87Z6VSnSDpPZ844rUHK2wyq8yM8JUzQT5hASLnc9phW7fFUogLiAN2ZoRHppvB7SV1r2iTtQtjeTF
confirm trx DbS7ZM4yEstTKkJPtRCqQC9tVT7UUM2Ye4YUeKnUmAa9JnV33qxrHH9z9HGzPmZKnKfDD6RPQDjbwnTYRRqrkuA
Confirmed all trxs. Total elapsed time: 919.9912000000477 ms
#########################################
Trx fee = 0.000025 SOL
```

## Test Transfer with lookup table

```
#################### Test Transfer with lookup table #####################
currentSlot: 206766808 , used slot 206766709
created look up table with hash 5j9j3mgQyMvkjEsrZWUxgFnPsZguD1qKuHZvRQ8M7UZMaose95uchjnW79292EqnFQjQdJ7K4ftUdUxnL64AygRp.
send extend lookup table trx 3JUgsUQjzgBNBg6iXZCRyonHJNCvguMuoKM6eyJYQmFsfRktBZHjWcmn6HkHxZJuwoLiitjfvkN2XPDi6TnaqBud.
send extend lookup table trx 2i5reSA7kZnv2R9k32u1z1h2mxYfJTYeeh5ZRpKRVaUePQWJgTnNMtbztc72B3ayzjWWtcYx5ebXdHZvEY3hdh4L.
send extend lookup table trx 4SpsDuZH1mnvqxRfR3hhuvodmF1Zydvmz9XhJrfREicPiHafha2uSGCvkV6YYgNQWMZEvm1tNsdBi4Xuzb5fRqS6.
send extend lookup table trx 2mdR9C3sf2g5MtPw4eMjRKs8hpsDoEgLkQgi35t4zgc4uHmYnewnKezq6WhQDiuj7aGMZZKnZswovEWAdEtbCinT.
confirm trx 4SpsDuZH1mnvqxRfR3hhuvodmF1Zydvmz9XhJrfREicPiHafha2uSGCvkV6YYgNQWMZEvm1tNsdBi4Xuzb5fRqS6
confirm trx 3JUgsUQjzgBNBg6iXZCRyonHJNCvguMuoKM6eyJYQmFsfRktBZHjWcmn6HkHxZJuwoLiitjfvkN2XPDi6TnaqBud
confirm trx 2mdR9C3sf2g5MtPw4eMjRKs8hpsDoEgLkQgi35t4zgc4uHmYnewnKezq6WhQDiuj7aGMZZKnZswovEWAdEtbCinT
confirm trx 2i5reSA7kZnv2R9k32u1z1h2mxYfJTYeeh5ZRpKRVaUePQWJgTnNMtbztc72B3ayzjWWtcYx5ebXdHZvEY3hdh4L
trx time=1935.6767000034451 ms. Created lookup table, address: CGiLG9KUSzPcEkENvZwJiJQtTTbSZNh6eVNZA8ekT7VE, trx=5j9j3mgQyMvkjEsrZWUxgFnPsZguD1qKuHZvRQ8M7UZMaose95uchjnW79292EqnFQjQdJ7K4ftUdUxnL64AygRp

Wait for 0.4s...

send transfer trx hash=5NVoMR17Muuf5guUz6wM8GM4tdoBraziX97hbb79yA4XKLQvxGEHCnBctsBN55c2VbGzK7Vim8Afqhs7Mfw6tgXs
send transfer trx hash=6455ujwgcUS6xayCZWuDc3YMV4ic6zxeRmc2hCh7TKG93MEJgFh2AeofiSyaMZkncoAFK3LvRu3zuxMAcq6xZ3HA
Sent all trx. Total elapsed time: 2698.872600004077 ms
confirm trx 6455ujwgcUS6xayCZWuDc3YMV4ic6zxeRmc2hCh7TKG93MEJgFh2AeofiSyaMZkncoAFK3LvRu3zuxMAcq6xZ3HA
confirm trx 5NVoMR17Muuf5guUz6wM8GM4tdoBraziX97hbb79yA4XKLQvxGEHCnBctsBN55c2VbGzK7Vim8Afqhs7Mfw6tgXs
Confirmed all trxs. Total elapsed time: 3199.927699998021 ms
#########################################
Trx fee = 0.02358764 SOL
```