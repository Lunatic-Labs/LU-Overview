import { Injectable } from '@nestjs/common';
import { ConnectOptions, Mongoose, Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { RepoModel } from "./database.model";
import { CommitFormatted } from 'src/github/github.type';
import { RepoType } from './database.type';
import { Observable, Subscriber } from 'rxjs';

const mongooseOptions: ConnectOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	autoIndex: true, //set to false in production env for speed up
	useCreateIndex: true,
	serverSelectionTimeoutMS: 5000,
	socketTimeoutMS: 20000, //if getting time outs increase this
	heartbeatFrequencyMS: 2000
};

@Injectable()
export class DatabaseService {
	static initialized = false;
	static readyNext: Subscriber<unknown>;
	static ready;

	constructor() {
		DatabaseService.ready = new Observable((sub) => {DatabaseService.readyNext = sub});
		if (!DatabaseService.initialized) {
			DatabaseService.initialized = true;
			mongoose.connect("mongodb://localhost:27017/dashboard", mongooseOptions).then(
				() => {
					console.log("Connected to database");
					this.initDatabase();
				},
				err => {
					console.error("Database failed to connect");
					throw err;
				}
			);
		}
	}

	async initDatabase(): Promise<void> {
		if ((await RepoModel.countDocuments()) == 0) {
			await RepoModel.create(
				{ name: "spencer012/Game-8" },
				{ name: "d-oliveros/nest" },
				{ name: "Lunatic-Labs/LU-Overview" },
				{ name: "Lunatic-Labs/Operations" },
				{ name: "Lunatic-Labs/Project-Aim" },
				{ name: "instructure/canvas-lms" }
			);
		}
		console.log("Database initalized")
		DatabaseService.readyNext.next();
		DatabaseService.readyNext.complete();
	}

	async createRepo(repo: RepoType) {
		return RepoModel.create(repo);
	}
	async updateRepo(repo: RepoType | any) {
		return RepoModel.updateOne({ name: repo.name }, repo);
	}
	async getRepo(name: string) {
		return (await RepoModel.findOne({ name: name }).exec());
	}
	async getAllRepos() {
		return (await RepoModel.find());
	}
	async repoExists(name: string) {
		return (await RepoModel.exists({ name: name }));
	}

	//gets branches as a object with the branch name corresponding to the most recent sha
	async getBranches(name: string): Promise<{ [key: string]: string }> {
		return (await this.getRepo(name))["branches"];
	}
	//gets commits as an array
	async getCommits(name: string): Promise<Array<CommitFormatted>> {
		return (await this.getRepo(name))["commits"];
	}

	async setBranches(name: string, branches: { [key: string]: string }) {
		return RepoModel.updateOne({ name: name }, { branches: branches });
	}
	async setCommits(name: string, commits: Array<CommitFormatted>) {
		return RepoModel.updateOne({ name: name }, { commits: commits });
	}
}
