import express from "express";
const appRouter = express.Router();

import { createNote , getNotes } from "../controllers/note.controller.js";

appRouter.get("/greeting" , (req , res) => {
    res.end("Hello this is just test route for application running testing")
})
appRouter.get("/getNotes" , getNotes);
appRouter.post("/createNote" , createNote)


export default appRouter;