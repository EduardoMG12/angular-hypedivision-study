import { Body, Controller, Get, Put } from "@nestjs/common";
import { TagService } from "./tags.service";
import { GetAllTagsDto } from "./dto/tag-node.dto";
import { toPlainToInstance } from "src/common/utils/to-plain-to-instance";
import { GetUserId } from "src/common/decorators/get-user-id.decorator";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { MoveTagDto } from "./dto/move-tag.dto";
import { TagDto } from "./dto/tag.dto";

@Controller("tags")
export class TagsController {
	constructor(private readonly tagsService: TagService) {}

	@Get("find-all")
	async getAllTags(@GetUserId() userId: string): Promise<GetAllTagsDto> {
		return toPlainToInstance(
			GetAllTagsDto,
			this.tagsService.getAllTags(userId),
		);
	}

	@Put("move") // Endpoint PUT /tags/move
	@ApiOperation({
		summary: "Mover uma tag para uma nova tag pai ou para a raiz",
	})
	@ApiBody({
		type: MoveTagDto,
		description:
			"Dados para a movimentação da tag (ID da tag e ID da tag pai de destino)",
	})
	// Ajuste o tipo de retorno conforme o que o serviço retorna (entidade Tag, DTO, etc.)
	@ApiResponse({
		status: 200,
		description: "Tag movida com sucesso",
		type: TagDto,
	}) // Exemplo retornando a entidade Tag
	@ApiResponse({
		status: 400,
		description: "Dados de movimentação inválidos (ex: movimentação circular)",
	})
	@ApiResponse({
		status: 404,
		description: "Tag ou tag pai de destino não encontrada",
	})
	@ApiResponse({
		status: 403,
		description: "Proibido (se a propriedade da tag for verificada)",
	})
	async moveTag(
		@GetUserId() userId: string,
		@Body() moveTagDto: MoveTagDto,
	): Promise<TagDto> {
		return toPlainToInstance(
			TagDto,
			await this.tagsService.moveTag(userId, moveTagDto),
		);
	}
}
