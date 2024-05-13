const request = require("supertest");
const app = require("../app"); // Ganti dengan lokasi file aplikasi Anda

describe("Test API endpoints", () => {
  it("should return 200 OK for test api GET /", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});
