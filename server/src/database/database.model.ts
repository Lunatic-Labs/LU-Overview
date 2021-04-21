import * as mongoose from "mongoose";

export const myMongoose = mongoose;

const UserSchema = new mongoose.Schema({
	email: String,
	firstName: String,
	lastName: String,
	lNumber: Number,
	githubUser: String,
	jibbleUser: String,
	slackUser: String
});

const CommmitSchema = new mongoose.Schema({
	author: Object,
	message: String,
	comment_count: Number,
	date: String,
	_id: String
});
CommmitSchema.virtual("sha") //use the sha as the object id
	.get(function () { return this._id; })
	.set(function (val) { this._id = val; });

const RepoSchema = new mongoose.Schema({
	name: String,
	branches: Object,
	commits: [CommmitSchema]
});

export const UserModel = mongoose.model("User", UserSchema);
//export const CommitModel = mongoose.model("Commit", CommmitSchema);
export const RepoModel = mongoose.model("Repo", RepoSchema);

