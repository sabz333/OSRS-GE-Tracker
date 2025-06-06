import request from "supertest";
import app from "../app.js"; // assuming you export the express app

// verify homepage loads
describe("GET /", () => {
  it("should return 200 and render the homepage", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("TOP MOVERS");
  });
});
