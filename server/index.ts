import express from "express";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";

const app = express();
const PORT = 3003;
app.use(cors());

const t = initTRPC.create();

const router = t.router;
const publicProcedure = t.procedure;

type Todo = {
  id: string;
  content: string;
};

const todoList: Todo[] = [
  {
    id: "1",
    content: "買い物",
  },
  {
    id: "2",
    content: "TRPCを勉強する",
  },
];

const appRouter = router({
  getTodos: publicProcedure.query(() => {
    return todoList;
  }),
  addTodo: publicProcedure.input(z.string()).mutation((req) => {
    const id = `${Math.random()}`;
    const todo: Todo = {
      id,
      content: req.input,
    };
    todoList.push(todo);
    return todoList;
  }),
  deleteTodo: publicProcedure.input(z.string()).mutation((req) => {
    const id = req.input;
    const indexToDeleteId = todoList.findIndex((todo) => todo.id === id);
    todoList.splice(indexToDeleteId, 1);
    return todoList;
  }),
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(PORT, () => console.log(`running on PORT ${PORT}`));

export type AppRouter = typeof appRouter;
