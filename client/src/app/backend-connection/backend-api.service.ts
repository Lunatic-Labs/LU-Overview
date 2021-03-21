import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommitResponse, ErrorFunction } from "./backend-api.type";
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class BackendApiService {

	private readonly devUrl = "http://localhost:3000/";
	private readonly prodUrl = "http://34.121.200.23/"; //switch to environment vars

	private baseUrl = "";

	constructor(private httpClient: HttpClient) {
		this.baseUrl = environment.production ? this.prodUrl : this.devUrl;
	}

	async getAPI<T>(url: string, errorFunction: ErrorFunction<T>, urlExtensions?: string | Array<string | null> | null ): Promise<T> {
		return await (this.getAPIObservable<T>(url, errorFunction, urlExtensions).toPromise());
	}

	getAPIObservable<T>(url: string, errorFunction: ErrorFunction<T>, urlExtensions?: string | Array<string | null> | null ): Observable<T> {
		url = this.baseUrl + url;
		if (urlExtensions && typeof urlExtensions == "object") {
			urlExtensions.forEach((s) => {
				if (s) {
					url += "/" + s;
				}
			});
		} else if (urlExtensions && typeof urlExtensions == "string") {
			url += "/" + urlExtensions;
		}
		

		let res = this.httpClient.get<T>(url, {responseType: "json"}).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error.error instanceof Error) {
				  // A client-side or network error occurred.
				  console.error('An error occurred:', error.error.message);
				} else {
				  // The backend returned an unsuccessful response code.
				  console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
				}

				let errResult = errorFunction(error);
				return (errResult ? of(errResult) : throwError(error));
			}),
			retry(3)
		);

		return res;
	}

	async getCommits(repo: string, user: string | null = null, errorFunction: ErrorFunction<CommitResponse> = () => {}): Promise<CommitResponse> {
		let res = await this.getAPI<CommitResponse>("github/commits", errorFunction, [repo, user || null]);
		return Promise.resolve(res);
	}
}
