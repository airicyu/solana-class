## Summary

We support below functions:
- Mint token for user (1 SOL = 1000 SMA)
- Burn token (just burn)
- Buy token (Use 1 SOL to Buy 1000 SMA from Vault)
- Vault Free Mint (Print money to Vault)

-----


## Mint Token

User input SOL to mint token.

command:

`npm run mint -- --amount=100 --keypair=.\testUserWallet.json`

------

## Burn Token

User burn token.

`npm run burn -- --amount=100 --keypair=.\testUserWallet.json`

------

## Buy Token

user use SOL to buy token from Vault account.

`npm run buy -- --amount=100 --keypair=.\testUserWallet.json`

------

## Vault Mint Token

Free mint to Vault. (Print money $$$)

`npm run vaultMint -- --amount=100`
