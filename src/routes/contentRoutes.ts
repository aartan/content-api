import express, { Router, Request, Response } from "express";
import {
  listContent,
  getContent,
  createContent,
  updateContent,
  removeContent,
} from "../controller/contentController";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  await listContent(req, res);
});

router.get("/:id", async (req: Request, res: Response) => {
  await getContent(req, res);
});

router.post("/", async (req: Request, res: Response) => {
  await createContent(req, res);
});

router.put("/:id", async (req: Request, res: Response) => {
  await updateContent(req, res);
});

router.delete("/:id", async (req: Request, res: Response) => {
  await removeContent(req, res);
});

export default router;
