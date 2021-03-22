
export interface CommitFormatted {
	author: Author;
	message: string;
	comment_count: number;
	date: string;
}
export interface Author {
	commitName: string | null;
	commmitEmail: string | null;
	authorLogin: string | null;
	authorId: number | null;
}