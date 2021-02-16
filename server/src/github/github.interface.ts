export type CommitConfig = {
	repo: number,
	author?: string,
	since?: Date,
	until?: Date
};

export type GithubLink = { //it can have a key specified that has a url and page
	[K in ("next" | "last" | "first" | "prev")]?: {url: string, page: number}
}