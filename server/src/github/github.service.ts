import { Injectable } from '@nestjs/common';
import { CommitConfig, GithubLink } from './github.interface';
var github = require("octonode");

@Injectable()
export class GithubService {
	testDatabase = {
		repo: {
			1: "spencer012/Game-8",
			2: "d-oliveros/nest"
		}
	}

	client = github.client();

	/*
		returns all commits from the repo specified by the id, optionally by author
	*/
	async getCommits(config: CommitConfig): Promise<Array<object>> {
		let commitOptions: {per_page, page, author?} = { per_page: 100, page: 1 };
		if (config.author) { 
			commitOptions.author = config.author;
		}
		
		let repo = this.client.repo(this.testDatabase.repo[config.repo]);
		let responseData = await repo.commitsAsync(commitOptions); //get first page
		//console.log(responseData);
		let commits: Array<any> = responseData[0];

		if (responseData[1].link) { //if it has pagination
			let parsedLink = this.parseGithubLink(responseData[1].link);
			for (let page = 2; page <= Math.min(parsedLink.last.page, 10); page++) {
				commitOptions.page = page;
				commits = commits.concat((await repo.commitsAsync(commitOptions))[0]); //join all commits together
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
			linksParsed[res.groups.rel] = { url: res.groups.link, page: parseInt(res.groups.page) };
		}
		
		return linksParsed;
	}
}

//https://docs.github.com/en/rest/reference/repos#list-commits
//https://github.com/pksunkara/octonode