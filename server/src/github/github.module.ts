import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

@Module({
	controllers: [GithubController],
	providers: [
		GithubService,
		DatabaseService
	]
})
export class GithubModule { }
