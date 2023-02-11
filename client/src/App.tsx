import ServiceShImport from 'pages/serviceShImport/ServiceShImport';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Center, Loader } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

import { getPushNotificationsToken, onMessageListener } from '@lib/firebase';

import { useRefreshMutation } from '@api/authApi';
import { usePatchCurrentUserMutation } from '@api/userApi';

import { setCredentials } from '@slices/authSlice';

import {
  Agencies,
  ClientDetail,
  ClientProjects,
  Clients,
  ClientServices,
  Home,
  Login,
  Notifications,
  PageNotFound,
  PasswordReset,
  PasswordResetRequest,
  Portfolio,
  Projects,
  ProjectServices,
  Services,
  Settings,
  UserAdd,
  Users,
  WebsiteScanner,
  WpTracking
} from '@pages';

import PrivateRoute from '@components/PrivateRoute';

const App: FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [refresh] = useRefreshMutation();

  const [modifyUser] = usePatchCurrentUserMutation();

  useEffect(() => {
    const f = async () => {
      try {
        const { accessToken, userId } = await refresh().unwrap();

        dispatch(setCredentials({ accessToken, user: { id: userId } }));

        const token = await getPushNotificationsToken();

        await modifyUser({ fcmToken: token }).unwrap();
        // TODO: improve this. do not call api on every load
      } catch (e) {
        // Nothing to do
      } finally {
        setLoading(false);
      }
    };

    f();
  }, [dispatch, refresh, modifyUser]);

  onMessageListener((payload) => {
    if (payload) {
      showNotification({
        title: payload.notification?.title,
        message: payload.notification?.body,
      });
    }
  });

  return loading ? (
    <Center style={{ height: '100vh' }}>
      <Loader />
    </Center>
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/password-reset" element={<PasswordResetRequest />} />
        <Route path="/password-reset/:token" element={<PasswordReset />} />
        <Route path="/utente" element={<PrivateRoute element={<Users />} />} />
        <Route
          path="/utente/aggiungi"
          element={<PrivateRoute element={<UserAdd />} />}
        />

        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route
          path="/clienti"
          element={<PrivateRoute element={<Clients />} />}
        />
        <Route
          path="/clienti/:id"
          element={<PrivateRoute element={<ClientDetail />} />}
        />
        <Route
          path="/clienti/:id/servizi/"
          element={<PrivateRoute element={<ClientServices />} />}
        />
        <Route
          path="/servizi"
          element={<PrivateRoute element={<Services />} />}
        />
        <Route
          path="/servizi/sh/importa"
          element={<PrivateRoute element={<ServiceShImport />} />}
        />
        <Route
          path="/progetti"
          element={<PrivateRoute element={<Projects />} />}
        />
        <Route
          path="cliente/:id/progetti"
          element={<PrivateRoute element={<ClientProjects />} />}
        />
        <Route
          path="progetto/:id/servizi"
          element={<PrivateRoute element={<ProjectServices />} />}
        />
        <Route
          path="/agenzie"
          element={<PrivateRoute element={<Agencies />} />}
        />
        <Route
          path="/impostazioni"
          element={<PrivateRoute element={<Settings />} />}
        />
        <Route
          path="/website-scanner"
          element={<PrivateRoute element={<WebsiteScanner />} />}
        />
        <Route
          path="/portfolio"
          element={<PrivateRoute element={<Portfolio />} />}
        />
        <Route
          path="/wp-tracking"
          element={<PrivateRoute element={<WpTracking />} />}
        />
        <Route
          path="/notifiche"
          element={<PrivateRoute element={<Notifications />} />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
