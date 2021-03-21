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

	/*
		transform Observable to Promise for consumption in code
	*/
	async getAPI<T>(url: string, errorFunction: ErrorFunction<T>, urlExtensions?: string | Array<string | null> | null ): Promise<T> {
		return await (this.getAPIObservable<T>(url, errorFunction, urlExtensions).toPromise());
	}

	getAPIObservable<T>(url: string, errorFunction: ErrorFunction<T>, urlExtensions?: string | Array<string | null> | null ): Observable<T> {
		url = this.baseUrl + url;
		if (urlExtensions && typeof urlExtensions == "object") { //add in any optional urlExtensions
			urlExtensions.forEach((s) => {
				if (s) {
					url += "/" + s;
				}
			});
		} else if (urlExtensions && typeof urlExtensions == "string") {
			url += "/" + urlExtensions;
		}
		
		let res = this.httpClient.get<T>(url, {responseType: "json"}).pipe( //rxjs stuff
			catchError((error: HttpErrorResponse) => {
				if (error.error instanceof Error) {
				  // A client-side or network error occurred.
				  console.error('An error occurred:', error.error.message);
				} else {
				  // The backend returned an unsuccessful response code.
				  console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
				}

				let errResult = errorFunction(error); // run the error function and use the output as a default value
				return (errResult ? of(errResult) : throwError(error));
			}),
			retry(3) //retry 3 times
		);

		return res;
	}

	/*
		get commits from a repo, limited to 1000, with an optional user filter, and an error function
		the error function can take a HttpErrorResponse and the return value will become the default on an error, if it returns nothing an error will be thrown
	*/
	async getCommits(repo: string, user: string | null = null, errorFunction: ErrorFunction<CommitResponse> = () => {}): Promise<CommitResponse> {
		let res = await this.getAPI<CommitResponse>("github/commits", errorFunction, [repo, user || null]);
		return Promise.resolve(res);
	}
}
