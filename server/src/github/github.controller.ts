import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
	constructor(private readonly githubService: GithubService) { }

	@Get("commits/:repo")
	async commitsRepo(@Param() params) { //right now just get raw commits and send it
		return await this.githubService.getCommits({repo: parseInt(params.repo)});
	} //test http://localhost:3000/github/commits/2

	@Get("commits/:repo/:user")
	async commitsRepoUser(@Param() params) { //right now just get raw commits and send it
		return await this.githubService.getCommits({repo: parseInt(params.repo), author: params.user});
	} //test http://localhost:3000/github/commits/2/psypersky
}
