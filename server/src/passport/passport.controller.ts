import { Controller, Get } from '@nestjs/common';

const passport = require('passport')

@Controller()
export class PassportController {

    @Get("auth/google")
    async authGoogle(){
        return passport.authenticate('google', 
            { scope: ['profile', 'email'] });
    }
}
