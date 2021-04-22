import { HttpErrorResponse } from "@angular/common/http";
import { CommitFormatted } from "../../common/models/github.type";

export interface CommitResponse extends Array<CommitFormatted> {}

export type ErrorFunction<T> = (err?: HttpErrorResponse) => T | void;