import { Injectable, NotFoundException } from '@nestjs/common';
import { CommitFull, CommitConfig, GithubLink, CommitFormatted } from './github.type';
var github = require("octonode");
var githubToken: string | null;

try {
	githubToken = require("../secrets/tokens").githubToken;
} catch (e) {
	githubToken = null
}

@Injectable()
export class GithubService {
	testDatabase = {
		repo: {
			1: "spencer012/Game-8",
			2: "d-oliveros/nest",
			3: "Lunatic-Labs/LU-Overview",
			4: "Lunatic-Labs/Operations",
			5: "Lunatic-Labs/Project-Aim",
			6: "instructure/canvas-lms"
		}
	}

	client: any;

	constructor() {
		this.client = (githubToken ? github.client(githubToken) : github.client());
	}


	/*
		returns all commits from the repo specified by the id, optionally by author
	*/
	async getCommits(config: CommitConfig): Promise<Array<CommitFull>> {
		let commitOptions: { per_page, page, author?} = { per_page: 100, page: 1 };
		if (config.author) {
			commitOptions.author = config.author;
		}

		if (!this.testDatabase.repo[config.repo]) {
			throw new NotFoundException();
		}

		let repo = this.client.repo(this.testDatabase.repo[config.repo]);
		let [commits, headers]: [commits: Array<CommitFull>, headers: any] = await repo.commitsAsync(commitOptions); //get first page

		if (headers.link) { //if it has pagination
			let parsedLink = this.parseGithubLink(headers.link);
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

	/*
		strip down commits to only the information we will need
		takes an array of full commits and returns an array of formatted commits
	*/
	formatCommits(commits: Array<CommitFull>): Array<CommitFormatted> {
		var formatted: Array<CommitFormatted> = [];

		commits.forEach((commit) => {
			formatted.push({
				author: { //shorthand for if(author exists) {return author.name} else if(committer exists) {return committer.name}
					//it is this way because there is a possiblility for the authors and committors to be null
					commitName: (commit.commit.author && commit.commit.author.name) || (commit.commit.committer && commit.commit.committer.name),
					commmitEmail: (commit.commit.author && commit.commit.author.email) || (commit.commit.committer && commit.commit.committer.email),
					authorLogin: (commit.author && commit.author.login) || (commit.committer && commit.committer.login),
					authorId: (commit.author && commit.author.id) || (commit.committer && commit.committer.id)
				},
				message: commit.commit.message,
				comment_count: commit.commit.comment_count,
				date: commit.commit.author.date || commit.commit.committer.date
			})
		});

		return formatted;
	}
}

//https://docs.github.com/en/rest/reference/repos#list-commits
//https://github.com/pksunkara/octonode