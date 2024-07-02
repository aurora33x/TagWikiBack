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
router.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
     });
export default router;
