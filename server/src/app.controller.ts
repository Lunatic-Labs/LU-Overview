import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHelp(): string {
		return `Go to the <a href="https://github.com/Lunatic-Labs/LU-Overview#server">documentation</a> for help`;
	}
}
