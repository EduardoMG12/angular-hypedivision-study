import { Controller, Get } from "@nestjs/common";
import { TagService } from "./tags.service";
import { GetAllTagsDto } from "./dto/tag-node.dto";
import { toPlainToInstance } from "src/common/utils/toPlainToInstance";
import { GetUserId } from "src/common/decorators/getUserId.decorator";

@Controller("tags")
export class TagsController {
	constructor(private readonly tagsService: TagService) {}

	@Get("getAllTags")
	async getAllTags(@GetUserId() userId: string): Promise<GetAllTagsDto> {
		return toPlainToInstance(
			GetAllTagsDto,
			this.tagsService.getAllTags(userId),
		);
	}
}
