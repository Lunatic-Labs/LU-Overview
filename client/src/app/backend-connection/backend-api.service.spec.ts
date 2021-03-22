import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BackendApiService } from './backend-api.service';

describe('BackendApiService', () => {
	let service: BackendApiService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule
			]
		});
		service = TestBed.inject(BackendApiService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	//TODO

	describe("getAPI", () => {
		it("should return what is at the url", () => {
			let testStr = "test string";

			service.getAPIObservable<string>("test", () => { return "error" }, ["a", "b", null]).subscribe(res => {
				expect(res).toEqual(testStr);
			});

			const req = httpMock.expectOne(`${service["baseUrl"]}test/a/b`);
			expect(req.request.method).toBe("GET");
			req.flush(testStr);
		});
	});
});
