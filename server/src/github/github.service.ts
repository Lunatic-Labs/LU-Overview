import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CommitFull, CommitConfig, GithubLink, CommitFormatted, CommitsFull, NodesEntity } from './github.type';
import { graphql } from "@octokit/graphql";
import { RepoType } from 'src/database/database.type';
import { LeanDocument, Document } from 'mongoose';

var github = require("octonode");
var githubToken: string | null;

try {
	githubToken = require("../secrets/tokens").githubToken;
} catch (e) {
	githubToken = null
	console.error("Github token was not supplied, reverting to public api");
}

@Injectable()
export class GithubService {
	static initialized = false;

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

	constructor(private readonly database: DatabaseService) {
		this.client = (githubToken ? graphql.defaults({ headers: { authorization: "token " + githubToken } }) : graphql);

		if (!GithubService.initialized) {
			GithubService.initialized = true;
			DatabaseService.ready.subscribe({
				next: (n) => {
					this.initializeRepos();
				}
			});
		}
	}

	async initializeRepos() {
		let repos = await this.database.getAllRepos();

		repos.forEach(async repo => {
			let repoObj = repo.toObject() as RepoType;
			//console.log(repoObj);
			if (!repoObj.commits || Object.keys(repoObj.commits).length == 0) {
				console.log(`Initalizing repo ${repoObj.name}`);
				this.initializeRepo(repoObj.name);
			} else {
				this.updateRepo(repoObj.name);
			}
		});
	}

	async initializeRepo(name: string) {
		let nameSplit = name.split("/");
		let rawBranches = await this.client(`
				query($owner:String!, $name:String!, $branchCursor: String!) {
					repository(owner: $owner, name: $name) {
						refs(first: 20, refPrefix: "refs/heads/", after: $branchCursor) {
							edges {
								node {
									name
								}
							}
						}
					}
				}
			`,
			{
				owner: nameSplit[0],
				name: nameSplit[1],
				branchCursor: ""
			}
		);

		let branches: Array<string> = [];
		let main = null;
		rawBranches.repository.refs.edges.forEach(e => {
			let b = e.node.name;
			if ((b == "main" || b == "master") && main == null) {
				main = b;
			}
			else {
				branches.push(b);
			}
		});

		if (main == null) {
			throw `Cannot tell what main branch is for ${name}, branches seen: ${branches}`;
		}

		let query = this.constructInitalQuery(main, 100, branches, 100);

		let commitsRaw: CommitsFull;
		try {
			commitsRaw = await this.client(
				query,
				{
					owner: nameSplit[0],
					name: nameSplit[1]
				}
			);
		} catch (e) {
			console.log(`Could not get repo ${name}, aborting`);
			return;
		}

		let commits: { [value: string]: CommitFormatted } = {};
		let afterMain: string = ""; //this and the rest of the afters are for pagination, which has not been implemented yet
		let branchLatest: { [value: string]: string } = {};

		commitsRaw.repository[main].target.history.nodes.forEach(commit => {
			branchLatest[main] = branchLatest[main] || commit.oid;
			commits[commit.oid] = this.formatCommit(commit);
		});

		delete commitsRaw.repository[main];

		let branchesRaw = Object.values(commitsRaw.repository);
		for (let i = 0; i < branchesRaw.length; i++) {
			let commitNodes = branchesRaw[i].target.history.nodes;
			if (!commitNodes) {
				branchLatest[branches[i]] = "";
				continue;
			}

			for (let j = 0; j < commitNodes.length; j++) {
				if (j == 0) {
					branchLatest[branches[i]] = commitNodes[j].oid;
				}
				if (commits[commitNodes[j].oid]) {
					break;
				}
				commits[commitNodes[j].oid] = this.formatCommit(commitNodes[j]);
			}
		}

		this.database.updateRepo({ name: name, commits: commits, branches: branchLatest })
	}

	async updateRepo(name: string) {
		let nameSplit = name.split("/");
		let rawBranches = await this.client(`
				query($owner:String!, $name:String!, $branchCursor: String!) {
					repository(owner: $owner, name: $name) {
						refs(first: 20, refPrefix: "refs/heads/", after: $branchCursor) {
							edges {
								node {
									name
								}
							}
						}
					}
				}
			`,
			{
				owner: nameSplit[0],
				name: nameSplit[1],
				branchCursor: ""
			}
		);

		let branches: Array<string> = [];
		rawBranches.repository.refs.edges.forEach(e => {
			let b = e.node.name;
			branches.push(b);
		});

		let savedBranches = await this.database.getBranches(name);
		let keys = Object.keys(savedBranches); //TODO: implement smart branch updating
		if (keys.length != branches.length || keys.filter(x => branches.includes(x)).length != branches.length) {
			this.initializeRepo(name);
			return;
		}

		let latestCommitsRaw = await this.client(this.constructUpdateQuery(branches, 1), {owner: nameSplit[0], name: nameSplit[1]}) as CommitsFull; //shortcut, only has oid
		let differentOid = [];

		let branchesRaw = Object.values(latestCommitsRaw.repository);
		for (let i = 0; i < branchesRaw.length; i++) {
			let commitNodes = branchesRaw[i].target.history.nodes;
			if (!commitNodes) {
				if (savedBranches[branches[i]] != "") {
					differentOid.push(branches[i]);
				}
				continue;
			}
			if (commitNodes[0].oid != savedBranches[branches[i]]) {
				differentOid.push(branches[i]);
			}
		}

		if (differentOid.length > 0) { //TODO: implement smart commit updating
			this.initializeRepo(name);
			return;
		}
	}

	constructInitalQuery(main: string, mainNum: number, branches: Array<string>, branchNum: number): string {
		let query =
			`query ($owner: String!, $name: String!) {
				repository(owner: $owner, name: $name) {
					${main}: ref(qualifiedName: "${main}") {
						target {
							... on Commit {
								history(first: 100) {
									...CommitFragment
								}
							}
						}
					}
			`;
		branches.forEach((b, i) => {
			query += `
			b${i}: ref(qualifiedName: "${b}") {
				target {
					... on Commit {
						history(first: ${branchNum}) {
							...CommitFragment
						}
					}
				}
			}`;
		});
		query += `	
			}
		}
		fragment CommitFragment on CommitHistoryConnection {
			totalCount
			nodes {
				oid
				message
				committedDate
				author {
					name
					email
					user {
						id
						login
					}
				}
				additions
				deletions
			}
			pageInfo {
				hasNextPage
				endCursor
			}
		}`;
		return query;
	}
	constructNextQuery(main: string, afterMain: string, branches: Array<string>, branchNum: number, afters: Array<string>): string {
		let query =
			`query ($owner: String!, $name: String!) {
				repository(owner: $owner, name: $name) {
					${main}: ref(qualifiedName: "${main}") {
						target {
							... on Commit {
								history(first: 100, after: ${afterMain}) {
									...CommitFragment
								}
							}
						}
					}
			`;
		branches.forEach((b, i) => {
			query += `
			b${i}: ref(qualifiedName: "${b}") {
				target {
					... on Commit {
						history(first: ${branchNum}, after: ${afters[i]}) {
							...CommitFragment
						}
					}
				}
			}`;
		});
		query += `	
			}
		}
		fragment CommitFragment on CommitHistoryConnection {
			totalCount
			nodes {
				oid
				message
				committedDate
				author {
					name
					email
					user {
						id
						login
					}
				}
				additions
				deletions
			pageInfo {
				hasNextPage
				endCursor
			}
		}`;
		return query;
	}
	constructUpdateQuery(branches: Array<string>, number: number, full: boolean = false): string {
		let query =
			`query ($owner: String!, $name: String!) {
				repository(owner: $owner, name: $name) {
			`;
		branches.forEach((b, i) => {
			query += `
			b${i}: ref(qualifiedName: "${b}") {
				target {
					... on Commit {
						history(first: ${number}) {
							...CommitFragment
						}
					}
				}
			}`;
		});
		if (!full) {
			query += `	
				}
			}
			fragment CommitFragment on CommitHistoryConnection {
				totalCount
				nodes {
					oid
				}
			}`;
		} else {
			query += `	
				}
			}
			fragment CommitFragment on CommitHistoryConnection {
				totalCount
				nodes {
					oid
					message
					committedDate
					author {
						name
						email
						user {
							id
							login
						}
					}
					additions
					deletions
				pageInfo {
					hasNextPage
					endCursor
				}
			}`
		}
		return query;
	}

	formatCommit(commit: NodesEntity): CommitFormatted {
		return {
			author: {
				name: commit.author?.name,
				email: commit.author?.email,
				login: commit.author.user?.login,
				id: commit.author.user?.id
			},
			message: commit.message,
			date: commit.committedDate,
			oid: commit.oid,
			additions: commit.additions,
			deletions: commit.deletions,
		};
	}

	/*
		returns all commits from the repo specified by the id, optionally by author
	*/
	async getCommits(config: CommitConfig): Promise<Array<CommitFormatted>> {
		let repos = await this.database.getAllRepos();
		console.log("---------------------------------------")
		repos.forEach((v, i) => {
			console.log(i + ": " + (v.toObject() as RepoType).name);
		})
		return Object.values((repos[config.repo].toObject() as RepoType).commits);
	}

	/*
		parses the link header of github api requests
		returns an object that has the relation as the key with the url and page number, specifics are in github.interface.ts
		https://docs.github.com/en/rest/guides/traversing-with-pagination#basics-of-pagination
	*/
	/*parseGithubLink(links: string): GithubLink {
		let linksParsed = {};
		let res: RegExpExecArray;
		let regex = /<(?<link>.*?&page=(?<page>\d*).*?)>.*?rel="(?<rel>.*?)"/ig; //https://regex101.com/r/VOY8zh/2

		while ((res = regex.exec(links)) != null) { //go through the entire string
			linksParsed[res.groups.rel] = { url: res.groups.link, page: parseInt(res.groups.page) };
		}

		return linksParsed;
	}*/

	/*
		strip down commits to only the information we will need
		takes an array of full commits and returns an array of formatted commits
	*/
	/*formatCommits(commits: Array<CommitFull>): Array<CommitFormatted> {
		var formatted: Array<CommitFormatted> = [];

		commits.forEach((commit) => {
			formatted.push({
				author: { //shorthand for if(author exists) {return author.name} else if(committer exists) {return committer.name}
					//it is this way because there is a possiblility for the authors and committors to be null
					authorName: (commit.commit.author && commit.commit.author.name) || (commit.commit.committer && commit.commit.committer.name),
					authorEmail: (commit.commit.author && commit.commit.author.email) || (commit.commit.committer && commit.commit.committer.email),
					authorLogin: (commit.author && commit.author.login) || (commit.committer && commit.committer.login),
					authorId: (commit.author && commit.author.id) || (commit.committer && commit.committer.id)
				},
				message: commit.commit.message,
				comment_count: commit.commit.comment_count,
				date: commit.commit.author.date || commit.commit.committer.date,
				sha: commit.sha
			})
		});

		return formatted;
	}*/
}

//https://docs.github.com/en/rest/reference/repos#list-commits
//https://github.com/pksunkara/octonode