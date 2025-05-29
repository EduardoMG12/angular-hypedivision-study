import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { EyeIconComponent } from "../../../icons/eye-icon/eye-icon.component";
import { PlusIconComponent } from "../../../icons/plus-icon/plus-icon.component";

import { CardService } from "../../../../services/requests/card/card.service";
import { InfoIconComponent } from "../../../icons/info-icon/info-icon.component";
import { Card } from "../../../../common/api/interfaces/my-cards-list.interface";

@Component({
	selector: "app-formulary-create-card",
	standalone: true,
	imports: [
		ReactiveFormsModule,
		CommonModule,
		EyeIconComponent,
		PlusIconComponent,

		InfoIconComponent,
	],
	templateUrl: "./formulary-create-card.component.html",
	styleUrl: "./formulary-create-card.component.css",
})
export class FormularyCreateCardComponent implements OnInit {
	cardForm!: FormGroup;

	@Output() goBack = new EventEmitter<void>();

	@Output() cardSaved = new EventEmitter<Card>();

	contentTypes = [
		{ value: "flip", label: "Card Flip", enabled: true },
		{ value: "multiple-choice", label: "Múltipla Escolha", enabled: false },
	];

	selectedContentType = "flip";

	constructor(
		private fb: FormBuilder,
		private cardService: CardService,
	) {}

	ngOnInit(): void {
		this.cardForm = this.fb.group({
			title: ["", Validators.required],
			description: [""],
			type: [this.selectedContentType, Validators.required],
			tags: this.fb.array([]),
		});

		this.cardForm.get("type")?.valueChanges.subscribe((type) => {
			this.selectedContentType = type;
			console.log("Tipo de conteúdo mudou para:", type);
			this.buildContentDetailsFormGroup(type);
		});

		this.buildContentDetailsFormGroup(this.selectedContentType);
	}

	/**
	 * Constrói dinamicamente o FormGroup para a seção de detalhes do conteúdo com base no tipo do card.
	 * @param type O tipo do card (ex: 'flip', 'multiple-choice').
	 */
	buildContentDetailsFormGroup(type: string): void {
		if (this.cardForm.get("contentDetails")) {
			this.cardForm.removeControl("contentDetails");
		}

		let contentGroup: FormGroup;

		switch (type) {
			case "flip":
				contentGroup = this.fb.group({
					front: ["", Validators.required],
					back: ["", Validators.required],
				});
				break;
			case "multiple-choice":
				contentGroup = this.fb.group({
					question: ["", Validators.required],
					options: this.fb.array([], Validators.required),
					correctAnswer: ["", Validators.required],
				});

				break;
			default:
				contentGroup = this.fb.group({});
				console.warn(
					`Tipo de card desconhecido "${type}". Nenhuma seção de conteúdo adicionada.`,
				);
				break;
		}

		this.cardForm.addControl("contentDetails", contentGroup);
		console.log(
			`FormGroup 'contentDetails' reconstruído para o tipo: ${type}`,
			this.cardForm.get("contentDetails"),
		);
	}

	/**
	 * Getter para acessar o FormArray de tags.
	 */
	get tags(): FormArray {
		return this.cardForm.get("tags") as FormArray;
	}

	/**
	 * Adiciona uma tag ao FormArray de tags.
	 * @param tagInput O elemento HTML do input de tags.
	 */
	addTag(tagInput: HTMLInputElement): void {
		const tagValue = tagInput.value.trim();

		const tagExists = this.tags.controls.some(
			(control) =>
				(control.value as string).trim().toLowerCase() ===
				tagValue.toLowerCase(),
		);

		if (tagValue && !tagExists) {
			this.tags.push(this.fb.control(tagValue));
			tagInput.value = "";
			console.log("Tag adicionada:", tagValue, "Tags atuais:", this.tags.value);
		} else if (tagExists) {
			console.log("Tag já existe:", tagValue);
		}
	}

	/**
	 * Remove uma tag do FormArray de tags pelo índice.
	 * @param index O índice da tag a ser removida.
	 */
	removeTag(index: number): void {
		this.tags.removeAt(index);
		console.log(
			"Tag removida no índice:",
			index,
			"Tags atuais:",
			this.tags.value,
		);
	}

	/**
	 * Lógica para o botão Cancelar. Reseta o formulário e emite o evento goBack.
	 */
	onCancel(): void {
		console.log("Cancelar clicado");
		this.resetForm();
		this.goBack.emit();
	}

	/**
	 * Lógica para o botão Visualizar. Formata os dados e exibe no console (exemplo).
	 */
	onPreview(): void {
		// TODO: Implementar funcionalidade real de visualização
		if (this.cardForm.valid) {
			const cardData = this.formatCardDataForRequest();
			console.log("Visualizar clicado. Dados formatados:", cardData);
		} else {
			console.log("Formulário inválido para visualização", this.cardForm);
			this.markFormGroupTouched(this.cardForm);
		}
	}

	/**
	 * Lógica para o botão Salvar Card. Envia os dados para o serviço.
	 */
	onSave(): void {
		if (this.cardForm.valid) {
			const cardData = this.formatCardDataForRequest();
			console.log("Salvar Card clicado. Dados formatados:", cardData);

			this.cardService.createCard(cardData).subscribe({
				next: (response) => {
					console.log("Card salvo com sucesso!", response);

					this.resetForm();
					this.cardSaved.emit(cardData);
					this.goBack.emit();
				},
				error: (error) => {
					console.error("Erro ao salvar card:", error);
				},
			});
		} else {
			console.log("Formulário inválido para salvar", this.cardForm);
			this.markFormGroupTouched(this.cardForm);
		}
	}

	/**
	 * Lógica para o botão Salvar e Criar Outro. Salva o card e reseta o formulário para criar outro.
	 */
	onSaveAndCreateNew(): void {
		if (this.cardForm.valid) {
			const cardData = this.formatCardDataForRequest();
			console.log("Salvar e Criar Outro clicado. Dados formatados:", cardData);

			this.cardService.createCard(cardData).subscribe({
				next: (response) => {
					console.log("Card salvo com sucesso!", response);

					this.resetForm();
					this.cardSaved.emit(cardData);
				},
				error: (error) => {
					console.error("Erro ao salvar card:", error);
				},
			});
		} else {
			console.log(
				"Formulário inválido para salvar e criar outro",
				this.cardForm,
			);
			this.markFormGroupTouched(this.cardForm);
		}
	}

	/**
	 * Reseta o formulário para seus valores iniciais.
	 */
	resetForm(): void {
		this.cardForm.reset({ type: this.selectedContentType });

		this.tags.clear();

		this.buildContentDetailsFormGroup(this.selectedContentType);

		this.cardForm.markAsPristine();
		this.cardForm.markAsUntouched();
		console.log("Formulário resetado.");
	}

	/**
	 * Formata os dados do formulário para o formato esperado pela API.
	 * @returns Um objeto Card formatado para a requisição.
	 */
	formatCardDataForRequest(): Card {
		const formValue = this.cardForm.value;
		const formattedData: Card = {
			type: formValue.type,
			title: formValue.title,

			description: formValue.description ? formValue.description : undefined,

			tagPaths: Array.isArray(formValue.tags)
				? formValue.tags.filter((tag: string) => tag && tag.trim() !== "")
				: [],

			contentFlip: undefined,
			id: "",
			owner_id: "",
		};

		switch (formValue.type) {
			case "flip":
				if (
					formValue.contentDetails &&
					formValue.contentDetails.front !== undefined &&
					formValue.contentDetails.back !== undefined
				) {
					formattedData.contentFlip = {
						front: formValue.contentDetails.front,
						back: formValue.contentDetails.back,
					};
				} else {
					console.error(
						"Detalhes do conteúdo faltando ou incompletos para o tipo flip",
					);
				}
				break;
			case "multiple-choice":
				// TODO: future Implementation format multiple-choices
				// Example:
				// if (formValue.contentDetails && formValue.contentDetails.question && formValue.contentDetails.options && formValue.contentDetails.correctAnswer) {
				//    formattedData.contentMultipleChoice = {
				//        question: formValue.contentDetails.question,
				//        options: formValue.contentDetails.options, // Certifique-se que options está no formato correto
				//        correctAnswer: formValue.contentDetails.correctAnswer
				//    };
				// }
				break;
		}

		return formattedData;
	}

	markFormGroupTouched(formGroup: FormGroup | FormArray) {
		const controls = Object.values(formGroup.controls);

		for (const control of controls) {
			if (control instanceof FormControl) {
				control.markAsTouched();
			} else if (control instanceof FormGroup || control instanceof FormArray) {
				this.markFormGroupTouched(control);
			}
		}
	}
}
