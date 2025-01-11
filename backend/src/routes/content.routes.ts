import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { transpileModule } from "typescript";

const contentRoute = Router();

// contentRoute.post("/", authMiddleware, async (req, res) => {
//   /**
//    * Need to validate the inputs like type cause it is an enum
//    */
//   const { title, link, type } = req.body;
//   try {
//     const content = await contentModel.create({
//       title,
//       link,
//       type,
//       //@ts-ignore
//       userId: req.userId,
//       tag: [],
//     });

//     console.log("content", content);

//     if (!content) {
//       res.status(403).json({
//         msg: "conetnt is not created",
//         successful: false,
//       });
//     }

//     res.status(200).json({
//       msg: "content creation successful",
//       successful: true,
//       data: content,
//     });
//   } catch (e) {
//     res.status(500).json({
//       msg: "something went wrong, server error",
//       successful: true,
//     });
//   }
// });

// contentRoute.get("/", authMiddleware, async (req, res) => {
//   //@ts-ignore
//   const userId = req.userId;
//   console.log("userId", userId);
//   try {
//     const allContent = await contentModel.find({
//       userId,
//     });

//     console.log("allContent", allContent);

//     if (!allContent) {
//       res.status(404).json({
//         msg: " not found",
//         successful: false,
//       });
//     }

//     res.status(201).json({
//       msg: "fetched all data",
//       data: allContent,
//       successful: transpileModule,
//     });
//   } catch (error) {
//     res.status(500).json({
//       msg: "server error",
//     });
//   }
// });

// contentRoute.delete("/:id", authMiddleware, async (req, res) => {
//   const { id } = req.params;

//   /**
//    * need to implement error checking like :
//    *    - trying to dlt content which do not own
//    */

//   console.log("id", id);

//   try {
//     const isDelete = await contentModel.deleteOne({
//       id,
//       //@ts-ignore
//       userId: req.userId,
//     });

//     console.log("isDelete", isDelete);

//     res.status(200).json({
//       msg: "content deleted",
//       successful: true,
//     });
//   } catch (error) {
//     res.status(500).json({
//       msg: "server error",
//     });
//   }
// });

export default contentRoute;
