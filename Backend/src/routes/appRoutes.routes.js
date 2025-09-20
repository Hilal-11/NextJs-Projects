import express from "express";
const appRouter = express.Router();

import { createNote , getNotes } from "../controllers/note.controller";

appRouter.get("/getNotes" , getNotes);
appRouter.post("/createNote" , createNote)


export default appRouter;