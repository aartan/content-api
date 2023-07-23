import Joi from "joi";
import { client } from "../utils/client";
import logger from "../utils/logger";
import ContentData from "../utils/content";
import dotenv from "dotenv";
dotenv.config();

const databaseId = process.env.COSMOSDB_DATABASE || "";
const containerId = process.env.COSMOSDB_CONTAINER || "";

export const contentSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  edited: Joi.string().required(),
  tag: Joi.string().required(),
});

export async function getAllContentFromDatabase(): Promise<ContentData[]> {
  const content = client
    .database(databaseId)
    .container(containerId)
    .items.query("SELECT * FROM c");

  try {
    const { resources: allExistingContent } = await content.fetchAll();

    return allExistingContent.map(
      ({ id, title, description, image, edited, tag }: ContentData) => ({
        id,
        title,
        description,
        image,
        edited,
        tag,
      })
    );
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

export async function getContentFromDatabase(
  id: string
): Promise<ContentData | null> {
  const content = client.database(databaseId).container(containerId).item(id);

  try {
    const { resource: existingContent } = await content.read();

    if (!existingContent) {
      return null;
    }

    const { id, title, description, image, edited, tag }: ContentData =
      existingContent;
    return { id, title, description, image, edited, tag };
  } catch (error) {
    logger.error("Error getting content: ", error);
    throw error;
  }
}

export async function createContentInDatabase(
  contentData: ContentData
): Promise<ContentData | null> {
  const content = client.database(databaseId).container(containerId).items;

  try {
    const { resource: newContent } = await content.create({ ...contentData });

    if (!newContent) {
      return null;
    }

    const { id, title, description, image, edited, tag }: ContentData =
      newContent;

    return { id, title, description, image, edited, tag };
  } catch (error) {
    logger.error("Error creating content: ", error);
    throw error;
  }
}

export async function updateContentInDatabase(
  id: string,
  contentData: ContentData
): Promise<ContentData | null> {
  const content = client.database(databaseId).container(containerId).item(id);

  try {
    const { resource: updatedContent } = await content.replace(contentData);

    if (!updatedContent) {
      return null;
    }

    const { id, title, description, image, edited, tag }: ContentData =
      updatedContent;

    return { id, title, description, image, edited, tag };
  } catch (error) {
    logger.error("Error updating content: ", error);
    throw error;
  }
}

export async function removeContentFromDatabase(id: string): Promise<void> {
  const content = client.database(databaseId).container(containerId).item(id);

  try {
    const { resource: existingContent } = await content.read();
    if (!existingContent) {
      return;
    }
    await content.delete();

    return;
  } catch (error) {
    logger.error("Error deleting content: ", error);
  }
}

export async function getNextId() {
  const query = "SELECT c.id FROM c";
  const { resources: items } = await client
    .database(databaseId)
    .container(containerId)
    .items.query(query)
    .fetchAll();

  let latestId = 0;

  if (items.length > 0) {
    items.sort((a, b) => {
      const numericPartA = parseInt(a.id.match(/\d+/)[0], 10);
      const numericPartB = parseInt(b.id.match(/\d+/)[0], 10);
      return numericPartB - numericPartA;
    });

    const lastItemId = items[0].id;
    const numericPart = parseInt(lastItemId.match(/\d+/)[0], 10);
    latestId = isNaN(numericPart) ? 0 : numericPart;
  }

  return (latestId + 1).toString();
}
