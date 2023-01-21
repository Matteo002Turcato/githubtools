import { Router } from 'express';

import { Prisma } from '@prisma/client';

import { hashPassword } from '@lib/passwordHashing';
import prisma from '@lib/prisma';
import validate, {
  isEmail,
  isIn,
  isIntConvert,
  isMax,
  isMin,
  isPasswordValid,
  isRequired,
  isRequiredWith,
  isString,
  isUserEmailAvailable,
  // isUserEmailAvailable
} from '@lib/validation';

const router = Router();

const SortBy = {
  autorenewDate: 'email',
}; /*authRequired,*/

//filtri=================================================================

router.get(
  '/user',
  /*authRequired,*/
  async (req, res, next) => {
    try {
      const user = await prisma.users.findFirst({
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
        },
        where: { id: req.userId },
      });

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
);
router.get(
  '/users',
  /*authRequired,*/
  async (req, res, next) => {
    try {
      await validate(
        //@ts-ignore
        req.query,
        {
          sortBy: [isString, isIn(Object.values(SortBy))],
          sortOrder: [
            isRequiredWith('sortBy'),
            isString,
            isIn(Object.values(Prisma.SortOrder)),
          ],
          searchQuery: [isString],
          page: [isIntConvert, isMin(1)],
          pageLength: [
            isRequiredWith('page'),
            isIntConvert,
            isMin(1),
            isMax(200),
          ],
        }
      );

      let orderBy: Prisma.Enumerable<Prisma.UsersOrderByWithRelationInput> = {};
      const where: Prisma.UsersWhereInput = {};

      if (req.query.sortBy) {
        switch (req.query.sortBy) {
          case 'email':
            orderBy = {
              email: req.query.sortOrder as Prisma.SortOrder,
            };
            break;
        }
      }

      if (
        req.query.searchQuery &&
        (req.query.searchQuery as string).trim() !== ''
      ) {
        where.OR = [
          {
            name: { contains: req.query.searchQuery as string },
          },
        ];
      }

      const users = await prisma.users.findMany({
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          password: true,
        },
        where,
        orderBy,
        skip: req.query.page
          ? (+req.query.page - 1) * +req.query.pageLength!
          : undefined,
        take: req.query.pageLength ? +req.query.pageLength! : undefined,
      });

      return res.json(users);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  '/users/count',
  /*authRequired,*/
  async (req, res, next) => {
    try {
      // @ts-ignore
      await validate(req.query, {
        searchQuery: [isString],
      });

      let where: Prisma.UsersWhereInput = {};

      if (
        req.query.searchQuery &&
        (req.query.searchQuery as string).trim() !== ''
      ) {
        where = {
          OR: [
            {
              name: { contains: req.query.searchQuery as string },
            },
          ],
        };
      }

      const count = await prisma.users.count({
        where,
      });

      return res.json({ count });
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  '/users/:userId',
  /*authRequired,*/
  async (req, res, next) => {
    const id = +req.params.userId;
    if ((await prisma.users.count({ where: { id } })) === 0) {
      return res
        .status(404)
        .json({ message: "Nessun Utente trovato con l'id selezionato" });
    }
    try {
      const user = await prisma.users.findFirst({
        where: { id },
      });
      return res.json(user);
    } catch (e) {
      next(e);
      3;
    }
  }
);

router.post(
  '/users',
  /*authRequired,*/
  async (req, res, next) => {
    try {
      await validate(req.body, {
        name: [isRequired, isString, isMax(20)],
        surname: [isRequired, isString, isMax(20)],
        email: [isRequired, isString, isEmail, isUserEmailAvailable()],
        password: [isRequired, isString, isMin(5)],
      });

      const { name, surname, email, password } = req.body;

      const user = await prisma.users.create({
        data: {
          name,
          surname,
          email,
          password: await hashPassword(password),
        },
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
        },
      });
      return res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  '/users/:userId',
  /*authRequired,*/
  async (req, res, next) => {
    try {
      const id = +req.params.userId;

      if ((await prisma.users.count({ where: { id } })) === 0) {
        return res
          .status(404)
          .json({ message: "Nessuna Utente trovato con l'id selezionato" });
      }

      await validate(req.body, {
        name: [isString, isMax(20)],
        surname: [isString, isMax(20)],
      });

      const { name, surname } = req.body;

      const user = await prisma.users.update({
        data: {
          name,
          surname,
        },
        where: { id },
        select: { id: true, email: true, name: true, surname: true },
      });

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  '/users',
  /*authRequired,*/
  async (req, res, next) => {
    try {
      const { userId } = req;

      await validate(req.body, {
        name: [isString, isMax(20)],
        surname: [isString, isMax(20)],
        email: [isString, isEmail /* isUserEmailAvailable(userId)*/],
        oldPassword: [
          isString,
          isRequiredWith('password'),
          isPasswordValid(userId),
        ],
        password: [isString, isMin(5)],
      });

      const { name, surname, email, password } = req.body;

      const user = await prisma.users.update({
        data: {
          name,
          surname,
          email,
          password: password && (await hashPassword(password)),
        },
        where: { id: userId },
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
        },
      });

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
);

router.delete(
  '/users/:userId',
  /*authRequired,*/ async (req, res, next) => {
    try {
      const id = +req.params.userId;

      if ((await prisma.users.count({ where: { id } })) === 0) {
        return res
          .status(404)
          .json({ message: "Nessuna Utente trovata con l'id selezionato" });
      }

      if ((await prisma.users.count()) === 1) {
        return res.status(404).json({
          message: "Impossibile eliminare l'unico utente disponibile",
        });
      }
      await prisma.users.delete({
        where: { id },
      });

      return res.json({ message: 'success' });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
