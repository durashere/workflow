const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app.js");
const Toner = require("../src/models/tonerModel");
const TonerLog = require("../src/models/tonerLogModel");
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

describe("TonersLogs Service", () => {
  describe("GET Route", () => {
    it("Should require authorization", async () => {
      const response = await request.get("/api/tonerslogs");

      expect(response.statusCode).toBe(401);
    });

    it("Should allow authorized to fetch", async () => {
      const response = await request
        .get("/api/tonerslogs")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
    });
  });
  describe("POST Route", () => {
    it("Should require authorization", async () => {
      const response = await request.post("/api/tonerslogs");

      expect(response.statusCode).toBe(401);
    });

    it.only("Should be able to create log decrease amount and attach it to toner", async () => {
      const testToner = new Toner({
        brand: "HP",
        code: "testCode",
        color: "Black",
        amount: 10,
      });
      await testToner.save();

      const testLog = new TonerLog({
        time: new Date(),
      });
      await testLog.save();

      await Toner.updateOne(
        { _id: testToner._id },
        { $push: { logs: testLog._id } },
      );

      const toner = await Toner.find({ _id: testToner._id }).populate("logs");
      console.log(toner[0]);
    });
  });
});

afterEach(async () => {
  await Toner.deleteMany({});
  await TonerLog.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
