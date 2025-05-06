import { ChangePackageStatusDto } from "./dto/changeStatus.dto";
import { GetUserId } from "./../common/decorators/getUserId.decorator";
import {
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Put,
	Param,
} from "@nestjs/common";
import { CreatePackageDto } from "./dto/create.dto";
import { PackageDto } from "./dto/package.dto";
import { PackageService } from "./package.service";
import { toPlainToInstance } from "src/common/utils/toPlainToInstance";
import { UpdatePackageDto } from "./dto/update.dto";
import {
	ApiTags,
	ApiOperation,
	ApiBody,
	ApiResponse,
	ApiBearerAuth,
	ApiParam,
	ApiExtraModels,
} from "@nestjs/swagger";
import { PackageWithFlashcardsDto } from "./dto/packageWithFlashcards";

@ApiTags("Package")
@ApiBearerAuth()
@Controller("package")
export class PackageController {
	constructor(private readonly packageService: PackageService) {}

	@Post("create")
	@ApiOperation({
		summary: "Create a new Package",
		description:
			"Creates a new Package associated with the authenticated user.",
	})
	@ApiBody({
		type: CreatePackageDto,
		description: "Data for creating the Package",
	})
	@ApiResponse({
		status: 201,
		description: "Package created successfully",
		type: PackageDto,
	})
	@ApiResponse({ status: 400, description: "Bad Request (validation errors)" })
	@ApiResponse({
		status: 401,
		description: "Unauthorized (Missing or invalid JWT)",
	})
	async create(
		@GetUserId() userId: string,
		@Body() packageData: CreatePackageDto,
	): Promise<PackageDto> {
		return toPlainToInstance(
			PackageDto,
			await this.packageService.create(userId, packageData),
		);
	}

	@Get("findAll")
	@ApiOperation({
		summary: "List all Packages for the authenticated user",
		description:
			"Returns a list of all Packages belonging to the authenticated user.",
	})
	@ApiResponse({
		status: 200,
		description: "List of Packages returned successfully (can be empty)",
		type: [PackageDto],
	})
	@ApiResponse({ status: 401, description: "Unauthorized" })
	async findAll(@GetUserId() userId: string): Promise<PackageDto[]> {
		return toPlainToInstance(
			PackageDto,
			await this.packageService.findAll(userId),
		);
	}

	@Post("findById")
	@ApiOperation({
		summary: "Find a specific Package by ID for the authenticated user",
		description:
			"Returns a specific Package belonging to the authenticated user, given its ID.",
	})
	@ApiBody({
		type: Object,
		description: "ID of the Package to find",
		examples: {
			"application/json": {
				value: { id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0" },
				summary: "Example body for finding by ID",
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: "Package found successfully",
		type: PackageDto,
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({ status: 404, description: "Package not found for this user" })
	async findById(
		@GetUserId() userId: string,
		@Body() packageData: { id: string },
	): Promise<PackageDto> {
		return toPlainToInstance(
			PackageDto,
			await this.packageService.findById(userId, packageData.id),
		);
	}

	@Post("findByIdWithFlashcards")
	@ApiOperation({
		summary: "Find a specific Package by ID for the authenticated user",
		description:
			"Returns a specific Package belonging to the authenticated user, given its ID.",
	})
	@ApiBody({
		type: Object,
		description: "ID of the Package to find",
		examples: {
			"application/json": {
				value: { id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0" },
				summary: "Example body for finding by ID",
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: "Package found successfully",
		type: PackageDto,
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({ status: 404, description: "Package not found for this user" })
	async findByIdWithFlashcards(
		@GetUserId() userId: string,
		@Body() packageData: { id: string },
	): Promise<PackageWithFlashcardsDto> {
		return toPlainToInstance(
			PackageWithFlashcardsDto,
			await this.packageService.findByIdWithFlashcards(userId, packageData.id),
		);
	}

	@Post("changeStatus")
	@ApiOperation({
		summary: "Change the status of a Package",
		description:
			"Changes the status of a specific Package belonging to the authenticated user.",
	})
	@ApiBody({
		type: ChangePackageStatusDto,
		description: "Package ID and the new Status",
	})
	@ApiResponse({
		status: 200,
		description: "Package status changed successfully",
		type: PackageDto,
	})
	@ApiResponse({
		status: 400,
		description: "Bad Request (validation or invalid transition)",
	})
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({ status: 404, description: "Package not found for this user" })
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
	@ApiOperation({
		summary: "Update an existing Package",
		description:
			"Updates the data of a specific Package belonging to the authenticated user.",
	})
	@ApiBody({
		type: UpdatePackageDto,
		description: "Data for updating the Package (includes ID)",
	})
	@ApiResponse({
		status: 200,
		description: "Package updated successfully",
		type: PackageDto,
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({ status: 404, description: "Package not found for this user" })
	async update(
		@GetUserId() userId: string,
		@Body() packageData: UpdatePackageDto,
	): Promise<PackageDto> {
		return toPlainToInstance(
			PackageDto,
			await this.packageService.update(userId, packageData),
		);
	}

	@Delete("")
	@ApiOperation({
		summary: "Delete a Package",
		description:
			"Deletes a specific Package belonging to the authenticated user, given its ID.",
	})
	@ApiBody({
		type: Object,
		description: "ID of the Package to delete",
		examples: {
			"application/json": {
				value: { id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0" },
				summary: "Example body for deleting by ID",
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: "Package deleted successfully",
		type: PackageDto,
	})
	@ApiResponse({
		status: 204,
		description: "Package deleted successfully (No Content response)",
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({ status: 404, description: "Package not found for this user" })
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
