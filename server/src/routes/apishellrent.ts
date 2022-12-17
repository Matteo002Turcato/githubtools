import axios from 'axios';
import { Router } from 'express';
import fs from 'fs';
import { join } from 'path';

const router = Router();

//Array Id (Massimo 100 chiamate per minuto)

const idServizi = [
  871, 10282, 10283, 10284, 10285, 10655, 11048, 11049, 11052, 11053, 21597,
  21598, 23824, 23825, 29861, 29862, 29863, 29864, 36332, 36333, 36354, 36355,
  36362, 36363, 36364, 36365, 36366, 36367, 36368, 36629, 36630, 42688, 42689,
  52680, 52681, 52682, 52683, 55823, 55824, 58932, 58933, 62540, 62541, 63405,
  63406, 63407, 63408, 63668, 63669, 63762, 65678, 70127, 70128, 73478, 73479,
  73865, 73866, 74624, 74625, 75426, 75904, 75905, 76261, 76262, 76559, 76560,
  76965, 76966, 77071, 77072, 77088, 77089, 78565, 78624, 78625, 78898, 78899,
  78965, 78966, 79740, 79741, 80857, 80918, 82501, 82502, 82503, 82504, 82806,
  83230, 83231, 84519, 84520, 84521, 86475, 86476, 86764, 88648, 88717, 88945,
  89880, 89881, 91423, 91424, 91598, 91599, 91638, 91639, 91640, 91641, 91642,
  91643, 94289, 94290, 95152, 95153, 95306, 95468, 95496, 96747, 97518, 97519,
  97548, 97549, 97585, 97589, 97592, 97690, 97691, 97727, 97737, 97738, 97777,
  98242, 99175, 99176, 117453, 117454, 118120, 118122, 119254, 119255, 121464,
  121465, 121908, 121916, 122619, 123758, 123759, 125235, 125236, 125753,
  125754, 126860, 126861, 126863, 127552, 127553, 127754, 127755, 129002,
  129080, 129081, 130352, 131059, 131060, 131062, 132418, 132419, 133113,
  133118, 133119, 133120, 133214, 133245, 136184, 136185, 136744, 136745,
  136746, 136747, 137804, 137805, 137948, 137949, 138835, 138836, 139747,
  139781, 139783, 139971, 139972, 140110, 140492, 142003, 142004, 142910,
  142911, 142991, 142992, 143214, 143215, 143217, 143218, 143312, 143313,
  143315, 143316, 143859, 143861, 143920, 144175, 144197, 144474, 144476,
  144766, 144767, 144770, 144911, 144912, 145380, 145381, 145382, 145383,
  145384, 145385, 145386, 145387, 145388, 145389, 145390, 145391, 145392,
  145393, 145394, 145395, 145396, 145397, 145398, 145399, 145404, 145405,
  145406, 145407, 145408, 145409, 145410, 145417, 145418, 145419, 145420,
  145423, 145442, 145638, 145639, 145673, 146179, 146182, 146230, 149413,
  149414, 149416, 149998, 149999, 150224, 150469, 151053, 151667, 151668,
  151670, 151671, 151722, 152561, 152571, 152572, 152574, 153217, 155536,
  155537, 156295, 156296, 158576, 158887, 159177, 159178, 160271, 161950,
  161951, 161958, 161960, 162796, 163213, 163214, 163424, 163425, 166350,
  166992, 166993, 166994, 166996, 166997, 167315, 167317, 167648, 169854,
  169855, 170524, 170528, 170614, 171396, 172250, 173147, 173148, 174480,
];
const idDomini = [
  86426, 86482, 86625, 86626, 86627, 86628, 86629, 86630, 86631, 86632, 86633,
  86634, 86635, 86636, 86637, 86638, 86639, 86640, 86641, 86642, 86643, 86644,
  86649, 86650, 86651, 86652, 86653, 86654, 86655, 86662, 86663, 86664, 86665,
  86668, 86675, 86735, 86944, 87810, 87811, 87967, 88406, 88407, 88408, 88672,
  88673, 89746, 90681, 90682, 91713, 28499, 92047, 90489, 93250, 93251, 93252,
  93253, 93332, 93575, 93576, 94519, 94895,
];
const idCertificati = [
  1661, 2401, 2402, 2403, 2404, 2574, 2584, 2592, 2667, 2815, 2944, 2962,
];
const idwebhosting = [
  1149, 1150, 1299, 1462, 1464, 6101, 7088, 9763, 9764, 12503, 12513, 12517,
  12518, 12519, 12630, 15214, 19557, 19558, 20796, 21427, 22138, 22382, 23458,
  24058, 24107, 24228, 24489, 24538, 24607, 24619, 24620, 24908, 24920, 24964,
  24980, 25111, 25607, 26013, 26280, 26626, 26778, 27029, 27048, 29660, 29884,
  29900, 30216, 30259, 30549, 30825, 30931, 31096, 31346, 31676, 31861, 31921,
  32045, 32136, 32165, 32376, 32595, 32707, 32943, 33073, 33570, 33844, 33871,
  34009, 34171, 34200, 34291, 34525, 34671, 34688, 34725, 34749, 34750, 34821,
  34872, 34928, 34989, 35009, 35143, 35238, 35247, 35789, 35908, 35943, 36120,
  36205, 36216, 36368, 36370, 36865, 37220, 37267, 37689, 37690,
];
const idServer = [6063, 6578, 8908];
const IdSeverVm = [8814, 7774, 8417, 8285];

//PathFile

const pathSeriviziId = join(
  process.cwd(),
  'src',
  'routes',
  'data',
  'serviceId.json'
);
const pathSerivizi = join(
  process.cwd(),
  'src',
  'routes',
  'data',
  'service.json'
);
const patherr = join(process.cwd(), 'src', 'routes', 'data', 'errId.json');

const pathDomainId = join(
  process.cwd(),
  'src',
  'routes',
  'data',
  'domainId.json'
);
const pathDomain = join(process.cwd(), 'src', 'routes', 'data', 'domain.json');

const pathCertificateId = join(
  process.cwd(),
  'src',
  'routes',
  'data',
  'certificateId.json'
);
const pathCertificate = join(
  process.cwd(),
  'src',
  'routes',
  'data',
  'certificate.json'
);
const pathHostingId = join(
  process.cwd(),
  'src',
  'routes',
  'data',
  'webHostingId.json'
);
const pathHosting = join(
  process.cwd(),
  'src',
  'routes',
  'data',
  'webHosting.json'
);
const pathServerId = join(
  process.cwd(),
  'src',
  'routes',
  'data',
  'serverId.json'
);
const pathServer = join(process.cwd(), 'src', 'routes', 'data', 'server.json');

const pathServervmId = join(
  process.cwd(),
  'src',
  'routes',
  'data',
  'serverpcvmId.json'
);
const pathServervm = join(
  process.cwd(),
  'src',
  'routes',
  'data',
  'serverpcvm.json'
);
const pathProfile = join(
  process.cwd(),
  'src',
  'routes',
  'data',
  'profile.json'
);
const pathCategoryName = join(
  process.cwd(),
  'src',
  'routes',
  'data',
  'categoryName.json'
);


// Service
// ============================================================================
router.get('/idService', async (req, res, next) => {
  const jsonIdService = fs.readFileSync(pathSeriviziId).toString();
  let jsonconvert = JSON.parse(jsonIdService);
  let IdService;
  try {
    const test = await axios.get(
      'https://manager.shellrent.com/api2/purchase',
      {
        headers: {
          Authorization:
            'usr0003b2e.2fb687f157999ae1ee706e9fd12ae2ed802647b86bc4d741457e8523e7b7dea9eaa82d65add48b9c489884408f3e1714',
        },
      }
    );

    jsonconvert = await [
      ...jsonconvert,
      test.data.data.map((e: string | number) => +e),
    ];
    IdService = JSON.stringify(jsonconvert);
    fs.writeFileSync(pathSeriviziId, IdService);
    return res.status(200).json(IdService);
  } catch (e) {
    next(e);
  }
});

router.get('/detailsService', async (req, res, next) => {
  const jsonFilesv = fs.readFileSync(pathSerivizi).toString();
  let jsonconvert = JSON.parse(jsonFilesv);
  let detailService;
  try {
    for (let index = 0; index < idServizi.length; index++) {
      const element = idServizi[index];
      try {
        const test = await axios.get(
          'https://manager.shellrent.com/api2/purchase/details/' + element,
          {
            headers: {
              Authorization:
                'usr0003b2e.2fb687f157999ae1ee706e9fd12ae2ed802647b86bc4d741457e8523e7b7dea9eaa82d65add48b9c489884408f3e1714',
            },
          }
        ); //Username.Token

        jsonconvert = await [...jsonconvert, test.data.data];
        detailService = JSON.stringify(jsonconvert);
        // fs.writeFileSync(pathSerivizi, detailService);
      } catch (e: any) {
        console.log(e);
        fs.writeFileSync(patherr, e);
      }
    }

    return res.status(200).json(detailService);

    // const test = await axios.get(
    //       'https://manager.shellrent.com/api2/purchase',
    //       {
    //         headers: {
    //           Authorization:
    //             'usr0003b2e.2fb687f157999ae1ee706e9fd12ae2ed802647b86bc4d741457e8523e7b7dea9eaa82d65add48b9c489884408f3e1714',
    //         },
    //       }
    //     ); //Username.Token

    //     return res.status(200).json(test.data.data);
  } catch (e) {
    next(e);
  }
});

// Domini
// ============================================================================
router.get('/idDomain', async (req, res, next) => {
  const jsonIdDomaion = fs.readFileSync(pathSerivizi).toString();
  const jsonDomainConvert = await JSON.parse(jsonIdDomaion);
  const id: any = [];
  let idDomain;

  try {
    for (let index = 0; index < jsonDomainConvert.length; index++) {
      const element = jsonDomainConvert[index];
      try {
        if (element.domain_id) {
          id.push(element.domain_id);
          idDomain = JSON.stringify(id);
          fs.writeFileSync(pathDomainId, idDomain);
        }
      } catch (e) {
        console.log(e);
      }
    }
    return res.status(200).json(idDomain);
  } catch (e) {
    next(e);
  }
});

router.get('/detailsDomain', async (req, res, next) => {
  let detailDomain;
  try {
    for (let index = 0; index < idDomini.length; index++) {
      const element = idDomini[index];
      const jsonFiledm = fs.readFileSync(pathDomain).toString();
      let jsonconvert = JSON.parse(jsonFiledm);

      try {
        const test = await axios.get(
          'https://manager.shellrent.com/api2/domain/details/' + element,
          {
            headers: {
              Authorization:
                'usr0003b2e.2fb687f157999ae1ee706e9fd12ae2ed802647b86bc4d741457e8523e7b7dea9eaa82d65add48b9c489884408f3e1714',
            },
          }
        ); //Username.Token

        jsonconvert = await [...jsonconvert, test.data.data];
        detailDomain = JSON.stringify(jsonconvert);
        fs.writeFileSync(pathDomain, detailDomain);
      } catch (e: any) {
        console.log(e);
        fs.writeFileSync(patherr, e);
      }
    }

    return res.status(200).json(detailDomain);
  } catch (e) {
    next(e);
  }
});

// certificate
// ============================================================================
router.get('/idCertificate', async (req, res, next) => {
  const jsonIdCertificate = fs.readFileSync(pathSerivizi).toString();
  const jsonCertificateConvert = await JSON.parse(jsonIdCertificate);
  const id: any = [];
  let idCertificate;

  try {
    for (let index = 0; index < jsonCertificateConvert.length; index++) {
      const element = jsonCertificateConvert[index];
      try {
        if (element.certificate_id) {
          id.push(element.certificate_id);
          idCertificate = JSON.stringify(id);
          fs.writeFileSync(pathCertificateId, idCertificate);
        }
      } catch (e) {
        console.log(e);
      }
    }
    return res.status(200).json(idCertificate);
  } catch (e) {
    next(e);
  }
});

router.get('/detailsCertificate', async (req, res, next) => {
  let detailCertificate;
  try {
    for (let index = 0; index < idCertificati.length; index++) {
      const element = idCertificati[index];
      const jsonFilect = fs.readFileSync(pathCertificate).toString();
      let jsonconvert = JSON.parse(jsonFilect);

      try {
        const test = await axios.get(
          'https://manager.shellrent.com/api2/certificate/details/' + element,
          {
            headers: {
              Authorization:
                'usr0003b2e.2fb687f157999ae1ee706e9fd12ae2ed802647b86bc4d741457e8523e7b7dea9eaa82d65add48b9c489884408f3e1714',
            },
          }
        ); //Username.Token

        jsonconvert = await [...jsonconvert, test.data.data];
        detailCertificate = JSON.stringify(jsonconvert);
        fs.writeFileSync(pathCertificate, detailCertificate);
      } catch (e: any) {
        console.log(e);
        fs.writeFileSync(patherr, e);
      }
    }

    return res.status(200).json(detailCertificate);
  } catch (e) {
    next(e);
  }
});

// webhosting
// ============================================================================
router.get('/idwebHosting', async (req, res, next) => {
  const jsonIdHosting = fs.readFileSync(pathSerivizi).toString();
  const jsonHostingConvert = await JSON.parse(jsonIdHosting);
  const id: any = [];
  let idHosting;

  try {
    for (let index = 0; index < jsonHostingConvert.length; index++) {
      const element = jsonHostingConvert[index];
      try {
        if (element.hosting_id) {
          id.push(element.hosting_id);
          idHosting = JSON.stringify(id);
          fs.writeFileSync(pathHostingId, idHosting);
        }
      } catch (e) {
        console.log(e);
      }
    }
    return res.status(200).json(idHosting);
  } catch (e) {
    next(e);
  }
});

router.get('/detailsWebHosting', async (req, res, next) => {
  let detailHosting;
  try {
    for (let index = 0; index < idwebhosting.length; index++) {
      const element = idwebhosting[index];
      const jsonFilewh = fs.readFileSync(pathHosting).toString();
      let jsonconvert = JSON.parse(jsonFilewh);

      try {
        const test = await axios.get(
          'https://manager.shellrent.com/api2/hosting/details/' + element,
          {
            headers: {
              Authorization:
                'usr0003b2e.2fb687f157999ae1ee706e9fd12ae2ed802647b86bc4d741457e8523e7b7dea9eaa82d65add48b9c489884408f3e1714',
            },
          }
        ); //Username.Token

        jsonconvert = await [...jsonconvert, test.data.data];
        detailHosting = JSON.stringify(jsonconvert);
        fs.writeFileSync(pathHosting, detailHosting);
      } catch (e: any) {
        console.log(e);
        fs.writeFileSync(patherr, e);
      }
    }

    return res.status(200).json(detailHosting);
  } catch (e) {
    next(e);
  }
});

// Server
// ============================================================================
router.get('/idServer', async (req, res, next) => {
  const jsonIdServer = fs.readFileSync(pathSerivizi).toString();
  const jsonServerConvert = await JSON.parse(jsonIdServer);
  const id: any = [];
  let idServer;

  try {
    for (let index = 0; index < jsonServerConvert.length; index++) {
      const element = jsonServerConvert[index];
      try {
        if (element.server_id) {
          id.push(element.server_id);
          idServer = JSON.stringify(id);
          fs.writeFileSync(pathServerId, idServer);
        }
      } catch (e) {
        console.log(e);
      }
    }
    return res.status(200).json(idServer);
  } catch (e) {
    next(e);
  }
});

router.get('/detailsServer', async (req, res, next) => {
  let detailServer;
  try {
    for (let index = 0; index < idServer.length; index++) {
      const element = idServer[index];
      const jsonFilesr = fs.readFileSync(pathServer).toString();
      let jsonconvert = JSON.parse(jsonFilesr);
      try {
        const test = await axios.get(
          'https://manager.shellrent.com/api2/server/details/' + element,
          {
            headers: {
              Authorization:
                'usr0003b2e.2fb687f157999ae1ee706e9fd12ae2ed802647b86bc4d741457e8523e7b7dea9eaa82d65add48b9c489884408f3e1714',
            },
          }
        ); //Username.Token
        jsonconvert = await [...jsonconvert, test.data.data];
        detailServer = JSON.stringify(jsonconvert);
        fs.writeFileSync(pathServer, detailServer);
      } catch (e: any) {
        console.log(e);
        fs.writeFileSync(patherr, e);
      }
    }
    return res.status(200).json(detailServer);
  } catch (e) {
    next(e);
  }
});

// Server PC VM
// ============================================================================
router.get('/idServerVm', async (req, res, next) => {
  const jsonIdServervm = fs.readFileSync(pathSerivizi).toString();
  const jsonServerConvert = await JSON.parse(jsonIdServervm);
  let arrayids: any = [];
  let idServervm;
  try {
    for (let index = 0; index < jsonServerConvert.length; index++) {
      const element = jsonServerConvert[index];
      try {
        if (element.pc_vm_server_ids) {
          const prova = element.pc_vm_server_ids;
          console.log(prova);
          for (let index = 0; index < prova.length; index++) {
            const element = prova[index];
            arrayids = [...arrayids, element];
            idServervm = JSON.stringify(arrayids);
            console.log(idServervm);
            fs.writeFileSync(pathServervmId, idServervm);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    return res.status(200).json(arrayids);
  } catch (e) {
    next(e);
  }
});

router.get('/detailsServervm', async (req, res, next) => {
  let detailServervm;
  try {
    for (let index = 0; index < IdSeverVm.length; index++) {
      const element = IdSeverVm[index];
      const jsonFilesrvm = fs.readFileSync(pathServervm).toString();
      let jsonconvert = JSON.parse(jsonFilesrvm);
      try {
        const test = await axios.get(
          'https://manager.shellrent.com/api2/server/details/' + element,
          {
            headers: {
              Authorization:
                'usr0003b2e.2fb687f157999ae1ee706e9fd12ae2ed802647b86bc4d741457e8523e7b7dea9eaa82d65add48b9c489884408f3e1714',
            },
          }
        ); //Username.Token
        jsonconvert = await [...jsonconvert, test.data.data];
        detailServervm = JSON.stringify(jsonconvert);
        fs.writeFileSync(pathServervm, detailServervm);
      } catch (e: any) {
        console.log(e);
        fs.writeFileSync(patherr, e);
      }
    }
    return res.status(200).json(detailServervm);
  } catch (e) {
    next(e);
  }
});

// Profilo
// ============================================================================
router.get('/detailProfile', async (req, res, next) => {
  let detailProfile;
  try {
    const jsonFilesr = fs.readFileSync(pathProfile).toString();
    let jsonconvert = JSON.parse(jsonFilesr);
    try {
      const test = await axios.get(
        'https://manager.shellrent.com/api2/account/details',
        {
          headers: {
            Authorization:
              'usr0003b2e.2fb687f157999ae1ee706e9fd12ae2ed802647b86bc4d741457e8523e7b7dea9eaa82d65add48b9c489884408f3e1714',
          },
        }
      ); //Username.Token
      jsonconvert = await [test.data.data];
      detailProfile = JSON.stringify(jsonconvert);
      fs.writeFileSync(pathProfile, detailProfile);
    } catch (e: any) {
      console.log(e);
      fs.writeFileSync(patherr, e);
    }

    return res.status(200).json(detailProfile);
  } catch (e) {
    next(e);
  }
});

// Category service
// ============================================================================

router.get('/NameCategory', async (req, res, next) => {
  const jsonIdServervm = fs.readFileSync(pathSerivizi).toString();
  const jsonServerConvert = await JSON.parse(jsonIdServervm);
  let arrayname: any = [];
  let detailServervm;
  
  try {
    for (let index = 0; index < jsonServerConvert.length; index++) {
      const element = jsonServerConvert[index];
      try {
        if (element.name) {
          const categoria = element.name.split(':')[0];
          arrayname=[...arrayname,categoria];
        }  
      } catch (e) {
        console.log(e);
      }
    }
     arrayname = [...new Set(arrayname)];
     detailServervm = JSON.stringify(arrayname);
     fs.writeFileSync(pathCategoryName, detailServervm);
   return res.status(200).json(arrayname);
  } catch (e) {
    next(e);
  }
});

export default router;
