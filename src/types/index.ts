import { TsoaResponse } from "tsoa";

export * from "./civilization";
export * from "./overlay";
export * from "./queries";

export type NotFoundResponse = TsoaResponse<404, { reason: string }>;