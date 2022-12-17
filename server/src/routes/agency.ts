import { Router } from 'express';

import prisma from '@lib/prisma';

import validate, {
  isEmail,
  isLength,
  isMin,
  isPhone,
  isRequired,
  isString,
  isAgencyEmailAvailable,
} from '@lib/validation';

import { authRequired } from '@middlewares';

const router = Router();

router.get('/agency', 
authRequired, async (req, res, next) => {
  try {
    const agency = await prisma.agency.findMany();
    return res.status(200).json(agency);
  } catch (e) {
    next(e);
  }
});

router.get( '/agency/:agencyId', //GetSingle
  authRequired,
  async (req, res, next) => {
    const id = +req.params.agencyId;
    if ((await prisma.agency.count({ where: { id } })) === 0) {
      return res
        .status(404)
        .json({ message: "Nessuna Agenzia trovata con l'id selezionato" });
    }
    try {
      const agency = await prisma.agency.findFirst({
        where: { id },
      });
      return res.status(200).json(agency);
    } catch (e) {
      next(e);
    }
  }
);

router.post('/agency', authRequired, async (req, res, next) => {
  try {
    const { companyName, email, phone, logo, pIva,address } = req.body;

    await validate(req.body, {
      companyName: [isRequired, isString, isMin(3)],
      email: [isRequired, isString, isEmail, isAgencyEmailAvailable()],
      phone: [isString, isPhone],
      logo: [isRequired, isString],
      pIva: [isRequired, isString, isLength(11)],
      address:[isString]
    });

    const agency = await prisma.agency.create({
      data: {
        companyName,
        email,
        phone,
        logo,
        pIva,
        address
      },
    });
    return res.status(200).json(agency);
  } catch (e) {
    next(e);
  }
});

router.patch('/agency/:agencyId', authRequired, async (req, res, next) => {
  try {
    const { companyName, email, phone, logo, pIva, address} = req.body;
    const id = +req.params.agencyId;

    if ((await prisma.agency.count({ where: { id } })) === 0) {
      return res
        .status(404)
        .json({ message: "Nessuna Agenzia trovata con l'id selezionato" });
    }
    await validate(req.body, {
      companyName: [isRequired, isString, isMin(3)],
      email: [isRequired, isString, isEmail, isAgencyEmailAvailable()],
      phone: [isString, isPhone],
      logo: [isRequired, isString],
      pIva: [isRequired, isString, isLength(11)],
      address:[isString]
    });

    const agency = await prisma.agency.update({
      data: {
        companyName,
        email,
        phone,
        logo,
        pIva,
        address
      },
      where: { id },
    });
    return res.status(200).json(agency);
  } catch (e) {
    next(e);
  }
});

router.delete('/agency/:agencyId', authRequired, async (req, res, next) => {
  try {
    const id = +req.params.agencyId;

    if ((await prisma.agency.count({ where: { id } })) === 0) {
      return res
        .status(404)
        .json({ message: "Nessuna Agenzia trovata con l'id selezionato" });
    }

    await prisma.agency.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'success' });
  } catch (e) {
    next(e);
  }
});

export default router;
