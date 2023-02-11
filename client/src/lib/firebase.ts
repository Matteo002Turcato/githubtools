// import { FirebaseApp, initializeApp } from 'firebase/app';
// import { getMessaging, getToken, MessagePayload, Messaging, onMessage } from 'firebase/messaging';

// import { firebaseConfig, webPushKey } from './firebase.config';

// // Initialize Firebase
// let app: FirebaseApp;
// let messaging: Messaging;

// try {
//   app = initializeApp(firebaseConfig);

//   messaging = getMessaging(app);
// } catch (e) {
//   console.error('Firebase non supportato');
// }

// export const getPushNotificationsToken = async (): Promise<
//   string | undefined
// > => {
//   if (messaging) {
//     try {
//       return await getToken(messaging, { vapidKey: webPushKey });
//     } catch (e) {
//       // catch error while creating client token
//     }
//   }

//   return undefined;
// };

// export const onMessageListener = (
//   callback: (payload: MessagePayload) => void
// ) => (messaging ? onMessage(messaging, callback) : null);
export {};
