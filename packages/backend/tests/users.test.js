const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app.js");
const Toner = require("../src/models/tonerModel");
const User = require("../src/models/userModel");

const { hashPassword } = require("../src/util");

const request = supertest(app);

let userToken;
let adminToken;

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

describe("Users Service", () => {
  describe("GET Authorization", () => {
    it("It should require authorization", async () => {
      const response = await request.get("/api/users");

      expect(response.statusCode).toBe(401);
    });

    it("It should fail authorization if role is user", async () => {
      const response = await request
        .get("/api/users")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(401);
      expect(response.type).toBe("application/json");
    });

    it("It should pass authorization if role is admin", async () => {
      const response = await request
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
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
