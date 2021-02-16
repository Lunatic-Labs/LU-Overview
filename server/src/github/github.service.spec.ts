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

		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(githubService).toBeDefined();
	});

	describe('parseGithubLink', () => {
		it('should return an object that has the relation as the key with the url and page number', () => {
			expect(githubService.parseGithubLink(commits.parseGithubLink.input)).toEqual(commits.parseGithubLink.output);
		});
	});

	describe('getCommits', () => { //if getCommits ever does anything with the commits, the test data will need to be updated
		it('should return a list of commits', async () => {
			let mockCommits = jest.fn().mockResolvedValueOnce(commits.getCommits.inputs[0]).mockResolvedValueOnce(commits.getCommits.inputs[1]).mockResolvedValueOnce(commits.getCommits.inputs[2]);
			//this is for replacing the octonode repo.commitsAsync, it needs this because it gets generated from client.repo
			githubService.client.repo = (a) => {
				return {
					commitsAsync: mockCommits
				};
			};
			
			let result = await githubService.getCommits({ repo: 1 });
			expect(result).toEqual(commits.getCommits.output);
			expect(mockCommits).toHaveBeenCalledTimes(3);
		});
	});
});
