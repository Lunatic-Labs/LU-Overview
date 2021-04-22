import { PassportController } from './passport/passport.controller';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubModule } from './github/github.module';
import { PassportModule } from './passport/passport.module';
import { passportMiddleware } from './passport/passport.middleware';

@Module({
	imports: [GithubModule, PassportModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
	 consumer
		.apply(passportMiddleware)
		.forRoutes(PassportController);
	}
}
