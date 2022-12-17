import { Router } from 'express';

import prisma from '@lib/prisma';

import validate, {
  isRequired,
  isString,
  isMax,
  isInt,
  isIn,
  isDate,
  isClientIdValid,
  IscategoryIdValid,
  isRequiredIf,
  isNumber,
} from '@lib/validation';

import { State, TypeService } from '@prisma/client';

import { authRequired } from '@middlewares';

const router = Router();

router.get('/service', authRequired, async (req, res, next) => {
  try {
    const service = await prisma.service.findMany();
    return res.status(200).json(service);
  } catch (e) {
    next(e);
  }
});

router.get('/service/:serviceId', authRequired, async (req, res, next) => {
  const id = +req.params.serviceId;
  if ((await prisma.service.count({ where: { id } })) === 0) {
    return res
      .status(404)
      .json({ message: "Nessun Servizio trovato con l'id selezionato" });
  }
  try {
    const service = await prisma.service.findFirst({
      where: { id },
    });
    return res.status(200).json(service);
  } catch (e) {
    next(e);
  }
});

router.post('/service', authRequired, async (req, res, next) => {
  try {
    const {
      name,
      categoryId,
      costService,
      typeService,
      costServiceMarkup,
      primaryServiceId,
      state,
      clientId,
      dateExpiry,
      autorenewDate,
    } = req.body;

    await validate(req.body, {
      name: [isRequired, isString, isMax(50)],
      categoryId: [isRequired, isString, IscategoryIdValid], //problema non mi prende le categorie in database
      typeService: [isRequired, isString, isIn(Object.values(TypeService))],
      costService: [isRequired, isNumber],
      costServiceMarkup: [isRequired, isNumber],
      primaryServiceId: [
        isInt,
        isRequiredIf({ typeService: TypeService.secondary }),
      ],
      state: [isRequired, isString, isIn(Object.values(State))],
      clientId: [isInt, isClientIdValid],
      dateExpiry: [isRequired, isDate],
      autorenewDate: [isRequired, isDate],
    });

    const service = await prisma.service.create({
      data: {
        name,
        categoryId,
        typeService,
        costService,
        costServiceMarkup,
        primaryServiceId,
        state,
        clientId,
        dateExpiry,
        autorenewDate,
      },
    });
    return res.status(200).json(service);
  } catch (e) {
    next(e);
  }
});

router.patch('/service/:serviceId', authRequired, async (req, res, next) => {
  try {
    const {
      name,
      categoryId,
      costService,
      typeService,
      costServiceMarkup,
      primaryServiceId,
      state,
      clientId,
      dateExpiry,
      autorenewDate,
    } = req.body;
    const id = +req.params.serviceId;
    if ((await prisma.service.count({ where: { id } })) === 0) {
      return res
        .status(404)
        .json({ message: "Nessuna Servizio trovata con l'id selezionato" });
    }

    await validate(req.body, {
      name: [isRequired, isString, isMax(50)],
      categoryId: [isRequired, isString, IscategoryIdValid],
      typeService: [isRequired, isString, isIn(Object.values(TypeService))],
      costService: [isRequired, isNumber],
      costServiceMarkup: [isRequired, isNumber],
      primaryServiceId: [
        isInt,
        isRequiredIf({ typeService: TypeService.secondary }),
      ], // creare tipo enum Primario/secondario
      state: [isRequired, isString, isIn(Object.values(State))],
      clientId: [isInt, isClientIdValid],
      dateExpiry: [isRequired, isDate],
      autorenewDate: [isRequired, isDate],
    });

    const service = await prisma.service.update({
      data: {
        name,
        categoryId,
        costService,
        typeService,
        costServiceMarkup,
        primaryServiceId,
        state,
        clientId,
        dateExpiry,
        autorenewDate,
      },
      where: { id },
    });
    return res.status(200).json(service);
  } catch (e) {
    next(e);
  }
});

router.delete('/service/:serviceId', authRequired, async (req, res, next) => {
  try {
    const id = +req.params.serviceId;

    if ((await prisma.service.count({ where: { id } })) === 0) {
      return res
        .status(404)
        .json({ message: "Nessuna Servizio trovata con l'id selezionato" });
    }

    await prisma.service.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'success' });
  } catch (e) {
    next(e);
  }
});

export default router;
