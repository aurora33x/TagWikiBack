import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "../user";

let mongod;

const user = {
  email: "test@test.com",
  username: "username",
  password: "password",
};

const users = [user];

/**
 * Before all tests, create an in-memory MongoDB instance so we don't have to test on a real database,
 * then establish a mongoose connection to it.
 */
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();

  const connectionString = mongod.getUri();
  await mongoose.connect(connectionString, { useNewUrlParser: true });
});

/**
 * Before each test, intialize the database with some data
 */
beforeEach(async () => {
  // Drop existing collections
  await mongoose.connection.db.dropDatabase();

  // const coll = await mongoose.connection.db.createCollection("users");
  // await coll.insertMany(users);
  await User.insertMany(users);
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
  }
});


afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];

    await collection.drop();
  }
})


/**
 * After all tests, gracefully terminate the in-memory MongoDB instance and mongoose connection.
 */
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

it("gets user", async () => {
  const userFromDb = await User.find();
  expect(userFromDb).toBeTruthy();
  expect(userFromDb.length).toBe(1);
});