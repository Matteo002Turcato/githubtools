import { Router } from 'express';

import prisma from '@lib/prisma';

import validate, { isRequired, isString, isMax } from '@lib/validation';

import { authRequired } from '@middlewares';

const router = Router();

router.get('/category', authRequired, async (req, res, next) => {
  try {
    const category = await prisma.category.findMany();
    return res.status(200).json(category);
  } catch (e) {
    next(e);
  }
});

router.get(
  '/category/:categoryId', //GettSingle
  authRequired,
  async (req, res, next) => {
    const id = +req.params.categoryId;
    if ((await prisma.category.count({ where: { id } })) === 0) {
      return res
        .status(404)
        .json({ message: "Nessuna Categoria trovata con l'id selezionato" });
    }
    try {
      const Category = await prisma.category.findFirst({
        where: { id },
      });
      return res.status(200).json(Category);
    } catch (e) {
      next(e);
    }
  }
);

router.post('/category', authRequired, async (req, res, next) => {
  try {
    const { name } = req.body;

    await validate(req.body, {
      name: [isRequired, isString, isMax(50)],
    });

    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    return res.status(200).json(category);
  } catch (e) {
    next(e);
  }
});

router.patch('/category/:categoryId', authRequired, async (req, res, next) => {
  try {
    const { name } = req.body;
    const id = +req.params.categoryId;
    if ((await prisma.category.count({ where: { id } })) === 0) {
      return res
        .status(404)
        .json({ message: "Nessuna Categoria trovata con l'id selezionato" });
    }

    await validate(req.body, {
      name: [isRequired, isString, isMax(50)],
    });

    const category = await prisma.category.update({
      data: {
        name,
      },
      where: { id },
    });
    return res.status(200).json(category);
  } catch (e) {
    next(e);
  }
});

router.delete('/category/:categoryId', authRequired, async (req, res, next) => {
  try {
    const id = +req.params.categoryId;

    if ((await prisma.category.count({ where: { id } })) === 0) {
      return res
        .status(404)
        .json({ message: "Nessuna Categoria trovata con l'id selezionato" });
    }

    await prisma.category.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'success' });
  } catch (e) {
    next(e);
  }
});

export default router;
