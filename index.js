import express from 'express';
import swagger from './swagger.js';
import {getAll, getById, getFavorites} from './builds.js';

const app = express();
app.use(express.json());

/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to aoe4guides!
 *     responses:
 *       200:
 *         description: Returns just a string.
 */
app.get("/", (req, res) => {
  res.send(`Welcome to aoe4guides-api!`);
});

/**
 * @openapi
 * /status:
 *   get:
 *     description: Allows checking the status of the service
 *     responses:
 *       200:
 *         description: Returns "Running" when the service is available.
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/status'
 */
app.get("/status", (req, res) => {
  const status = {
    status: "running",
  };
  res.send(status);
});

/**
 * @openapi
 * /builds:
 *   get:
 *     description: Get first 10 builds meeting critera in query parameters.
 *                  Get your builds by providing your user id as parameter.
 *                  By default, returning the 10 most recent builds.
 *     parameters:
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: The author's user id
 *       - in: query
 *         name: civ
 *         schema:
 *           type: string
 *         description: 3 digit civ identifier to filter per civ (ABB, AYY, BYZ, CHI, DEL, ENG, FRE, HRE, JAP, JDA, MAL, MON, DRA, OTT, RUS, ZXL)
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: The desired order (You may sort by score, timeCreated, views, likes)
 *       - in: query
 *         name: overlay
 *         schema:
 *           type: boolean
 *         description: Set to true when you want the overlay tool JSON
 *     responses:
 *       200:
 *         description: Returns build order(s).
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/build'
 */
app.get('/builds', (req, res) => getAll(req, res))

/**
 * @openapi
 * /builds/{buildId}:
 *   get:
 *     description: Get build by id or error when specified build order is not found.
 *     parameters:
 *       - in: path
 *         name: buildId
 *         schema:
 *           type: string
 *         description: The build order id
 *       - in: query
 *         name: overlay
 *         schema:
 *           type: boolean
 *         description: Set to true when you want the overlay tool JSON
 *     responses:
 *       200:
 *         description: Returns build order(s).
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/build'
 */
app.get('/builds/:buildId', (req, res) => getById(req, res))

/**
 * @openapi
 * /favorites/{userId}:
 *   get:
 *     description: Get your first 10 favorites liked by the referred user and meeting filter and sort crietria. 
 *                  By default, returning the 10 most recent builds.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         description: The author's user id
 *       - in: query
 *         name: civ
 *         schema:
 *           type: string
 *         description: 3 digit civ identifier to filter per civ (ABB, AYY, BYZ, CHI, DEL, ENG, FRE, HRE, JAP, JDA, MAL, MON, DRA, OTT, RUS, ZXL)
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: The desired order (You may sort by score, timeCreated, views, likes)
 *       - in: query
 *         name: overlay
 *         schema:
 *           type: boolean
 *         description: Set to true when you want the overlay tool JSON
 *     responses:
 *       200:
 *         description: Returns build order(s).
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/build'
 */
app.get('/favorites/:userId', (req, res) => getFavorites(req, res))

swagger(app);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening on port", port);
});
