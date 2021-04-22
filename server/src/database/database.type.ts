import { CommitFormatted } from "src/github/github.type";

export interface RepoType {
	name: string,
	branches: object | null,
	commits: { [value: string]: CommitFormatted },
	_id: number
}