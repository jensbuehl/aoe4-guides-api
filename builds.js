/**
 * @swagger
 * components:
 *   schemas:
 *     build:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the build order
 *         title:
 *           type: string
 *           description: The title of the build order
 *         description:
 *           type: string
 *           description: The description of the build order
 *         video:
 *           type: string
 *           description: The youtube url of the build order
 *         author:
 *           type: string
 *           description: The author name
 *         authorUid:
 *           type: string
 *           description: The author's id
 *         season:
 *           type: string
 *           description: The original ranked ladder season the build order was created for
 *         timeCreated:
 *           type: string
 *           description: Timestamp when the build order was created
 *         steps:
 *           type: array
 *           items:
 *             type: object 
 *             $ref: '#/components/schemas/stepSection'
 *     stepSection:
 *       type: object
 *       description: container for the  age dependent sections (e.g. aging up to feudal age)
 *       properties:
 *         type:
 *           type: string
 *           description: age when "in age" or ageUp when "aging up"
 *         age:
 *           type: integer
 *           description: Age indicator. 0 if feature is not used. 1-4 otherwise.
 *         steps:
 *           type: array
 *           items:
 *             type: object 
 *             $ref: '#/components/schemas/step'
 *     step:
 *       type: object
 *       description: container for the actual build steps
 *       properties:
 *         builders:
 *           type: string
 *           description: Number of builders
 *         gold:
 *           type: string
 *           description: Number of villagers assigned to gold
 *         wood:
 *           type: string
 *           description: Number of villagers assigned to wood
 *         stone:
 *           type: string
 *           description: Number of villagers assigned to stone
 *         food:
 *           type: string
 *           description: Number of villagers assigned to food
 *         time:
 *           type: string
 *           description: Textual timestamp
 *         description:
 *           type: string
 *           description: Textual description of the build step including images
 *     status:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Running if the service is available
 *       example:
 *         status: running
 */

import { db } from "./firebase.js";

export async function getById(req, res) {
  const snapshot = await db.collection("builds").doc(req.params.buildId);
  const doc = await snapshot.get();
  if (!doc.exists) {
    res.sendStatus(404);
  } else {
    //convert to overlay format
    if (req.query.overlay) {
      res.send("Conversion not implemented, yet");
    } else {
      res.send(doc.data());
    }
  }
}

export async function getAll(req, res) {
  //Always set a limit to avoid crawling all data and cut firestore read costs
  var query = db.collection("builds").limit(10);
  //filter civilization
  if (req.query.civ) {
    query = query.where("civ", "in", [req.query.civ]);
  }
  //filter author
  if (req.query.author) {
    query = query.where("authorUid", "in", [req.query.author]);
  }
  //orderBy
  if (req.query.orderBy) {
    query = query.orderBy(req.query.orderBy, "desc");
  }
  const snapshot = await query.get();

  //convert to overlay format
  if (req.query.overlay) {
    res.send("Conversion not implemented, yet");
  } else {
    res.send(snapshot.docs.map((doc) => doc.data()));
  }
}

export async function getFavorites(req, res) {
  const snapshot = await db.collection("favorites").doc(req.params.userId);
  const user = await snapshot.get();
  if (!user.exists) {
    res.sendStatus(404);
  } else {
    //Always set a limit to avoid crawling all data and cut firestore read costs
    var query = await db
      .collection("builds")
      .where("id", "in", user.data().favorites)
      .limit(10);
    //filter civilization
    if (req.query.civ) {
      query = query.where("civ", "in", [req.query.civ]);
    }
    //orderBy
    if (req.query.orderBy) {
      query = query.orderBy(req.query.orderBy, "desc");
    }
    const snapshot = query.get();

    //convert to overlay format
    if (req.query.overlay) {
      res.send("Conversion not implemented, yet");
    } else {
      res.send(snapshot.docs.map((doc) => doc.data()));
    }
  }
}

export default {
  getAll,
  getById,
  getFavorites,
};
