// import { GetUserId } from "./../common/decorators/getUserId.decorator";
// import { Controller } from "@nestjs/common";
// // import { IPackageController } from "./interfaces/IPackageController.interface";
// import { CreatePackageDto } from "./dto/create.dto";
// import { PackageDto } from "./dto/package.dto";
// import { PackageService } from "./package.service";

// @Controller("package")
// export class PackageController {
// 	constructor(private readonly packageService: PackageService) {}

// 	create(packageData: CreatePackageDto): Promise<PackageDto> {}

// 	findAll(@GetUserId() userId: string): Promise<PackageDto[]> {}

// 	findById(@GetUserId() userId: string, id: string): Promise<PackageDto> {}

// 	changeStatus(id: string, status: string): Promise<PackageDto> {}

// 	update(
// 		id: string,
// 		packageData: Partial<CreatePackageDto>,
// 	): Promise<PackageDto> {}

// 	delete(id: string): Promise<PackageDto> {}
// }
