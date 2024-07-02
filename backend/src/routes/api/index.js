import express from "express";
import auth from "./auth";
import comments from "./comment";
import communityRoutes from "./communityRoutes";
import images from "./images";
import userSetting from "./userSetting";
import votes from "./vote";

const router = express.Router();


router.use("/auth", auth);
router.use("/comment", comments);


router.use("/community", communityRoutes);

router.use("/images", images);

router.use("/vote", votes);
router.use("/userSetting", userSetting);

export default router;
