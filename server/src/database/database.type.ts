import { CommitFormatted } from "src/github/github.type";

export interface RepoType {
	name: string,
	branches: object | null,
	commits: [CommitFormatted]
}