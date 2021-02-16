import { Injectable, HttpService } from '@nestjs/common';
import { CommitConfig, GithubLink } from './github.interface';
var github = require("octonode");

@Injectable()
export class GithubService {
	constructor(private readonly httpService: HttpService) { }

	testDatabase = {
		repo: {
			1: "spencer012/Game-8",
			2: "d-oliveros/nest"
		}
	}

	client = github.client();

	/*
		returns all commits from the repo specified by the id
	*/
	async getCommits(config: CommitConfig): Promise<Array<object>> { 
		let repo = this.client.repo(this.testDatabase.repo[config.repo]);
		let responseData = await repo.commitsAsync({ per_page: 100 }); //gets first page
		let commits:Array<object> = responseData[0];

		if (responseData[1].link) { //if it has pagination
			let parsedLink = this.parseGithubLink(responseData[1].link);
			for (let page = 2; page <= Math.min(parsedLink.last.page, 10); page++) {
				commits = commits.concat((await repo.commitsAsync({ per_page: 100, page: page}))[0]); //join all commits together
			}
		}

		return commits;
	}

	/*
		parses the link header of github api requests
		returns an object that has the relation as the key with the url and page number, specifics are in github.interface.ts
		https://docs.github.com/en/rest/guides/traversing-with-pagination#basics-of-pagination
	*/
	parseGithubLink(links: string): GithubLink {
		let linksParsed = {};
		let res: RegExpExecArray;
		let regex = /<(?<link>.*?&page=(?<page>\d*).*?)>.*?rel="(?<rel>.*?)"/ig; //https://regex101.com/r/VOY8zh/2

		while ((res = regex.exec(links)) != null) { //go through the entire string
			linksParsed[res.groups.rel] = {url: res.groups.link, page: parseInt(res.groups.page)};
		}
		
		return linksParsed;
	}
}

//https://docs.github.com/en/rest/reference/repos#list-commits
//https://github.com/pksunkara/octonode