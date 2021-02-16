import { Module, HttpModule } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

@Module({
	imports: [
		HttpModule.register({
			timeout: 5000,
			baseURL: "https://api.github.com/",
			headers: {Accept: "application/vnd.github.v3+json"}
		})],
	controllers: [GithubController],
	providers: [GithubService]
})
export class GithubModule { }
