import {
  getAllContentFromDatabase,
  getContentFromDatabase,
  contentSchema,
  updateContentInDatabase,
  createContentInDatabase,
  removeContentFromDatabase,
  getNextId,
} from "../model/contentModel";
import { Request, Response } from "express";
import logger from "../utils/logger";

export async function listContent(req: Request, res: Response) {
  try {
    const content = await getAllContentFromDatabase();
    res.json(content);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving content" });
  }
}

export async function getContent(req: Request, res: Response) {
  try {
    const contentId = req.params.id;
    const existingContent = await getContentFromDatabase(contentId);

    if (!existingContent) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.status(200).json(existingContent);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the content" });
  }
}

export async function createContent(req: Request, res: Response) {
  try {
    const contentId = await getNextId();
    const contentData = { id: contentId, ...req.body };

    const { error } = contentSchema.validate(contentData);

    if (error) {
      return res.status(400).json({ error: "Bad Request" });
    }

    const newContent = await createContentInDatabase(contentData);
    res.status(201).json(newContent);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the content" });
  }
}

export async function updateContent(req: Request, res: Response) {
  try {
    const contentId = req.params.id;
    const contentData = req.body;
    const existingContent = await getContentFromDatabase(contentId);

    if (!existingContent) {
      return res.status(404).json({ error: "Content not found" });
    }

    const { error } = contentSchema.validate({
      id: contentId,
      ...contentData,
    });

    if (error) {
      return res.status(400).json({ error: "Bad Request" });
    }

    const updatedContent = await updateContentInDatabase(contentId, {
      id: contentId,
      ...contentData,
    });
    res.status(200).json(updatedContent);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the content" });
  }
}

export async function removeContent(req: Request, res: Response) {
  try {
    const contentId = req.params.id;
    const existingContent = await getContentFromDatabase(contentId);

    if (!existingContent) {
      return res.status(404).json({ error: "Content not found" });
    }

    const content = await removeContentFromDatabase(contentId);

    res.status(200).json(content);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the content" });
  }
}
