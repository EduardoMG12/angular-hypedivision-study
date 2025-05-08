import { UsersService } from "src/users/users.service";
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { CreateGroupDecksDto } from "./dto/create.dto";
import { GroupDecksDto } from "./dto/group-decks.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { GroupDecks } from "src/entities/group_decks.entity";
import { Repository } from "typeorm";

import { ChangeGroupDecksStatusDto } from "./dto/change-status.dto";
import { UpdateGroupDecksDto } from "./dto/update.dto";
import { GroupDecksStatus } from "./common/enums/group-decksStatus.enum";
import { GroupDecksWithDecksDto } from "./dto/group-decks-with-decks";

@Injectable()
export class GroupDecksService {
	constructor(
		@InjectRepository(GroupDecks)
		private groupDecksRepository: Repository<GroupDecks>,
		private readonly usersService: UsersService,
	) {}

	async create(
		userId: string,
		GroupDecksData: CreateGroupDecksDto,
	): Promise<GroupDecksDto> {
		const user = await this.usersService.findById(userId);

		const groupDecksEntity = this.groupDecksRepository.create({
			title: GroupDecksData.title,
			description: GroupDecksData.description || "",
			owner: user,
			status: GroupDecksStatus.Active,
			createdAt: new Date(),
		});

		return await this.groupDecksRepository.save(groupDecksEntity);
	}

	async findAll(userId: string): Promise<GroupDecksDto[]> {
		return this.groupDecksRepository.find({ where: { owner: { id: userId } } });
	}

	async findById(userId: string, id: string): Promise<GroupDecksDto> {
		const groupDecksEntity = await this.groupDecksRepository.findOne({
			where: { owner: { id: userId }, id },
		});

		if (!groupDecksEntity) {
			throw new NotFoundException("GroupDecks not found");
		}

		return groupDecksEntity as GroupDecksDto;
	}

	async findByIdWithDecks(
		userId: string,
		id: string,
	): Promise<GroupDecksWithDecksDto> {
		const groupDecksEntity = await this.groupDecksRepository.findOne({
			where: { owner: { id: userId }, id },
			relations: ["decks", "owner"],
		});

		if (!groupDecksEntity) {
			throw new NotFoundException("Group decks not found");
		}

		return groupDecksEntity as unknown as GroupDecksWithDecksDto;
	}

	// async findByIdWithDecksAndCards(
	// 	userId: string,
	// 	id: string,
	// ): Promise<GroupDecksWithDecksDto> {

	// }

	async changeStatus(
		userId: string,
		changeStatusDto: ChangeGroupDecksStatusDto,
	): Promise<GroupDecksDto> {
		const groupDecksEntity = await this.findById(userId, changeStatusDto.id);

		const currentStatus = groupDecksEntity.status;
		const targetStatus = changeStatusDto.status;

		if (currentStatus === targetStatus) {
			throw new BadRequestException("Cannot change status for egual status");
		}

		groupDecksEntity.status = targetStatus as GroupDecksStatus;

		return (await this.groupDecksRepository.save(
			groupDecksEntity,
		)) as GroupDecksDto;
	}

	async update(
		userId: string,
		GroupDecksData: UpdateGroupDecksDto,
	): Promise<GroupDecksDto> {
		const groupDecksEntity = await this.findById(userId, GroupDecksData.id);

		groupDecksEntity.title = GroupDecksData.title || groupDecksEntity.title;
		groupDecksEntity.description =
			GroupDecksData.description || groupDecksEntity.description;
		groupDecksEntity.status = GroupDecksData.status || groupDecksEntity.status;
		groupDecksEntity.updatedAt = new Date();

		return await this.groupDecksRepository.save(groupDecksEntity);
	}

	async delete(userId: string, id: string): Promise<GroupDecksDto> {
		const groupDecksEntity = await this.findById(userId, id);

		await this.groupDecksRepository.delete(id);

		return groupDecksEntity;
	}
}
