import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import Vote from "../vote";

let mongod;

const vote = {
  _id: new mongoose.Types.ObjectId("000000000000000000000001"),
  author: "author",
  commentId: new mongoose.Types.ObjectId("000000000000000000000002"),
  direction: 5,
};

const votes = [vote];

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

  const coll = await mongoose.connection.db.createCollection("votes");
  await coll.insertMany(votes);
});

/**
 * After all tests, gracefully terminate the in-memory MongoDB instance and mongoose connection.
 */
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

it("gets vote", async () => {
  const voteFromDb = await Vote.find();
  expect(voteFromDb).toBeTruthy();
  expect(voteFromDb.length).toBe(1);
});
