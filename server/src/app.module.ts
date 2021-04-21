import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubModule } from './github/github.module';
import { PassportModule } from './passport/passport.module';

@Module({
	imports: [GithubModule, PassportModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
