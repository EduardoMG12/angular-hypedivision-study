import { ChangeGroupDecksStatusDto } from "./dto/change-status.dto";
import { GetUserId } from "../common/decorators/get-user-id.decorator";
import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { CreateGroupDecksDto } from "./dto/create.dto";
import { GroupDecksDto } from "./dto/group-decks.dto";
import { toPlainToInstance } from "src/common/utils/to-plain-to-instance";
import { UpdateGroupDecksDto } from "./dto/update.dto";
import { GroupDecksService } from "./group-decks.service";
import {
	ApiTags,
	ApiOperation,
	ApiBody,
	ApiResponse,
	ApiBearerAuth,
} from "@nestjs/swagger";
import { GroupDecksWithDecksDto } from "./dto/group-decks-with-decks";

@ApiTags("GroupDecks")
@ApiBearerAuth()
@Controller("group-decks")
export class GroupDecksController {
	constructor(private readonly groupDecksService: GroupDecksService) {}

	@Post("create")
	@ApiOperation({
		summary: "Create a new GroupDecks",
		description:
			"Creates a new GroupDecks associated with the authenticated user.",
	})
	@ApiBody({
		type: CreateGroupDecksDto,
		description: "Data for creating the GroupDecks",
	})
	@ApiResponse({
		status: 201,
		description: "GroupDecks created successfully",
		type: GroupDecksDto,
	})
	@ApiResponse({ status: 400, description: "Bad Request (validation errors)" })
	@ApiResponse({
		status: 401,
		description: "Unauthorized (Missing or invalid JWT)",
	})
	async create(
		@GetUserId() userId: string,
		@Body() groupDecksData: CreateGroupDecksDto,
	): Promise<GroupDecksDto> {
		return toPlainToInstance(
			GroupDecksDto,
			await this.groupDecksService.create(userId, groupDecksData),
		);
	}

	@Get("findAll")
	@ApiOperation({
		summary: "List all GroupDecks for the authenticated user",
		description:
			"Returns a list of all GroupDecks belonging to the authenticated user.",
	})
	@ApiResponse({
		status: 200,
		description: "List of GroupDecks returned successfully (can be empty)",
		type: [GroupDecksDto],
	})
	@ApiResponse({ status: 401, description: "Unauthorized" })
	async findAll(@GetUserId() userId: string): Promise<GroupDecksDto[]> {
		return toPlainToInstance(
			GroupDecksDto,
			await this.groupDecksService.findAll(userId),
		);
	}

	@Post("findById")
	@ApiOperation({
		summary: "Find a specific GroupDecks by ID for the authenticated user",
		description:
			"Returns a specific GroupDecks belonging to the authenticated user, given its ID.",
	})
	@ApiBody({
		type: Object,
		description: "ID of the GroupDecks to find",
		examples: {
			"application/json": {
				value: { id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0" },
				summary: "Example body for finding by ID",
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: "GroupDecks found successfully",
		type: GroupDecksDto,
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({
		status: 404,
		description: "GroupDecks not found for this user",
	})
	async findById(
		@GetUserId() userId: string,
		@Body() groupDecksData: { id: string },
	): Promise<GroupDecksDto> {
		return toPlainToInstance(
			GroupDecksDto,
			await this.groupDecksService.findById(userId, groupDecksData.id),
		);
	}

	@Post("findByIdWithDecks")
	@ApiOperation({
		summary: "Find a specific GroupDecks by ID for the authenticated user",
		description:
			"Returns a specific GroupDecks belonging to the authenticated user, given its ID.",
	})
	@ApiBody({
		type: Object,
		description: "ID of the GroupDecks to find",
		examples: {
			"application/json": {
				value: { id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0" },
				summary: "Example body for finding by ID",
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: "GroupDecks found successfully",
		type: GroupDecksDto,
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({
		status: 404,
		description: "GroupDecks not found for this user",
	})
	async findByIdWithDecks(
		@GetUserId() userId: string,
		@Body() groupDecksData: { id: string },
	): Promise<GroupDecksWithDecksDto> {
		return toPlainToInstance(
			GroupDecksWithDecksDto,
			await this.groupDecksService.findByIdWithDecks(userId, groupDecksData.id),
		);
	}

	@Post("changeStatus")
	@ApiOperation({
		summary: "Change the status of a GroupDecks",
		description:
			"Changes the status of a specific GroupDecks belonging to the authenticated user.",
	})
	@ApiBody({
		type: ChangeGroupDecksStatusDto,
		description: "GroupDecks ID and the new Status",
	})
	@ApiResponse({
		status: 200,
		description: "GroupDecks status changed successfully",
		type: GroupDecksDto,
	})
	@ApiResponse({
		status: 400,
		description: "Bad Request (validation or invalid transition)",
	})
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({
		status: 404,
		description: "GroupDecks not found for this user",
	})
	async changeStatus(
		@GetUserId() userId: string,
		@Body() changeStatusDto: ChangeGroupDecksStatusDto,
	): Promise<GroupDecksDto> {
		return toPlainToInstance(
			GroupDecksDto,
			await this.groupDecksService.changeStatus(userId, changeStatusDto),
		);
	}

	@Put("update")
	@ApiOperation({
		summary: "Update an existing GroupDecks",
		description:
			"Updates the data of a specific GroupDecks belonging to the authenticated user.",
	})
	@ApiBody({
		type: UpdateGroupDecksDto,
		description: "Data for updating the GroupDecks (includes ID)",
	})
	@ApiResponse({
		status: 200,
		description: "GroupDecks updated successfully",
		type: GroupDecksDto,
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({
		status: 404,
		description: "GroupDecks not found for this user",
	})
	async update(
		@GetUserId() userId: string,
		@Body() groupDecksData: UpdateGroupDecksDto,
	): Promise<GroupDecksDto> {
		return toPlainToInstance(
			GroupDecksDto,
			await this.groupDecksService.update(userId, groupDecksData),
		);
	}

	@Delete("")
	@ApiOperation({
		summary: "Delete a GroupDecks",
		description:
			"Deletes a specific GroupDecks belonging to the authenticated user, given its ID.",
	})
	@ApiBody({
		type: Object,
		description: "ID of the GroupDecks to delete",
		examples: {
			"application/json": {
				value: { id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0" },
				summary: "Example body for deleting by ID",
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: "GroupDecks deleted successfully",
		type: GroupDecksDto,
	})
	@ApiResponse({
		status: 204,
		description: "GroupDecks deleted successfully (No Content response)",
	})
	@ApiResponse({ status: 400, description: "Bad Request" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({
		status: 404,
		description: "GroupDecks not found for this user",
	})
	async delete(
		@GetUserId() userId: string,
		@Body() deleteDto: { id: string },
	): Promise<GroupDecksDto> {
		return toPlainToInstance(
			GroupDecksDto,
			await this.groupDecksService.delete(userId, deleteDto.id),
		);
	}
}
