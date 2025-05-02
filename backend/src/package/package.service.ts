import { UsersService } from "src/users/users.service";
import { Body, Injectable, NotFoundException } from "@nestjs/common";
import { CreatePackageDto } from "./dto/create.dto";
import { PackageDto } from "./dto/package.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Package } from "src/entities/package.entity";
import { Repository } from "typeorm";
import { GetUserId } from "src/common/decorators/getUserId.decorator";
import { ChangePackageStatusDto } from "./dto/changeStatus.dto";
import { UpdatePackageDto } from "./dto/update.dto";

@Injectable()
export class PackageService {
	constructor(
		@InjectRepository(Package)
		private packageRepository: Repository<Package>,
		private readonly usersService: UsersService,
	) {}

	async create(
		userId: string,
		packageData: CreatePackageDto,
	): Promise<PackageDto> {
		const user = await this.usersService.findById(userId);

		const packageEntity = this.packageRepository.create({
			title: packageData.title,
			description: packageData.description || "",
			owner: user,
			status: "ACTIVE",
			createdAt: new Date(),
		});

		return await this.packageRepository.save(packageEntity);
	}

	async findAll(userId: string): Promise<PackageDto[]> {
		return this.packageRepository.find({ where: { owner: { id: userId } } });
	}

	async findById(userId: string, id: string): Promise<PackageDto> {
		const user = await this.usersService.findById(userId);

		const packageEntity = await this.packageRepository.findOne({
			where: { owner: { id: userId }, id },
		});

		if (!packageEntity) {
			throw new NotFoundException("Package not found");
		}

		return packageEntity as PackageDto;
	}

	async changeStatus(
		userId: string,
		changeStatusDto: ChangePackageStatusDto,
	): Promise<PackageDto> {
		const user = await this.usersService.findById(userId);

		const packageEntity = await this.findById(userId, changeStatusDto.id);

		packageEntity.status = changeStatusDto.status; // i will implemented this types .e. ACTIVE, INACTIVE, ARCHIVED, COMPLETED, PAUSED

		return (await this.packageRepository.save(packageEntity)) as PackageDto;
	}

	async update(
		userId: string,
		packageData: UpdatePackageDto,
	): Promise<PackageDto> {
		const user = await this.usersService.findById(userId);

		const packageEntity = await this.findById(userId, packageData.id);

		packageEntity.title = packageData.title || packageEntity.title;
		packageEntity.description =
			packageData.description || packageEntity.description;
		packageEntity.status = packageData.status || packageEntity.status;
		packageEntity.updatedAt = new Date();

		return await this.packageRepository.save(packageEntity);
	}

	async delete(userId: string, id: string): Promise<PackageDto> {
		const user = this.usersService.findById(userId);

		const packageEntity = this.findById(userId, id);

		await this.packageRepository.delete(id);

		return packageEntity;
	}
}
