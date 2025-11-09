import { Controller, Get, Route, SuccessResponse, Tags } from "tsoa";

/**
 * Basic root endpoint for the API.
 * 
 * Provides a simple welcome message to confirm
 * that the API is reachable and running.
 */
@Route("/")
@Tags("Root")
export class WelcomeController extends Controller {
    /**
     * Returns a welcome message for the API root.
     * 
     * @summary Root health message
     */
    @Get("/")
    @SuccessResponse("200", "OK")
    public async getWelcome(): Promise<{ message: string }> {
        return { message: "Welcome to aoe4guides-api!" };
    }
}