import { WalletClient } from "./lib/aptos-wallet-api.js";

// apology tiger build muscle beauty evidence near melody oak word mimic wrist _AptosAccount {
//   signingKey: {
//     publicKey: Uint8Array(32) [
//       182,  3, 176,  51, 148, 228, 251, 217,
//       175, 75,  82, 176, 225, 162,  92, 129,
//       243,  7,  95,  14,  43, 220, 136,  66,
//       209, 31, 232,  88, 136, 172, 213,  37
//     ],
//     secretKey: Uint8Array(64) [
//       183, 101, 223,  93, 211, 253,  54, 231,  87,  56,  27,
//       255, 158, 104, 209, 178, 182, 188, 225, 184, 130,  24,
//       151,  72,  53, 193,  39,  77, 223, 231,  86, 128, 182,
//         3, 176,  51, 148, 228, 251, 217, 175,  75,  82, 176,
//       225, 162,  92, 129, 243,   7,  95,  14,  43, 220, 136,
//         66, 209,  31, 232,  88, 136, 172, 213,  37
//     ]
//   },
//   accountAddress: HexString {
//     hexString: '0x29dca461cdd0900850b2631ed09d52a1fa81b8725cde846526013dd57ec0468d'
//   }
// }
const mnemonic =
  "apology tiger build muscle beauty evidence near melody oak word mimic wrist";

const account = await WalletClient.getAccountFromMnemonic(mnemonic, 0);
/**
 * Providing payer wallet
 */
export { account };
