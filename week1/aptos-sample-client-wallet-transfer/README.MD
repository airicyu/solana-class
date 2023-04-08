# Sample for Aptos client doing 10 wallet transfer

This is a sample for demonstrate using Aptos JS client to do 10 wallet transfers in Devnet.

We are using 1 payer wallet to transfer to 10 receipient wallet.

# How to run

`npm start`

# Summary

Do 10 times transfer:
- Number of transactions = 10
- Trx fee = 0.00006 APT
- Time taken = 61s

# Logs

```
> npm start
> aptos-sample-client-wallet-transfer@1.0.0 start
> ts-node ./src/main.ts

Preparing receipient accounts...
payer address: 0x29dca461cdd0900850b2631ed09d52a1fa81b8725cde846526013dd57ec0468d, balance: 699941200

trxTime=5141.672299996018 ms, transfer to wallet[0] 0x6da95f30e466d62dddea0a0af084c90958128897d307630a5f6762849cc48d7d, sent trx 
with hash 0xde9b9f03b2e4059fa252b86d5cda4134c9d691392bd627c8fdd90372c39235d2
trxTime=6068.4844000041485 ms, finish wait for trx hash 0xde9b9f03b2e4059fa252b86d5cda4134c9d691392bd627c8fdd90372c39235d2
trxTime=5119.96930000186 ms, transfer to wallet[1] 0x1bceb5eaf4ada68a9de6c8c9e021f05388b3509260a387ca139d7a833a6f89f9, sent trx with hash 0xe5b8aa906d111c5884c65c8c85f79af787e7b9a48841108afe23fb49c6534f5b
trxTime=6077.79240000248 ms, finish wait for trx hash 0xe5b8aa906d111c5884c65c8c85f79af787e7b9a48841108afe23fb49c6534f5b
trxTime=5123.240899994969 ms, transfer to wallet[2] 0x3256b9859d029cc8781041f3e54070e721c5d006396d1c75969b874e61a36294, sent trx 
with hash 0x7b3401c638c8f68b4eb6d881977b01d5abf83b7786917c776aea4a77ff202887
trxTime=6086.302799999714 ms, finish wait for trx hash 0x7b3401c638c8f68b4eb6d881977b01d5abf83b7786917c776aea4a77ff202887
trxTime=5432.336100012064 ms, transfer to wallet[3] 0x96fc82b27ed0d39f0154d2ed645050345fc416a39e0c438d3c657b0e6a031029, sent trx 
with hash 0x121cd4061c77607b2105cb3b84b7c9d2b37029baaf4a10201245eae18377c0eb
trxTime=6393.569399997592 ms, finish wait for trx hash 0x121cd4061c77607b2105cb3b84b7c9d2b37029baaf4a10201245eae18377c0eb
trxTime=5439.557499989867 ms, transfer to wallet[4] 0x857bebd53a64609904bb72c4c30b5ec951dc663179359d025b8403351b4a67f1, sent trx 
with hash 0x77ce17439d72560b4bf11cdb9f556e4dfd538ede99735f210a9fd709bc01b364
trxTime=6393.418400004506 ms, finish wait for trx hash 0x77ce17439d72560b4bf11cdb9f556e4dfd538ede99735f210a9fd709bc01b364
trxTime=5439.863999992609 ms, transfer to wallet[5] 0x1242c4e68cf4a296f56e23aa6d3d4bc9e1cffc7ead2c261a473757e5908273d9, sent trx 
with hash 0xd8bc07ca3b234e9c2a844f24698be7ad0edf46102a9f0b8cf72430be985424ae
trxTime=6399.00530000031 ms, finish wait for trx hash 0xd8bc07ca3b234e9c2a844f24698be7ad0edf46102a9f0b8cf72430be985424ae
trxTime=4938.5561999976635 ms, transfer to wallet[6] 0x64ad59d6dbef7effaa2ca6f07dcc79baf08a66a70c134571dbaba5e4c50beb46, sent trx with hash 0x2e575e86e70fd407819c6e58e2909ea6fe457d8b80cdde565f1b9f2fcc4329c6
trxTime=5909.79129999876 ms, finish wait for trx hash 0x2e575e86e70fd407819c6e58e2909ea6fe457d8b80cdde565f1b9f2fcc4329c6
trxTime=5121.737300008535 ms, transfer to wallet[7] 0xc9b1103991046e232c483f7f9923bb3a77b2ef0316735d5424034d8bc991cd6b, sent trx 
with hash 0x546e6cc534eebee813e58eba6dd9681415fdc81dc0b1ef3d3676e6fb492af2ee
trxTime=6087.3874000012875 ms, finish wait for trx hash 0x546e6cc534eebee813e58eba6dd9681415fdc81dc0b1ef3d3676e6fb492af2ee
trxTime=5121.1743000000715 ms, transfer to wallet[8] 0xe3987aeaecfac7b4585268adcb59cdec76f93c7f97db89de65719a8046123b2a, sent trx with hash 0xb09175b10f6966e7d298e41e309af176783dc58cc6843b994ee43f1da339a320
trxTime=6087.466199994087 ms, finish wait for trx hash 0xb09175b10f6966e7d298e41e309af176783dc58cc6843b994ee43f1da339a320
trxTime=4771.442000001669 ms, transfer to wallet[9] 0x9195523d3e799531b78d64213ed0ecbd0b2f4633cbbf95b5a066da3523561a31, sent trx 
with hash 0x2205380d07a42b6ee05d7a237751d2a3ac476c175bcf7673b19a10c26346997e
trxTime=5736.797099992633 ms, finish wait for trx hash 0x2205380d07a42b6ee05d7a237751d2a3ac476c175bcf7673b19a10c26346997e
Total elapsed time: 61244.5082000047 ms
afterBalance = 699925200
Transaction fee = 0.00006 APT
```