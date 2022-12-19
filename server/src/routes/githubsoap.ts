import axios from 'axios';
import { Router } from 'express';
import fs from 'fs';
import { join } from 'path';

const router = Router();

//Repository
router.get('/repositorySoap', async (req, res, next) => {
  // const jsonIdService = fs.readFileSync(pathSeriviziId).toString();
  // let jsonconvert = JSON.parse(jsonIdService);
  // let IdService;
  try {
    const repository = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: 'Bearer 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',
      },
    });

    console.log(repository.data);

    // let IdService = JSON.stringify(repository);
    // fs.writeFileSync(pathSeriviziId, IdService);
    // return res.status(200).json(IdService);
    return res.status(200).json(repository.data);
  } catch (e) {
    next(e);
  }
});

export default router;
