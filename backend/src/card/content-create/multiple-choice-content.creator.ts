// --- Exemplo Básico de MultipleChoiceContentCreator (Quando for implementar) ---
/*
// src/card/common/content-creators/multiple-choice-content.creator.ts
import { EntityManager, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, BadRequestException } from "@nestjs/common";

import { CardType } from "../enum/cardType.enum";
import { Card } from "../../../entities/card.entity";
import { CardContentMultipleChoice } from "../../../entities/cardContentMultipleChoice.entity"; // Sua entidade MC
import { CreateCardDto } from "../../dto/create-card.dto";
import { CreateCardContentMultipleChoiceDto } from "../../dto/create-contents.dto"; // DTO ESPECÍFICO do MC
// import { CreateAlternativeDto } from "../../dto/create-alternative.dto"; // DTO para Alternativas

import { AbstractContentCreator } from "./interfaces/content-creator.interface";


@Injectable()
export class MultipleChoiceContentCreator extends AbstractContentCreator {
    readonly type = CardType.MultipleChoice;

    constructor(
        @InjectRepository(CardContentMultipleChoice)
        private contentRepository: Repository<CardContentMultipleChoice>,
        // Se a lógica de salvar alternativas for aqui e precisar do repo de Alternative, injete-o também
        // @InjectRepository(Alternative) private alternativeRepository: Repository<Alternative>,
    ) {
        super();
    }

    validateCreateDto(createDto: CreateCardDto): void {
        if (!createDto.contentMultipleChoice) {
            throw new BadRequestException(`Content data missing for card type ${this.type}`);
        }
        // Adicionar validações específicas para o MC contentDto (question, alternatives array não vazio, formato das alternativas, etc.)
         const mcContentDto = createDto.contentMultipleChoice as CreateCardContentMultipleChoiceDto;
         if (!mcContentDto.question) {
              throw new BadRequestException(`'question' is required for Multiple Choice content.`);
         }
         if (!mcContentDto.alternatives || !Array.isArray(mcContentDto.alternatives) || mcContentDto.alternatives.length === 0) {
              throw new BadRequestException(`'alternatives' array must not be empty for Multiple Choice content.`);
         }
        // Se alternativas forem DTOs aninhados com @ValidateNested(each: true), a validação dos itens individuais será feita automaticamente
    }

    async createAndSave(
        manager: EntityManager,
        card: Card,
        createDto: CreateCardDto
    ): Promise<CardContentMultipleChoice> {
        const mcContentDto = createDto.contentMultipleChoice as CreateCardContentMultipleChoiceDto;

        // Cria a entidade de conteúdo principal do MC
        const contentEntity = manager.create(CardContentMultipleChoice, {
            cardId: card.id,
            question: mcContentDto.question,
            // Não atribui alternativas diretamente se forem entidades separadas
        });

        await manager.save(contentEntity);

        // Lógica para criar e salvar as entidades de Alternative, ligando-as à contentEntity
        // Isso pode ser feito aqui, ou delegar para um método privado, ou até um serviço separado para Alternatives
        // Exemplo simplificado (requer que Alternative seja uma entidade e que o repo esteja disponível via manager):
        // if (mcContentDto.alternatives && mcContentDto.alternatives.length > 0) {
        //     const alternativeEntities = mcContentDto.alternatives.map(altDto => manager.create(Alternative, {
        //          multipleChoiceContentId: contentEntity.id, // FK para o conteúdo MC
        //          alternative: altDto.alternative,
        //          correct_alternative: altDto.correct_alternative,
        //          description: altDto.description,
        //     }));
        //     await manager.save(alternativeEntities);
        // }


        return contentEntity; // Retorna a entidade de conteúdo MC criada
    }
}
*/
