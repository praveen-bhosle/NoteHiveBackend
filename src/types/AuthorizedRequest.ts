import { Role } from "@prisma/client";
import { AuthenticatedRequest } from "./AuthenticatedRequest";
export type AuthorizedRequest  = AuthenticatedRequest & { user : { role : Role }} ;  