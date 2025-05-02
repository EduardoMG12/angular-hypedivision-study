import { ChangePackageStatusDto } from "./dto/changeStatus.dto";
import { GetUserId } from "./../common/decorators/getUserId.decorator";
import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common";
// import { IPackageController } from "./interfaces/IPackageController.interface";
import { CreatePackageDto } from "./dto/create.dto";
import { PackageDto } from "./dto/package.dto";
import { PackageService } from "./package.service";
import { toPlainToInstance } from "src/common/utils/toPlainToInstance";
import { UpdatePackageDto } from "./dto/update.dto";

@Controller("package")
export class PackageController {
	constructor(private readonly packageService: PackageService) {}

	@Post("create")
	async create(
		@GetUserId() userId: string,
		@Body()
		packageData: CreatePackageDto,
	): Promise<PackageDto> {
		return toPlainToInstance(
			PackageDto,
			await this.packageService.create(userId, packageData),
		);
	}

	@Get("findAll")
	async findAll(@GetUserId() userId: string): Promise<PackageDto[]> {
		return toPlainToInstance(
			PackageDto,
			await this.packageService.findAll(userId),
		);
	}

	@Post("findById")
	async findById(
		@GetUserId() userId: string,
		@Body() packageData: { id: string },
	): Promise<PackageDto> {
		return toPlainToInstance(
			PackageDto,
			await this.packageService.findById(userId, packageData.id),
		);
	}

	@Post("changeStatus")
	async changeStatus(
		@GetUserId() userId: string,
		@Body() changeStatusDto: ChangePackageStatusDto,
	): Promise<PackageDto> {
		return toPlainToInstance(
			PackageDto,
			await this.packageService.changeStatus(userId, changeStatusDto),
		);
	}

	@Put("update")
	async update(
		@GetUserId() userId: string,
		@Body()
		packageData: UpdatePackageDto,
	): Promise<PackageDto> {
		return toPlainToInstance(
			PackageDto,
			await this.packageService.update(userId, packageData),
		);
	}

	@Delete("")
	async delete(
		@GetUserId() userId: string,
		@Body() deleteDto: { id: string },
	): Promise<PackageDto> {
		return toPlainToInstance(
			PackageDto,
			await this.packageService.delete(userId, deleteDto.id),
		);
	}
}
