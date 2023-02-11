/* eslint-disable */

// Scripts for firebase and firebase messaging
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
);

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: 'AIzaSyDI1n_iCXwgXPlYij6c-F8-psb9mKC4LQs',
  authDomain: 'gestionale-miroir.firebaseapp.com',
  projectId: 'gestionale-miroir',
  storageBucket: 'gestionale-miroir.appspot.com',
  messagingSenderId: '569064648261',
  appId: '1:569064648261:web:c16e33e9dba47b0910fd2c',
};

// TODO: move configuration in a safe file

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
