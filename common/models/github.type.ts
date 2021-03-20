

export interface CommitFormattedBase { //stripped down commmits
	author: AuthorStripped;
	message: string;
	comment_count: number;
	date: string;
}
export interface AuthorStripped {
	commitName: string | null;
	commmitEmail: string | null;
	authorLogin: string | null;
	authorId: number | null;
}