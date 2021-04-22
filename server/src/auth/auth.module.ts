import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PassportController } from 'src/passport/passport.controller';
import { PassportService } from 'src/passport/passport.service';

@Module({
    imports: [   
        PassportModule.register({      
            defaultStrategy: 'google',      
            property: 'user',       
            session: false,    
        }),   
    ],  
    controllers: [PassportController],  
    providers: [PassportService, /*GoogleStrategy*/],  
    exports: [PassportModule],
})
export class AuthModule {}


//https://www.codemag.com/Article/2001081/Nest.js-Step-by-Step-Part-3-Users-and-Authentication
//https://docs.nestjs.com/security/authentication#named-strategies