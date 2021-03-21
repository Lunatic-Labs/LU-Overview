export { CommitFormatted } from "../common/models/github.type";

export type CommitConfig = {
	repo: number,
	author?: string,
	since?: Date,
	until?: Date
};

export type GithubLink = {
	[K in ("next" | "last" | "first" | "prev")]?: {url: string, page: number}
}

/*
	full commits interface
	was generated from https://jvilk.com/MakeTypes/
*/
export interface CommitFull { 
	sha: string;
	node_id: string;
	commit: Commit;
	url: string;
	html_url: string;
	comments_url: string;
	author?: AuthorOrCommitterFull | null;
	committer?: AuthorOrCommitterFull | null;
	parents?: (ParentsEntity | null)[] | null;
}
export interface Commit {
	author?: AuthorOrCommitter;
	committer?: AuthorOrCommitter;
	message: string;
	tree: Tree;
	url: string;
	comment_count: number;
	verification: Verification;
}
export interface AuthorOrCommitter {
	name: string;
	email: string;
	date: string;
}
export interface Tree {
	sha: string;
	url: string;
}
export interface Verification {
	verified: boolean;
	reason: string;
	signature?: null;
	payload?: null;
}
export interface AuthorOrCommitterFull {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id?: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	site_admin: boolean;
}
export interface ParentsEntity {
	sha: string;
	url: string;
	html_url: string;
}
// end of generated