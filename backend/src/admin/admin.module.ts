import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { UsersModule } from "src/users/users.module";
import { BcryptAdapter } from "src/common/adapter/bcrypt.adapter";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { TermsOfUseModule } from "src/terms-of-use/terms-of-use.module";

@Module({
	imports: [TermsOfUseModule, TypeOrmModule.forFeature([User]), UsersModule],
	controllers: [AdminController],
	providers: [AdminService, JwtService, BcryptAdapter],
	exports: [AdminService],
})
export class AdminModule {}
