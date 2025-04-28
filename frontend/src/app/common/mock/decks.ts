import type { IDeckData } from "../api/types/decks";

export const mockStaticDecks: IDeckData[] = [
	{
		id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
		name: "Learning English",
		description:
			"Flashcards to learn English, targeting 40 words a day, 10 phrases, and 5 grammar rules. Aiming for B1 level proficiency in 4 months.",
		cards: [
			{
				question: "What does 'benevolent' mean?",
				answer: "Kind and generous.",
				type: "flip",
				explanation: [
					"The word 'benevolent' comes from Latin roots 'bene' (good) and 'volent' (wishing). It describes someone who is well-meaning and actively kind, often showing generosity or goodwill towards others. For example, a benevolent leader might prioritize the well-being of their community. This term is often used in formal or literary contexts to highlight positive traits.",
				],
			},
			{
				question: "Which of these is the correct past participle of 'drink'?",
				answer: "drunk",
				type: "multiple-choice",
				alternatives: ["drank", "drunk", "drinking", "drink"],
				correctAlternative: [1],
				explanation: [
					"The verb 'drink' has irregular forms: 'drink' (present), 'drank' (past), and 'drunk' (past participle). The past participle is used in perfect tenses, like 'I have drunk water.' 'Drank' is the simple past, used in sentences like 'I drank water yesterday.' 'Drinking' is the present participle, and 'drink' is the base form, so they don’t fit here.",
				],
			},
			{
				question: "Translate to English: 'Eu gosto de aprender inglês.'",
				answer: "I like to learn English.",
				type: "flip",
				explanation: [
					"'Eu gosto de aprender inglês' is a Portuguese sentence where 'eu' means 'I,' 'gosto' means 'like,' 'de' indicates 'to,' and 'aprender inglês' means 'learn English.' When translating, we combine these into a natural English sentence: 'I like to learn English.' This structure reflects a common way to express preferences in English.",
				],
			},
			{
				question: "Which words are synonyms for 'happy'?",
				answer: "joyful and cheerful",
				type: "multiple-choice",
				alternatives: ["sad", "joyful", "angry", "cheerful"],
				correctAlternative: [1], // Note: If we wanted multiple correct answers, we could adjust the type to number[] and include [1, 3]
				explanation: [
					"'Happy' means feeling or showing pleasure. 'Joyful' (alternative 1) means full of joy, which aligns with happiness, often implying a deep sense of delight. 'Cheerful' (alternative 3) means noticeably happy and optimistic, also a synonym. However, 'sad' (alternative 0) means unhappy, and 'angry' (alternative 2) means upset, so they are incorrect.",
				],
			},
		],
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440000",
		name: "Spanish Basics",
		description:
			"Learn foundational Spanish vocabulary and grammar. Study 30 words and 5 basic sentence structures daily to reach A2 level in 3 months.",
		cards: [
			{
				question: "¿Cómo se dice 'book' en español?",
				answer: "Libro",
				type: "flip",
				explanation: [
					"The English word 'book' translates to 'libro' in Spanish. This is a common noun used in everyday contexts, such as 'Leo un libro' (I read a book). The word originates from the Latin 'liber,' meaning book or paper. It’s a masculine noun, so it uses 'el' (e.g., 'el libro').",
				],
			},
			{
				question: "Choose the correct translation of 'I am happy':",
				answer: "Estoy feliz",
				type: "multiple-choice",
				alternatives: ["Soy feliz", "Estoy feliz", "Es feliz", "Somos felices"],
				correctAlternative: [1],
				explanation: [
					"In Spanish, 'I am happy' can be translated as 'Estoy feliz' or 'Soy feliz.' However, 'estoy' (alternative 1) is used for temporary states, which fits the context of a fleeting emotion like happiness here. 'Soy feliz' (alternative 0) implies a more permanent trait. 'Es feliz' (alternative 2) is for 'he/she is happy,' and 'somos felices' (alternative 3) means 'we are happy,' so they’re incorrect.",
				],
			},
			{
				question: "¿Qué significa 'amigo'?",
				answer: "Friend",
				type: "flip",
				explanation: [
					"'Amigo' is a Spanish word that means 'friend' in English. It’s used to describe a close relationship, as in 'Mi amigo es simpático' (My friend is nice). The word is masculine; the feminine form is 'amiga.' It comes from the Latin 'amicus,' meaning friend or ally.",
				],
			},
			{
				question: "Which of these are Spanish greetings?",
				answer: "Hola and Buenos días",
				type: "multiple-choice",
				alternatives: ["Hola", "Adiós", "Buenos días", "Gracias"],
				correctAlternative: [0], // Note: If we wanted to allow multiple correct answers (Hola and Buenos días), we could change correctAlternative t[o] [0, 2]
				explanation: [
					"A greeting is a phrase used to say hello. 'Hola' (alternative 0) means 'hello,' and 'Buenos días' (alternative 2) means 'good morning,' both of which are greetings. 'Adiós' (alternative 1) means 'goodbye,' which is a farewell, not a greeting. 'Gracias' (alternative 3) means 'thank you,' also not a greeting. In this case, we’re selecting 'Hola' as the primary correct answer.",
				],
			},
		],
	},
	{
		id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
		name: "World Capitals",
		description:
			"Memorize the capitals of countries around the world. Aim to learn 20 capitals a day to cover 200 countries in 10 days.",
		cards: [
			{
				question: "What is the capital of Australia?",
				answer: "Canberra",
				type: "flip",
				explanation: [
					"The capital of Australia is Canberra, chosen as a compromise between Sydney and Melbourne, the two largest cities, during the country’s federation in 1901. Canberra is a planned city, designed specifically to serve as the capital, and it’s located in the Australian Capital Territory (ACT). It’s known for its government buildings and national monuments.",
				],
			},
			{
				question: "Which country has Cairo as its capital?",
				answer: "Egypt",
				type: "multiple-choice",
				alternatives: ["Morocco", "Egypt", "Algeria", "Tunisia"],
				correctAlternative: [1],
				explanation: [
					"Cairo is the capital of Egypt (alternative 1). It’s one of the largest cities in Africa and a major cultural center, located along the Nile River. Morocco’s capital is Rabat, Algeria’s is Algiers, and Tunisia’s is Tunis, so alternatives 0, 2, and 3 are incorrect. Cairo has been Egypt’s capital since the Fatimid dynasty in the 10th century.",
				],
			},
			{
				question: "What is the capital of Argentina?",
				answer: "Buenos Aires",
				type: "flip",
				explanation: [
					"Buenos Aires is the capital of Argentina, serving as the country’s political, economic, and cultural hub. It’s located on the eastern shore of the Río de la Plata estuary. Known for its European-style architecture and tango music, Buenos Aires has been the capital since Argentina’s independence in the 19th century.",
				],
			},
			{
				question: "Choose the capital of Sweden:",
				answer: "Stockholm",
				type: "multiple-choice",
				alternatives: ["Oslo", "Helsinki", "Stockholm", "Copenhagen"],
				correctAlternative: [2],
				explanation: [
					"The capital of Sweden is Stockholm (alternative 2), a city known for its archipelago and historical sites like Gamla Stan. Oslo (alternative 0) is the capital of Norway, Helsinki (alternative 1) is the capital of Finland, and Copenhagen (alternative 3) is the capital of Denmark. These are all Scandinavian capitals, but only Stockholm is correct for Sweden.",
				],
			},
		],
	},
];
