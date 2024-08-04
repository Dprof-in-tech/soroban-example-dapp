// import { persisted } from "svelte-local-storage-store";
// import { KeyManager, KeyManagerPlugins, KeyType } from "@stellar/wallet-sdk";
// import { error } from "@sveltejs/kit";
// import { get } from "svelte/store";

// function createWalletStore() {
//   const { subscribe, set } = persisted("walletStore", {
//     keyId: "",
//     publicKey: "",
//     devInfo: {
//       secretKey: "",
//     },
//   });

//   return {
//     subscribe,

//     register: async ({ publicKey, secretKey, pincode } : {publicKey: any, secretKey: any, pincode: any}) => {
//       try {
//         const keyManager = setupKeyManager();

//         let keyMetadata = await keyManager.storeKey({
//           key: {
//             type: KeyType.plaintextKey,
//             publicKey: publicKey,
//             privateKey: secretKey,
//           },
//           password: pincode,
//           encrypterName: KeyManagerPlugins.ScryptEncrypter.name,
//         });

//         set({
//           keyId: keyMetadata.id,
//           publicKey: publicKey,
//           devInfo: {
//             secretKey: secretKey,
//           },
//         });
//       } catch (err: any) {
//         console.error("Error saving key", err);
//         throw error(400, { message: err.toString() });
//       }
//     },

//     confirmCorrectPincode: async ({ pincode, firstPincode = "", signup = false }: {pincode: any, firstPincode: any, signup: boolean}) => {
//       if (!signup) {
//         try {
//           const keyManager = setupKeyManager();
//           let { keyId } = get(walletStore);
//           await keyManager.loadKey(keyId, pincode);
//         } catch (err) {
//           throw error(400, { message: "Invalid pincode" });
//         }
//       } else {
//         if (pincode !== firstPincode) {
//           throw error(400, { message: "Pincode mismatch" });
//         }
//       }
//     },

//     sign: async ({ transactionXDR, network, pincode } : {transactionXDR: any, network: any, pincode: any}) => {
//       try {
//         const keyManager = setupKeyManager();

//         let signedTransaction = await keyManager.signTransaction({
//           transaction: TransactionBuilder.fromXDR(transactionXDR, network),
//           id: get(walletStore).keyId,
//           password: pincode,
//         });
//         return signedTransaction;
//       } catch (err: any) {
//         console.error("Error signing transaction", err);
//         throw error(400, { message: err.toString() });
//       }
//     },
//   };
// }

// export const walletStore = createWalletStore();

// const setupKeyManager = () => {
//   const localKeyStore = new KeyManagerPlugins.LocalStorageKeyStore();

//   localKeyStore.configure({
//     prefix: "walletApp",
//     storage: localStorage,
//   });

//   const keyManager = new KeyManager({
//     keyStore: localKeyStore,
//   });

//   keyManager.registerEncrypter(KeyManagerPlugins.ScryptEncrypter);

//   return keyManager;
// };