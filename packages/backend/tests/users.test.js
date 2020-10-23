const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app.js");
const Toner = require("../src/models/tonerModel");
const User = require("../src/models/userModel");

const { createToken } = require("../src/util");

const request = supertest(app);

let userToken;
let adminToken;

beforeAll(async () => {
  const testUser = new User({
    firstName: "testUserFirstName",
    lastName: "testUserLastName",
    username: "testUserUsername",
    role: "user",
    password: "testPassword",
  });
  const testAdmin = new User({
    firstName: "testAdminFirstName",
    lastName: "testAdminLastName",
    username: "testAdminUsername",
    role: "admin",
    password: "testPassword",
  });

  const savedUser = await testUser.save();
  userToken = createToken(savedUser);
  const savedAdmin = await testAdmin.save();
  adminToken = createToken(savedAdmin);

  // const createUser = await request.post("/api/users").send(testAdmin);
});

// it("Gets the toners endpoint", async (done) => {
//   const response = await request
//     .get("/api/toners")
//     .set("Authorization", `Bearer ${token}`);

//   expect(response.status).toBe(401);
//   expect(response.type).toBe("application/json");

//   done();
// });

describe("Users Service", () => {
  describe("GET /api/users", () => {
    it("It should require authorization", async () => {
      const response = await request.get("/api/users");

      expect(response.statusCode).toBe(401);
    });

    it("It passes authorization", async () => {
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
