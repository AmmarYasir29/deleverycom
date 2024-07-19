const express = require("express");
const authRouter = express.Router();
const auth = require("../middleware/auth");
const controllers = require("../controllers/auth.controllers");

authRouter.post("/signup", controllers.singup);
authRouter.post("/user_login", controllers.signin);
authRouter.get("/user_profile", auth, controllers.userInfo);
authRouter.put("/update_user/:id", auth, controllers.userUpdate);
authRouter.put("/:id/follow", auth, controllers.userFollow);
authRouter.put("/:id/userUnfollow", auth, controllers.userUnfollow);
authRouter.get("/:id/followersList", auth, controllers.ListOfFollowers);
authRouter.get("/:id/followingsList", auth, controllers.ListOfFollowings);

module.exports = authRouter;
