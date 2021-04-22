import { Controller, Get } from '@nestjs/common';
import { PassportService } from './passport.service';

const passport = require('passport')

@Controller()
export class PassportController {
    constructor(private readonly passportService: PassportService) { }

    // @Get("auth/google")
    // async authGoogle(){
    //     return await this.passportService.runAuth();
    // } 

    @Get("auth/google")
    async authGoogle(){
        return await passport.authenticate('google', 
        { scope: ['profile', 'email'] });
    } 
    
}
