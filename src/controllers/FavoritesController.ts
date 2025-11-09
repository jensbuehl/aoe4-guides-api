import { Controller, Get, Path, Queries, Res, Route, SuccessResponse, Tags } from "tsoa";
import { toOverlayBuild } from "../mappers";
import { BuildOrder, BuildOrders } from "../models";
import { BuildQuery, NotFoundResponse } from "../types";
import db from "../db";


@Route("favorites")
@Tags("Favorites")
export class FavoritesController extends Controller {
    /**
     * Get user's favorite builds
     * @param userId The user's identifier
     */
    @Get("{userId}")
    @SuccessResponse("200", "OK")
    public async getUserFavorites(@Path() userId: string, @Queries() q: BuildQuery, @Res() notFoundResponse: NotFoundResponse): Promise<BuildOrders> {
        const snapshot = db.collection("favorites").doc(userId);
        const user = await snapshot.get();

        if (!user.exists)
            return notFoundResponse(404, { reason: "" });

        const favorites = user.data()?.favorites as string[] | undefined;

        if (!favorites || favorites.length === 0)
            return [];

        let query = db
            .collection("builds")
            .where("id", "in", user.data()?.favorites)
            .limit(10);

        if (q.civ)
            query = query.where("civ", "in", [q.civ]);

        if (q.orderBy)
            query = query.orderBy(q.orderBy, "desc");

        const builds = await query.get();

        if (q.overlay)
            return builds.docs.map((doc) => toOverlayBuild(doc.data() as BuildOrder));

        return builds.docs.map((doc) => doc.data() as BuildOrder);
    }
}