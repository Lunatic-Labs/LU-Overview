import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
	constructor(private readonly githubService: GithubService) { }

	@Get("commits/:repo")
	async commitsRepo(@Param() params) { //right now just get raw commits and send it
		return await this.githubService.getCommits({repo: parseInt(params.repo)});
	}

	@Get("commits/:repo/:user")
	async commitsRepoUser(@Param() params) {
		return await this.githubService.getCommits({repo: parseInt(params.repo), author: params.user});
	}
}