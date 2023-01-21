//import prisma from '@lib/prisma';
import express from 'express';
import * as routes from '@routes';
import { defaultResponseMiddlewares } from '@middlewares';

import path from 'path';
import env from '@config/env';

const app = express();

// Send index.html on root request
if (env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}

app.use(express.json());

app.use(...defaultResponseMiddlewares);

app.use('/api', Object.values(routes));

if (env.NODE_ENV === 'production') {
  app.all('*', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  });
}

app.use(...defaultResponseMiddlewares);

// START THE SERVER
// =============================================================================
const port = process.env.PORT;

app.listen(port);
console.log(`App listening on ${port}`);
