const {
	flashcardView,
	newFlashcardFormView,
	view,
	update,
	messages
} = require("./index");

// Update
const testModel = {
	flashcards: [
		{
			question: "What is this",
			anwser: "a test",
			id: 0,
			showAnswer: false,
			rating: 0
		},
		{
			question: "Is this JavaScript",
			anwser: "Yes",
			id: 1,
			showAnswer: true,
			rating: 4
		},
		{
			question: "Is this Java",
			anwser: "No",
			id: 2,
			showAnswer: false,
			rating: 9
		}
	],
	newFlashcard: { question: "", answer: "" },
	showForm: false,
	editingFlashcard: null,
	editableFlashcard: { question: "", answer: "" }
};
test("Add flashcard", () => {
	const result = update(messages.addFlashcard, testModel);
	const expectation = { ...testModel, showForm: true };
	expect(result).toMatchObject(expectation);
});

test("Add flashcard without object (Negative test)", () => {
	const result = update(messages.addFlashcard);
	const expectation = { showForm: true };
	expect(result).toMatchObject(expectation);
});

test("Update question", () => {
	const newQuestion = "Is this C#?";
	const result = update(messages.updateQuestion, testModel, newQuestion);
	const expectation = {
		...testModel,
		newFlashcard: { ...testModel.newFlashcard, question: newQuestion }
	};
	expect(result).toMatchObject(expectation);
});

test("Update question without question (Negative test)", () => {
	const result = update(messages.updateQuestion, testModel);
	const expectation = {
		...testModel,
		newFlashcard: { ...testModel.newFlashcard, question: undefined }
	};
	expect(result).toMatchObject(expectation);
});

test("Update answer", () => {
	const newAnswer = "no";
	const result = update(messages.updateAnswer, testModel, newAnswer);
	const expectation = {
		...testModel,
		newFlashcard: { ...testModel.newFlashcard, answer: newAnswer }
	};
	expect(result).toMatchObject(expectation);
});

test("Update answer without answer (Negative test)", () => {
	const result = update(messages.updateAnswer, testModel);
	const expectation = {
		...testModel,
		newFlashcard: { ...testModel.newFlashcard, answer: undefined }
	};
	expect(result).toMatchObject(expectation);
});

test("Save flashcard", () => {
	const question = "Is this C++?";
	const answer = "No";
	const modelWithNewFlashcard = {
		...testModel,
		newFlashcard: {
			...testModel.newFlashcard,
			question: question,
			answer: answer
		}
	};

	const result = update(messages.saveFlashcard, modelWithNewFlashcard);
	const expectation = {
		...testModel,
		flashcards: [
			...testModel.flashcards,
			{
				question: question,
				answer: answer,
				id: testModel.flashcards.length,
				showAnswer: false,
				rating: 0
			}
		]
	};
	expect(result).toMatchObject(expectation);
});

test("Save flashcard with empty question and answer (Negative test)", () => {
	const question = "";
	const answer = "";
	const modelWithNewFlashcard = {
		...testModel,
		newFlashcard: {
			...testModel.newFlashcard,
			question: question,
			answer: answer
		}
	};

	const result = update(messages.saveFlashcard, modelWithNewFlashcard);
	const expectation = modelWithNewFlashcard;
	expect(result).toMatchObject(expectation);
});

test("Toggle answer", () => {
	const idOfFlashcardToToggle = 2;
	const result = update(
		messages.toggleAnswer,
		testModel,
		idOfFlashcardToToggle
	);
	const expectation = {
		...testModel,
		flashcards: [
			{
				question: "What is this",
				anwser: "a test",
				id: 0,
				showAnswer: false,
				rating: 0
			},
			{
				question: "Is this JavaScript",
				anwser: "Yes",
				id: 1,
				showAnswer: true,
				rating: 4
			},
			{
				question: "Is this Java",
				anwser: "No",
				id: 2,
				showAnswer: true,
				rating: 9
			}
		]
	};

	expect(result).toMatchObject(expectation);
});

test("Toggle answer without id (Negative test)", () => {
	const result = update(messages.toggleAnswer, testModel);
	const expectation = testModel;

	expect(result).toMatchObject(expectation);
});

test("Delete Flashcard", () => {});
