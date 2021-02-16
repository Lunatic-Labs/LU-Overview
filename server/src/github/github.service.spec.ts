import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { GithubModule } from './github.module';
const commits = require('./testing/commits.json');

describe('GithubService', () => {
	let githubService: GithubService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [GithubModule],
			controllers: [GithubController],
			providers: [GithubService]
		}).compile();

		githubService = module.get<GithubService>(GithubService);
	});

	it('should be defined', () => {
		expect(githubService).toBeDefined();
	});

	describe('parseGithubLink', () => {
		it('should return an object that has the relation as the key with the url and page number', () => {
			expect(githubService.parseGithubLink(commits.parseGithubLink[0])).toEqual(commits.parseGithubLink[1]);
		});
	});
});
