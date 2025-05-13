import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { EyeIconComponent } from "../icons/eye-icon/eye-icon.component";
import { PlusIconComponent } from "../icons/plus-icon/plus-icon.component";

import { HttpClientModule } from "@angular/common/http";
import {
	Card,
	CardService,
} from "../../services/requests/create-card/card.service";
import { InfoIconComponent } from "../icons/info-icon/info-icon.component";

@Component({
	selector: "app-formulary-create-card",
	standalone: true,
	imports: [
		ReactiveFormsModule,
		CommonModule,
		EyeIconComponent,
		PlusIconComponent,
		HttpClientModule,
		InfoIconComponent,
	],
	templateUrl: "./formulary-create-card.component.html",
	styleUrl: "./formulary-create-card.component.css",
})
export class FormularyCreateCardComponent implements OnInit {
	cardForm!: FormGroup;

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

	buildContentDetailsFormGroup(type: string): void {
		if (this.cardForm.contains("contentDetails")) {
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
				break;
		}

		this.cardForm.addControl("contentDetails", contentGroup);
		console.log(
			`FormGroup 'contentDetails' rebuilt for type: ${type}`,
			this.cardForm.get("contentDetails"),
		);
	}

	get tags(): FormArray {
		return this.cardForm.get("tags") as FormArray;
	}

	addTag(tagInput: HTMLInputElement): void {
		const tagValue = tagInput.value.trim();

		if (tagValue && !this.tags.value.includes(tagValue)) {
			this.tags.push(this.fb.control(tagValue));
			tagInput.value = "";
			console.log("Tag adicionada:", tagValue, "Tags atuais:", this.tags.value);
		}
	}

	removeTag(index: number): void {
		this.tags.removeAt(index);
		console.log(
			"Tag removida no índice:",
			index,
			"Tags atuais:",
			this.tags.value,
		);
	}

	onCancel(): void {
		console.log("Cancelar clicado");
		this.resetForm();
	}

	onPreview(): void {
		if (this.cardForm.valid) {
			const cardData = this.formatCardDataForRequest();
			console.log("Visualizar clicado. Dados formatados:", cardData);
		} else {
			console.log("Formulário inválido para visualização", this.cardForm);
			this.markFormGroupTouched(this.cardForm);
		}
	}

	onSave(): void {
		if (this.cardForm.valid) {
			const cardData = this.formatCardDataForRequest();
			console.log("Salvar Card clicado. Dados formatados:", cardData);

			this.cardService.createCard(cardData).subscribe({
				next: (response) => {
					console.log("Card salvo com sucesso!", response);

					this.resetForm();
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

	onSaveAndCreateNew(): void {
		if (this.cardForm.valid) {
			const cardData = this.formatCardDataForRequest();
			console.log("Salvar e Criar Outro clicado. Dados formatados:", cardData);

			this.cardService.createCard(cardData).subscribe({
				next: (response) => {
					console.log("Card salvo com sucesso!", response);

					this.resetForm();
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

	resetForm(): void {
		this.cardForm.reset({ type: this.selectedContentType });
		this.tags.clear();

		this.buildContentDetailsFormGroup(this.selectedContentType);
	}

	formatCardDataForRequest(): Card {
		const formValue = this.cardForm.value;
		const formattedData: Card = {
			type: formValue.type,
			title: formValue.title,
			description: formValue.description,
			tagPaths: formValue.tags || [],
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
					console.error("Content details missing or incomplete for flip type");
				}
				break;
			case "multiple-choice":
				// Future implementation for multiple-choice content
				// Example:
				// if (formValue.contentDetails && formValue.contentDetails.question && formValue.contentDetails.options && formValue.contentDetails.correctAnswer) {
				//    formattedData.contentMultipleChoice = {
				//        question: formValue.contentDetails.question,
				//        options: formValue.contentDetails.options,
				//        correctAnswer: formValue.contentDetails.correctAnswer
				//    };
				// }
				break;
			// Add cases for other card types here
		}

		if (
			formattedData.description === "" ||
			formattedData.description === null ||
			formattedData.description === undefined
		) {
			formattedData.description = undefined;
		}

		if (formattedData.contentFlip === undefined) {
			formattedData.contentFlip = undefined;
		}

		return formattedData;
	}

	markFormGroupTouched(formGroup: FormGroup | FormArray) {
		// biome-ignore lint/complexity/noForEach: <explanation>
		Object.values(formGroup.controls).forEach((control) => {
			if (control instanceof FormControl) {
				control.markAsTouched();
			} else if (control instanceof FormGroup || control instanceof FormArray) {
				this.markFormGroupTouched(control);
			}
		});
	}
}
