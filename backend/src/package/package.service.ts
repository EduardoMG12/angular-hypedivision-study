// import { Injectable } from "@nestjs/common";
// // import { IPackageService } from "./interfaces/IPackageService.interface";
// import { CreatePackageDto } from "./dto/create.dto";
// import { PackageDto } from "./dto/package.dto";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Package } from "src/entities/package.entity";
// import { Repository } from "typeorm";

// @Injectable()
// export class PackageService {
// 	constructor(
// 		@InjectRepository(Package)
// 		private packageRepository: Repository<Package>,
// 	) {}

// 	create(packageData: CreatePackageDto): Promise<PackageDto> {}

// 	findAll(userId: string): Promise<PackageDto[]> {}

// 	findById(userId: string, id: string): Promise<PackageDto> {}

// 	changeStatus(id: string, status: string): Promise<PackageDto> {}

// 	update(
// 		id: string,
// 		packageData: Partial<CreatePackageDto>,
// 	): Promise<PackageDto> {}

// 	delete(id: string): Promise<PackageDto> {}
// }
