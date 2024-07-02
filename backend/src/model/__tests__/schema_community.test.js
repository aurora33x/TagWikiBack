import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Community } from "../community";

let mongod;

const community = {
  _id: new mongoose.Types.ObjectId("000000000000000000000001"),
  name: "community",
  authorId: new mongoose.Types.ObjectId("000000000000000000000002"),
  avatar: "avatar",
  intro: "intro",
  memberId: new mongoose.Types.ObjectId("000000000000000000000003"),
  posts: "post",
};

const communities = [community];

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

  const coll = await mongoose.connection.db.createCollection("communities");
  await coll.insertMany(communities);
});

/**
 * After all tests, gracefully terminate the in-memory MongoDB instance and mongoose connection.
 */
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

it("gets community", async () => {
  const communityFromDb = await Community.find();
  expect(communityFromDb).toBeTruthy();
  expect(communityFromDb.length).toBe(1);
});
