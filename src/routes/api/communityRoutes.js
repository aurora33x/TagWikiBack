import express from "express";
import { verifyUserAuth } from "../../auth-middleware";
import {
  createCommunity,
  retrieveCommunity,
  retrieveCommunityList,
  retrieveCommunityListByUserId
} from "../../data/communities-dao";
import User from "../../model/user";
import { Community } from "../../model/community"; // Ensure correct import

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_NO_CONTENT = 204;
const HTTP_BAD_REQUEST = 400;
const HTTP_INTERNAL_SERVER_ERROR = 500;

const router = express.Router();

// Create new community
router.post('/create', verifyUserAuth, async (req, res) => {
  try {
    const newCommunity = await createCommunity({
      name: req.body.name,
      intro: req.body.intro,
      avatar: req.body.avatar,
      memberId: [res.locals.user._id], // Use res.locals.user._id from middleware
    });

    res.status(201)
      .header('Location', `/${newCommunity._id}`)
      .json(newCommunity);
  } catch (error) {
    console.error('Failed to create community:', error);
    res.status(500).json({ error: 'Failed to create community' });
  }
});

// Join a community
router.post('/join', async (req, res) => {
  const { communityId, userId } = req.body;

  if (!communityId || !userId) {
    res.status(HTTP_BAD_REQUEST).json({ error: 'communityId or userId is not provided' });
    return;
  }

  try {
    const community = await retrieveCommunity(communityId);
    const user = await User.findById(userId);

    if (!community) {
      res.status(HTTP_BAD_REQUEST).json({ error: `Community with ID: ${communityId} does not exist` });
      return;
    }

    if (!user) {
      res.status(HTTP_BAD_REQUEST).json({ error: `User with ID: ${userId} does not exist` });
      return;
    }

    if (!community.memberId) {
      community.memberId = [];
    }

    if (community.memberId.find(x => x && x.toString() === userId.toString())) {
      res.status(HTTP_BAD_REQUEST).json({ error: `The user: ${userId} is already in the community: ${communityId}` });
      return;
    }

    community.memberId.push(userId);

    await community.save();
    res.status(HTTP_CREATED)
      .header('Location', `/${community._id}`)
      .json(community);
  } catch (error) {
    res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: 'Failed to save community' });
  }
});

// Retrieve all communities ?userId=xxxx
router.get('/', async (req, res) => {
  const userId = req.query.userId;
  try {
    if (userId) {
      res.status(HTTP_OK).json(await retrieveCommunityListByUserId(userId));
    } else {
      res.status(HTTP_OK).json(await retrieveCommunityList());
    }
  } catch (error) {
    res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve communities' });
  }
});

// Retrieve a community by its id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const community = await retrieveCommunity(id);

    if (community) {
      res.status(HTTP_OK).json(community);
    } else {
      res.sendStatus(HTTP_NOT_FOUND);
    }
  } catch (error) {
    res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve community' });
  }
});

// Endpoint to fetch community members by community ID
router.get('/:communityId/members', async (req, res) => {
  const { communityId } = req.params;

  try {
    const community = await Community.findById(communityId).populate('memberId', 'username'); // Assuming 'memberId' is referencing 'User' model

    if (!community) {
      res.status(HTTP_NOT_FOUND).json({ error: `Community with ID ${communityId} not found` });
      return;
    }

    res.status(HTTP_OK).json({ members: community.memberId });
  } catch (error) {
    console.error('Error fetching community members:', error);
    res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch community members' });
  }
});

export default router;