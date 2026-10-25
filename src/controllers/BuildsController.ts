import { Controller, Get, Route, SuccessResponse, Tags, Queries, Path, Res, Query } from "tsoa";
import { toOverlayBuildOrder } from "../mappers";
import { BuildOrder, BuildOrders } from "../models";
import { BuildQuery, NotFoundResponse, OverlayBuildOrder, OverlayBuildOrderOrders } from "../types";
import db from "../db";

@Route("builds")
@Tags("Builds")
export class BuildController extends Controller {
    /**
     * Get the first 10 builds meeting the criteria in the query parameters.
     * Only published builds are listed; drafts never are.
     * Get your builds by providing your user id as the author parameter.
     * Results are capped at 10 and there is no pagination.
     * By default, returns the 10 most recent builds.
     * @summary Get all builds
     */
    @Get("/")
    @SuccessResponse("200", "OK")
    public async getBuilds(@Queries() q: BuildQuery): Promise<BuildOrders | OverlayBuildOrderOrders> {
        // Published builds only, as on the site. Without this a quarter to a half
        // of any list were unpublished drafts, which the site never shows and an
        // author has not released, and aoe4guides.com now renders these lists
        // itself when the browser cannot read Firestore (Googlebot, blocked
        // reCAPTCHA).
        let query = db.collection("builds").where("isDraft", "==", false).limit(10);

        // Equality, not a one-element "in": every list query then has the shape the
        // site itself runs (isDraft + one field + a sort), which Firestore serves by
        // merging the two-field indexes in the site repo's firestore.indexes.json. There are no
        // three-field composites to fall back on.
        if (q.civ)
            query = query.where("civ", "==", q.civ);

        if (q.author)
            query = query.where("authorUid", "==", q.author);

        if (q.orderBy)
            query = query.orderBy(q.orderBy, "desc");

        const snapshot = await query.get();

        if (q.overlay)
            return snapshot.docs.map((doc) => toOverlayBuildOrder(doc.data() as BuildOrder));

        return snapshot.docs.map((doc) => doc.data() as BuildOrder);
    }

    /**
     * Get build by id or error when specified build order is not found.
     * @summary Get a build by his id
     */
    @Get("/{buildId}")
    @SuccessResponse("200", "OK")
    public async getBuildById(@Path() buildId: string, @Query() overlay: boolean = false, @Res() notFoundResponse: NotFoundResponse): Promise<BuildOrder | OverlayBuildOrder> {
        const snapshot = db.collection("builds").doc(buildId);
        const doc = await snapshot.get();

        if (!doc.exists)
            return notFoundResponse(404, { reason: "" });

        if (overlay)
            return toOverlayBuildOrder(doc.data() as BuildOrder);

        return doc.data() as BuildOrder;
    }
}