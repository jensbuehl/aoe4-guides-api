import { Controller, Get, Route, SuccessResponse, Tags } from "tsoa";
import { Status } from "../models";

@Route("status")
@Tags("Health")
export class StatusController extends Controller {
    /**
     * Check API status
     * @summary Health check endpoint
     */
    @Get("/")
    @SuccessResponse("200", "OK")
    public async getHealth(): Promise<Status> {
        return { status: "running" };
    }
}