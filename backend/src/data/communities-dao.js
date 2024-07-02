import { Community } from '../model/community';

async function createCommunity(community) {

  const dbCommunity = new Community(community);
  await dbCommunity.save();
  return dbCommunity;
}

async function retrieveCommunityList() {
  return await Community.find();
}

async function retrieveCommunityListByUserId(userId) {
  return await Community.find({ memberId: userId });
}

async function retrieveCommunity(id) {
  const dbCommunity = await Community.findById(id);
  return dbCommunity;
}

export {
  createCommunity,
  retrieveCommunity,
  retrieveCommunityList,
  retrieveCommunityListByUserId
};
