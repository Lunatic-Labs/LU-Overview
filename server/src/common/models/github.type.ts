
export interface CommitFormatted {
	author: Author;
	message: string;
	date: string;
	oid: string;
	additions: number;
	deletions: number;
}
export interface Author {
	name: string | null;
	email: string | null;
	login: string | null;
	id: string | null;
}