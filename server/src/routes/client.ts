import { Router } from 'express';

import prisma from '@lib/prisma';

import validate, {
  isEmail,
  isIn,
  isLength,
  isMax,
  isPhone,
  isRequired,
  isString,
  isClientEmailAvailable,
  isFiscalCode,
  isRequiredIf,
  isAgencyIdValid,
  isInt,
  isRequiredWithoutAll,
} from '@lib/validation';

import { authRequired } from '@middlewares';

import { Type } from '@prisma/client';

const router = Router();

router.get('/client', authRequired, async (req, res, next) => {
  try {
    const client = await prisma.client.findMany();
    return res.status(200).json(client);
  } catch (e) {
    next(e);
  }
});

router.get(
  '/client/:clientId', //GettSingle
  authRequired,
  async (req, res, next) => {
    const id = +req.params.clientId;
    if ((await prisma.client.count({ where: { id } })) === 0) {
      return res
        .status(404)
        .json({ message: "Nessuna Cliente trovato con l'id selezionato" });
    }
    try {
      const client = await prisma.client.findFirst({
        where: { id },
      });
      return res.status(200).json(client);
    } catch (e) {
      next(e);
    }
  }
);

router.post('/client', authRequired, async (req, res, next) => {
  try {
    const {
      name,
      surname,
      type,
      email,
      companyName,
      pIva,
      fiscalCode,
      address,
      phone,
      pec,
      sdi,
      agencyId,
    } = req.body;

    await validate(req.body, {
      name: [isString, isMax(50), isRequiredIf({ type: 'Holder' })],
      surname: [isString, isMax(50), isRequiredIf({ type: 'Holder' })],
      type: [isRequired, isString, isIn(Object.values(Type))],
      email: [isRequired, isString, isEmail, isClientEmailAvailable()],
      companyName: [isRequired, isString, isMax(50)],
      pIva: [isRequired, isString, isLength(11)],
      fiscalCod: [isRequired, isString, isFiscalCode],
      address: [isRequired, isString, isMax(50)],
      phone: [isString, isPhone],
      pec: [isString, isEmail, isRequiredWithoutAll(sdi)],
      sdi: [isString, isEmail, isRequiredWithoutAll(pec)],
      agencyId: [isInt, isAgencyIdValid],
    });

    const client = await prisma.client.create({
      data: {
        name,
        surname,
        type,
        email,
        companyName,
        pIva,
        fiscalCode,
        address,
        phone,
        pec,
        sdi,
        agencyId,
      },
    });
    return res.status(200).json(client);
  } catch (e) {
    next(e);
  }
});

router.patch('/client/:clientId', authRequired, async (req, res, next) => {
  try {
    const {
      name,
      surname,
      type,
      email,
      companyName,
      pIva,
      fiscalCode,
      address,
      phone,
      pec,
      sdi,
      agencyId,
    } = req.body;
    const id = +req.params.clientId;

    if ((await prisma.client.count({ where: { id } })) === 0) {
      return res
        .status(404)
        .json({ message: "Nessuna Cliente trovato con l'id selezionato" });
    }

    await validate(req.body, {
      name: [isString, isMax(50), isRequiredIf({ type: 'Holder' })],
      surname: [isString, isMax(50), isRequiredIf({ type: 'Holder' })],
      type: [isRequired, isString, isIn(Object.values(Type))],
      email: [isRequired, isString, isEmail, isClientEmailAvailable()],
      companyName: [isRequired, isString, isMax(50)],
      pIva: [isRequired, isString, isLength(11)],
      fiscalCod: [isRequired, isString, isFiscalCode],
      address: [isRequired, isString, isMax(50)],
      phone: [isString, isPhone],
      pec: [isString, isEmail, isRequiredWithoutAll(sdi)],
      sdi: [isString, isEmail, isRequiredWithoutAll(pec)],
      agencyId: [isInt, isAgencyIdValid],
    });

    const client = await prisma.client.update({
      data: {
        name,
        surname,
        type,
        email,
        companyName,
        pIva,
        fiscalCode,
        address,
        phone,
        pec,
        sdi,
        agencyId,
      },
      where: { id },
    });
    return res.status(200).json(client);
  } catch (e) {
    next(e);
  }
});

router.delete('/client/:clientId', authRequired, async (req, res, next) => {
  try {
    const id = +req.params.clientId;

    if ((await prisma.client.count({ where: { id } })) === 0) {
      return res
        .status(404)
        .json({ message: "Nessuna Cliente trovato con l'id selezionato" });
    }

    await prisma.client.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'success' });
  } catch (e) {
    next(e);
  }
});

export default router;
