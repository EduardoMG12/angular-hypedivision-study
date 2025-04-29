import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TermsOfUseService } from "./terms-of-use.service";
import { TermsOfUseController } from "./terms-of-use.controller";
import { UserTermsAcceptanceService } from "./user-terms-acceptance.service";
import { UserTermsAcceptanceController } from "./user-terms-acceptance.controller";
import { TermsOfUse } from "src/entities/termsOfUse.entity";
import { UserTermsAcceptance } from "src/entities/userTermsAcceptance.entity";
import { UsersModule } from "src/users/users.module";

@Module({
	imports: [
		UsersModule,
		TypeOrmModule.forFeature([TermsOfUse, UserTermsAcceptance]),
	],
	providers: [TermsOfUseService, UserTermsAcceptanceService],
	controllers: [TermsOfUseController, UserTermsAcceptanceController],
	exports: [TermsOfUseService, UserTermsAcceptanceService],
})
export class TermsOfUseModule {}
