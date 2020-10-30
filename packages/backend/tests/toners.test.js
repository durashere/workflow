const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app.js");
const Toner = require("../src/models/tonerModel");
const User = require("../src/models/userModel");

const { hashPassword } = require("../src/util");

const request = supertest(app);

beforeAll(async () => {
  const hashedPassword = await hashPassword("testPassword");

  const testUser = new User({
    firstName: "testUserFirstName",
    lastName: "testUserLastName",
    username: "testUserUsername",
    role: "user",
    password: hashedPassword,
  });
  await testUser.save();
  const loggedUser = await request.post("/api/login").send({
    username: "testUserUsername",
    password: "testPassword",
  });
  userToken = loggedUser.body.token;

  const testAdmin = new User({
    firstName: "testAdminFirstName",
    lastName: "testAdminLastName",
    username: "testAdminUsername",
    role: "admin",
    password: hashedPassword,
  });
  await testAdmin.save();
  const loggedAdmin = await request.post("/api/login").send({
    username: "testAdminUsername",
    password: "testPassword",
  });
  adminToken = loggedAdmin.body.token;
});

describe("Toners Service", () => {
  describe("GET Route", () => {
    it("Should not be public", async () => {
      const response = await request.get("/api/toners");

      expect(response.statusCode).toBe(401);
    });

    it("Should require authorization to fetch", async () => {
      const response = await request
        .get("/api/toners")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
    });
  });

  describe("POST Route", () => {
    it("Should require admin to post new toner", async () => {
      const testToner = { brand: "HP", code: "testCode", color: "Black" };

      const response = await request
        .post("/api/toners")
        .send(testToner)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(401);
    });
  });
});

afterEach(async () => {
  // await Toner.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
