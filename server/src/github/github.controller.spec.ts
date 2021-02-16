import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { GithubModule } from './github.module';

describe('GithubController', () => {
	let controller: GithubController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [GithubModule],
			controllers: [GithubController],
			providers: [GithubService]
		}).compile();

		controller = module.get<GithubController>(GithubController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
