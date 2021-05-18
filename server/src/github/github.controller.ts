import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
	constructor(private readonly githubService: GithubService) { }

	@Get("commits/:repo")
	async commitsRepo(@Param() params) { //get commits and send it
		//var rawCommits = 
		return await this.githubService.getCommits({repo: parseInt(params.repo)});
	} //test http://localhost:3000/github/commits/2

	@Get("commits/:repo/:user") //do we need this?
	async commitsRepoUser(@Param() params) { //get commits and send it filtered to a certain user
		//var rawCommits = await this.githubService.getCommits({repo: parseInt(params.repo), author: params.user});
		return; //this.githubService.formatCommits(rawCommits);
	} //test http://localhost:3000/github/commits/2/psypersky
}
