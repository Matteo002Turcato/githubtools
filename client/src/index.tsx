import '@styles/fonts.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';

import store from '@app/store';

import env from '@config/env';

import App from './App';
import ThemeProvider from './ThemeProvider';

const container = document.getElementById('root');

const root = createRoot(container!);

if (env.NODE_ENV === 'production') {
  // Add google recaptcha script
  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptcha/api.js?render=${env.RECAPTCHA_PUBLIC_KEY}`;
  script.defer = true;
  document.body.appendChild(script);
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <NotificationsProvider position="top-center" autoClose={2500}>
          <ModalsProvider>
            <App />
          </ModalsProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
