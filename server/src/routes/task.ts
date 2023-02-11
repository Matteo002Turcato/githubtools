import { Router } from 'express';

import prisma from '@lib/prisma';
import { Prisma, TaskPriority } from '@prisma/client';
import validate, {
  isIn,
  isInt,
  isIntConvert,
  isMax,
  isMin,
  isRequired,
  isRequiredWith,
  isString,
  isTaskStatusIdValid,
} from '@lib/validation';

const router = Router();

const SortBy = {
  title: 'title',
};
//filtri=======================================================
router.get('/tasks', async (req, res, next) => {
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

    // @ts-ignore
    let orderBy: Prisma.Enumerable<Prisma.TasksStatusOrderByWithRelationInput> =
      {};
    const where: Prisma.TasksStatusWhereInput = {};

    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'title':
          orderBy = { title: req.query.sortOrder as Prisma.SortOrder };
          break;
      }
    }

    if (
      req.query.searchQuery &&
      (req.query.searchQuery as string).trim() !== ''
    ) {
      where.OR = [
        {
          title: { contains: req.query.searchQuery as string },
        },
      ];
    }

    const taskStatus = await prisma.tasks.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        taskStatusId: true,
      },
      where,
      orderBy,
      skip: req.query.page
        ? (+req.query.page - 1) * +req.query.pageLength!
        : undefined,
      take: req.query.pageLength ? +req.query.pageLength! : undefined,
    });

    return res.json(taskStatus);
  } catch (e) {
    next(e);
  }
});

router.get(
  '/tasks/count',
  /*authRequired,*/
  async (req, res, next) => {
    try {
      // @ts-ignore
      await validate(req.query, {
        searchQuery: [isString],
      });

      const where: Prisma.TasksStatusWhereInput = {};

      if (
        req.query.searchQuery &&
        (req.query.searchQuery as string).trim() !== ''
      ) {
        where.OR = [
          {
            title: { contains: req.query.searchQuery as string },
          },
        ];
      }

      const count = await prisma.tasks.count({
        where,
      });

      return res.json({ count });
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  '/tasks/:taskId',
  /*authRequired,*/
  async (req, res, next) => {
    try {
      const id = +req.params.taskId;

      const taskStatus = await prisma.tasks.findFirst({
        where: { id },
      });

      if (!taskStatus) {
        return res
          .status(404)
          .json({ message: "Nessuna Task trovato con l'id selezionato" });
      }

      return res.json(taskStatus);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  '/task',
  /*authRequired,*/ async (req, res, next) => {
    try {
      await validate(req.body, {
        title: [isRequired, isString, isMin(3), isMax(20)],
        description: [isRequired, isString],
        priority: [isRequired, isString, isIn(Object.values(TaskPriority))],
        taskStatusId: [isRequired, isTaskStatusIdValid, isInt],
      });

      const { title, description, priority, taskStatusId } = req.body;

      const task = await prisma.tasks.create({
        data: {
          title,
          description,
          priority,
          taskStatusId,
        },
      });
      return res.status(201).json(task);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  '/tasks/:taskId',
  /*authRequired,*/ async (req, res, next) => {
    try {
      const id = +req.params.taskId;

      if ((await prisma.tasksStatus.count({ where: { id } })) === 0) {
        return res
          .status(404)
          .json({ message: "Nessuna Task trovato con l'id selezionato" });
      }

      await validate(req.body, {
        title: [isRequired, isString, isMin(3), isMax(20)],
        description: [isRequired, isString],
        priority: [isRequired, isString, isIn(Object.values(TaskPriority))],
        taskStatusId: [isRequired, isTaskStatusIdValid, isInt],
      });

      const { title, description, priority, taskStatusId } = req.body;

      const taskStatus = await prisma.tasks.update({
        data: {
          title,
          description,
          priority,
          taskStatusId,
        },
        where: { id },
      });

      return res.json(taskStatus);
    } catch (e) {
      next(e);
    }
  }
);

router.delete('/tasks/:taskId', async (req, res, next) => {
  try {
    const id = +req.params.taskId;

    if ((await prisma.tasksStatus.count({ where: { id } })) === 0) {
      return res
        .status(404)
        .json({ message: "Nessuno Task trovato con l'id selezionato" });
    }

    await prisma.tasks.delete({
      where: { id },
    });

    return res.json({ message: 'success' });
  } catch (e) {
    next(e);
  }
});

export default router;
