import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { GithubModule } from './github.module';
const commitTests = require('./testing/commits.json');

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
			expect(githubService.parseGithubLink(commitTests.parseGithubLink.input)).toEqual(commitTests.parseGithubLink.output);
		});
	});

	describe('getCommits', () => {
		it('should return a list of commits', async () => {
			let mockCommits = jest.fn().mockResolvedValueOnce(commitTests.getCommits.inputs[0]).mockResolvedValueOnce(commitTests.getCommits.inputs[1]).mockResolvedValueOnce(commitTests.getCommits.inputs[2]);
			//this is for replacing the octonode repo.commitsAsync, it needs this because it gets generated from client.repo
			githubService.client.repo = (a) => {
				return {
					commitsAsync: mockCommits
				};
			};
			
			let result = await githubService.getCommits({ repo: 1 });
			expect(result).toEqual(commitTests.getCommits.output);
			expect(mockCommits).toHaveBeenCalledTimes(3);
		});
	});

	describe('formatCommits', () => {
		it('should take an array of full commits and return a list of formatted commits', () => {
			expect(githubService.formatCommits(commitTests.formatCommits.input)).toEqual(commitTests.formatCommits.output);
		});
	})
});
