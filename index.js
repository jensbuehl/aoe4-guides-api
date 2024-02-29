const express = require("express");
const swagger = require("./swagger");
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
 *     responses:
 *       200:
 *         description: Returns build order(s).
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/build'
 */
app.get('/builds', (req, res) => {})

/**
 * @openapi
 * /builds/{buildId}:
 *   get:
 *     description: Get build by id or error when specified build order is not found.
 *     responses:
 *       200:
 *         description: Returns build order(s).
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/build'
 */
app.get('/builds/:buildId', (req, res) => {})

/**
 * @openapi
 * /favorites/{userId}:
 *   get:
 *     description: Get your first 10 favorites liked by the referred user and meeting filter and sort crietria. 
 *                  By default, returning the 10 most recent builds.
 *     responses:
 *       200:
 *         description: Returns build order(s).
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/build'
 */
app.get('/favorites/:userId', (req, res) => {})

swagger(app);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening on port", port);
});
