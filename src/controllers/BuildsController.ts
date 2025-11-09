import { Controller, Get, Route, SuccessResponse, Tags, Queries, Path, Res, Query } from "tsoa";
import { toOverlayBuild } from "../mappers";
import { BuildOrder, BuildOrders } from "../models";
import { BuildQuery, NotFoundResponse } from "../types";
import db from "../db";

@Route("builds")
@Tags("Builds")
export class BuildController extends Controller {
    /**
     * Get first 10 builds meeting critera in query parameters.
     * Get your builds by providing your user id as parameter.
     * By default, returning the 10 most recent builds.
     * @summary Get all builds
     */
    @Get("/")
    @SuccessResponse("200", "OK")
    public async getBuilds(@Queries() q: BuildQuery): Promise<BuildOrders> {
        let query = db.collection("builds").limit(10);

        if (q.civ)
            query = query.where("civ", "in", [q.civ]);

        if (q.author)
            query = query.where("authorUid", "in", [q.author]);

        if (q.orderBy)
            query = query.orderBy(q.orderBy, "desc");

        const snapshot = await query.get();

        if (q.overlay)
            return snapshot.docs.map((doc) => toOverlayBuild(doc.data() as BuildOrder));

        return snapshot.docs.map((doc) => doc.data() as BuildOrder);
    }

    /**
     * Get build by id or error when specified build order is not found.
     * @summary Get a build by his id
     */
    @Get("/{buildId}")
    @SuccessResponse("200", "OK")
    public async getBuildById(@Path() buildId: string, @Query() overlay: boolean = false, @Res() notFoundResponse: NotFoundResponse): Promise<BuildOrder> {
        const snapshot = db.collection("builds").doc(buildId);
        const doc = await snapshot.get();

        if (!doc.exists)
            return notFoundResponse(404, { reason: "" });

        if (overlay)
            return toOverlayBuild(doc.data() as BuildOrder);

        return doc.data() as BuildOrder;
    }
}