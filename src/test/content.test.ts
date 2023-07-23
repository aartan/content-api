import request from "supertest";
import express from "express";
import contentRoutes from "../routes/contentRoutes";
import * as contentModel from "../model/contentModel";

jest.mock("../model/contentModel");

const app = express();
app.use(express.json());
app.use("/content", contentRoutes);

describe("Content API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should list all content", async () => {
    const mockContent = [
      {
        id: "1",
        title: "Mocked Content",
        description: "This is a mocked content",
        image: "mocked-content.jpg",
        edited: "2023-07-19",
        tag: "mocked",
      },
    ];
    jest
      .spyOn(contentModel, "getAllContentFromDatabase")
      .mockResolvedValue(mockContent);

    const response = await request(app).get("/content");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockContent);
    expect(contentModel.getAllContentFromDatabase).toHaveBeenCalledTimes(1);
  });

  it("should get content by ID", async () => {
    const mockContent = {
      id: "1",
      title: "Mocked Content",
      description: "This is a mocked content",
      image: "mocked-content.jpg",
      edited: "2023-07-19",
      tag: "mocked",
    };
    jest
      .spyOn(contentModel, "getContentFromDatabase")
      .mockResolvedValue(mockContent);

    const response = await request(app).get("/content/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockContent);
    expect(contentModel.getContentFromDatabase).toHaveBeenCalledTimes(1);
    expect(contentModel.getContentFromDatabase).toHaveBeenCalledWith("1");
  });

  it("should return 404 if content not found", async () => {
    jest.spyOn(contentModel, "getContentFromDatabase").mockResolvedValue(null);

    const response = await request(app).get("/content/999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Content not found" });
    expect(contentModel.getContentFromDatabase).toHaveBeenCalledTimes(1);
    expect(contentModel.getContentFromDatabase).toHaveBeenCalledWith("999");
  });
});
