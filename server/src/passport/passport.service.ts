import { Injectable } from '@nestjs/common';

const passport = require('passport');

@Injectable()
export class PassportService {


    async runAuth(){
        console.log("hello");
        passport.authenticate('google', 
            { scope: ['profile', 'email'] });
        console.log("hello2");
    }
}
