import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubModule } from './github/github.module';
import { DatabaseService } from './database/database.service';


@Module({
	imports: [
		GithubModule
	],
	controllers: [AppController],
	providers: [AppService, DatabaseService],
})
export class AppModule { }
