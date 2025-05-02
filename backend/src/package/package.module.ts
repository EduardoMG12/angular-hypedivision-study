import { Module } from "@nestjs/common";
import { PackageService } from "./package.service";
import { PackageController } from "./package.controller";
import { Package } from "src/entities/package.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";

@Module({
	imports: [TypeOrmModule.forFeature([Package]), UsersModule],
	providers: [PackageService],
	controllers: [PackageController],
	exports: [PackageService],
})
export class PackageModule {}
