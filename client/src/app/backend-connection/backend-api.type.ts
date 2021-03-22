import { HttpErrorResponse } from "@angular/common/http";
import { CommitFormatted } from "../../common/models/github.type";

export interface CommitResponse {
	[n: number]: CommitFormatted;
}

export type ErrorFunction<T> = (err?: HttpErrorResponse) => T | void;