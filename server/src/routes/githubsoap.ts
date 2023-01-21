import env from '@config/env';
import axios from 'axios';
import { Router } from 'express';

const router = Router();

//Repository
router.get('/repositorySoap', async (req, res, next) => {
  // const jsonIdService = fs.readFileSync(pathSeriviziId).toString();
  // let jsonconvert = JSON.parse(jsonIdService);
  // let IdService;

  try {
    const repository = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: 'Bearer ' + env.GITHUB_TOKEN,
      },
    });

    console.log(repository.data);

    // let IdService = JSON.stringify(repository.data);
    // fs.writeFileSync('../data/ciao.json', IdService);
    // return res.status(200).json(IdService);
    return res.status(200).json(repository.data);
  } catch (e) {
    next(e);
  }
});

//Repository
router.get('/organizationSoap', async (req, res, next) => {
  // const jsonIdService = fs.readFileSync(pathSeriviziId).toString();
  // let jsonconvert = JSON.parse(jsonIdService);
  // let IdService;
  try {
    const organization = await axios.get('https://api.github.com/user/orgs', {
      headers: {
        Authorization: 'Bearer ' + env.GITHUB_TOKEN,
      },
    });

    console.log(organization.data);

    // let IdService = JSON.stringify(repository.data);
    // fs.writeFileSync('../data/ciao.json', IdService);
    // return res.status(200).json(IdService);
    return res.status(200).json(organization.data);
  } catch (e) {
    next(e);
  }
});

//DowloadRepository
// router.get('/dowload', async (req, res, next) => {
//   // const jsonIdService = fs.readFileSync(pathSeriviziId).toString();
//   // let jsonconvert = JSON.parse(jsonIdService);
//   // let IdService;

//   try {
//     const organization = await axios.get(
//       'https://api.github.com/repos/Matteo002Turcato/BaseProject/zipball/master',
//       {
//         headers: {
//           Authorization: 'Bearer ' + env.GITHUB_TOKEN,
//           Headers: 'application / zip',
//         },
//       }
//     );
//     return res.status(200)
//   } catch (e) {
//     next(e);
//   }
// });

export default router;
