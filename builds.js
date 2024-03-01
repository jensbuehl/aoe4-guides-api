/**
 * @swagger
 * components:
 *   schemas:
 *     build:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of your book
 *         author:
 *           type: string
 *           description: The book author
 *         finished:
 *           type: boolean
 *           description: Whether you have finished reading the book
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 *         finished: false
 *         createdAt: 2020-03-10T04:05:06.157Z
 *     status:
 *       type: object
 *       required:
 *         - status
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
