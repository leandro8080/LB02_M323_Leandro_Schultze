const hh = require("hyperscript-helpers");
const { h, diff, patch } = require("virtual-dom");
const createElement = require("virtual-dom/create-element");

const { div, button, section, p, textarea } = hh(h);

const messages = {
	addFlashcard: "ADD_FLASHCARD",
	updateQuestion: "UPDATE_QUESTION",
	updateAnswer: "UPDATE_ANSWER",
	saveFlashcard: "SAVE_FLASHCARD",
	deleteFlashcard: "DELETE_FLASHCARD",
	toggleAnswer: "TOGGLE_ANSWER",
	editFlashcard: "EDIT_FLASHCARD",
	saveEditedFlashcard: "SAVE_EDITED_FLASHCARD",
	updateEditableQuestion: "UPDATE_EDITABLE_QUESTION",
	updateEditableAnswer: "UPDATE_EDITABLE_ANSWER",
	updateRating: "UPDATE_RATING"
};

function flashcardView(
	dispatch,
	flashcard,
	editingFlashcard,
	editableFlashcard
) {
	return section(
		{
			className:
				"shadow bg-yellow-100 p-4 rounded-md w-60 text-pretty break-words min-h-60"
		},
		[
			div({ className: "flex justify-between items-center mb-2" }, [
				p({ className: "underline font-bold" }, "Question"),
				section({ className: "flex gap-1" }, [
					flashcard.id === editingFlashcard
						? null
						: button(
								{
									id: `flashcardEdit${flashcard.id}`,
									onclick: () =>
										dispatch(
											messages.editFlashcard,
											flashcard.id
										)
								},
								"✎"
						  ),
					button(
						{
							id: `deleteButton${flashcard.id}`,
							onclick: () =>
								dispatch(messages.deleteFlashcard, flashcard.id)
						},
						"✕"
					)
				])
			]),
			flashcard.id === editingFlashcard
				? textarea({
						id: "editQuestionInput",
						className:
							"shadow-inner w-full mb-2 p-2 border rounded bg-slate-50 text-lg",
						value: editableFlashcard.question,
						oninput: (e) =>
							dispatch(
								messages.updateEditableQuestion,
								e.target.value
							)
				  })
				: p({ id: `question${flashcard.id}` }, flashcard.question),
			flashcard.id === editingFlashcard
				? textarea({
						id: "editAnswerInput",
						className:
							"shadow-inner w-full p-2 border rounded bg-slate-50 text-lg",
						value: editableFlashcard.answer,
						oninput: (e) =>
							dispatch(
								messages.updateEditableAnswer,
								e.target.value
							)
				  })
				: null,
			editingFlashcard !== flashcard.id
				? button(
						{
							id: `showAnswerButton${flashcard.id}`,
							className: "underline cursor-pointer mt-2",
							onclick: () =>
								dispatch(messages.toggleAnswer, flashcard.id)
						},
						flashcard.showAnswer ? "Hide answer" : "Show answer"
				  )
				: null,
			flashcard.showAnswer && editingFlashcard === null
				? p({ className: "underline font-bold" }, "Answer")
				: null,
			flashcard.showAnswer && editingFlashcard === null
				? p({ id: `answer${flashcard.id}` }, flashcard.answer)
				: null,
			flashcard.showAnswer && editingFlashcard === null
				? section(
						{ className: "flex justify-around text-white pt-6" },
						[
							button(
								{
									className: `bg-red-500 px-3 py-0.5 rounded-md`,
									onclick: () =>
										dispatch(messages.updateRating, {
											id: flashcard.id,
											ratingType: 0
										})
								},
								"Bad"
							),
							button(
								{
									className: `bg-blue-500 px-3 py-0.5 rounded-md`,
									onclick: () =>
										dispatch(messages.updateRating, {
											id: flashcard.id,
											ratingType: 1
										})
								},
								"Good"
							),
							button(
								{
									className: `bg-green-500 px-3 py-0.5 rounded-md`,
									onclick: () =>
										dispatch(messages.updateRating, {
											id: flashcard.id,
											ratingType: 2
										})
								},
								"Great"
							)
						]
				  )
				: null,
			flashcard.id === editingFlashcard
				? button(
						{
							id: "saveEditedFlashcardButton",
							className:
								"bg-blue-500 text-white px-4 py-2 rounded mt-2",
							onclick: () =>
								dispatch(messages.saveEditedFlashcard)
						},
						"Save"
				  )
				: null
		]
	);
}

function newFlashcardFormView(dispatch, model) {
	return section(
		{
			className: "shadow bg-yellow-100 p-4 rounded-md w-60"
		},
		[
			div({ className: "mb-2" }, [
				p({ className: "font-bold mb-1" }, "New Flashcard"),
				textarea({
					id: "questionInput",
					className:
						"shadow-inner w-full mb-2 p-2 border rounded bg-slate-50 text-lg",
					placeholder: "Enter question...",
					value: model.newFlashcard.question,
					oninput: (e) =>
						dispatch(messages.updateQuestion, e.target.value)
				}),
				textarea({
					id: "answerInput",
					className:
						"shadow-inner w-full p-2 border rounded bg-slate-50 text-lg",
					placeholder: "Enter answer...",
					value: model.newFlashcard.answer,
					oninput: (e) =>
						dispatch(messages.updateAnswer, e.target.value)
				})
			]),
			button(
				{
					id: "saveCardButton",
					className: "bg-blue-500 text-white px-4 py-2 rounded",
					onclick: () => dispatch(messages.saveFlashcard)
				},
				"Save"
			)
		]
	);
}

function view(dispatch, model) {
	// I use .slice() to make a copy of the array so i dont change the original array
	const sortedFlashcards = model.flashcards.slice().sort((a, b) => {
		// if negative b before a, if postive a before b, if 0 nothing
		return (a.rating || 0) - (b.rating || 0);
	});

	return div({ className: "w-full container mx-auto p-4" }, [
		button(
			{
				id: "createButton",
				className: "bg-blue-600 rounded-md text-white py-1 px-3 mt-4",
				onclick: () => dispatch(messages.addFlashcard)
			},
			"Add card"
		),
		div(
			{
				id: "flashcardList",
				className:
					"w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-4 pt-4"
			},
			[
				...sortedFlashcards.map((flashcard) =>
					flashcardView(
						dispatch,
						flashcard,
						model.editingFlashcard,
						model.editableFlashcard
					)
				),
				model.showForm ? newFlashcardFormView(dispatch, model) : null
			]
		)
	]);
}

function update(message, model, value) {
	switch (message) {
		case messages.addFlashcard:
			return {
				...model,
				showForm: true
			};

		case messages.updateQuestion:
			return {
				...model,
				newFlashcard: { ...model.newFlashcard, question: value }
			};

		case messages.updateAnswer:
			return {
				...model,
				newFlashcard: { ...model.newFlashcard, answer: value }
			};

		case messages.saveFlashcard:
			if (
				model.newFlashcard.question.trim() === "" ||
				model.newFlashcard.answer.trim() === ""
			) {
				return model;
			}
			const newFlashcard = {
				...model.newFlashcard,
				id: model.flashcards.length,
				showAnswer: false,
				rating: 0
			};
			return {
				...model,
				flashcards: [...model.flashcards, newFlashcard],
				newFlashcard: { question: "", answer: "" },
				showForm: false
			};

		case messages.toggleAnswer:
			return {
				...model,
				flashcards: model.flashcards.map((flashcard) =>
					flashcard.id === value
						? { ...flashcard, showAnswer: !flashcard.showAnswer }
						: flashcard
				)
			};

		case messages.deleteFlashcard:
			return {
				...model,
				flashcards: model.flashcards.filter(
					(flashcard) => flashcard.id !== value
				),
				editingFlashcard:
					model.editingFlashcard === value
						? null
						: model.editingFlashcard
			};

		case messages.editFlashcard:
			const flashcardToEdit = model.flashcards.find(
				(flashcard) => flashcard.id === value
			);
			return {
				...model,
				editingFlashcard: value,
				editableFlashcard: { ...flashcardToEdit }
			};

		case messages.saveEditedFlashcard:
			return {
				...model,
				flashcards: model.flashcards.map((flashcard) =>
					flashcard.id === model.editingFlashcard
						? { ...model.editableFlashcard }
						: flashcard
				),
				editingFlashcard: null,
				editableFlashcard: { question: "", answer: "" }
			};

		case messages.updateEditableQuestion:
			return {
				...model,
				editableFlashcard: {
					...model.editableFlashcard,
					question: value
				}
			};

		case messages.updateEditableAnswer:
			return {
				...model,
				editableFlashcard: { ...model.editableFlashcard, answer: value }
			};

		case messages.updateRating:
			const { id, ratingType } = value;
			return {
				...model,
				flashcards: model.flashcards.map((flashcard) => {
					if (flashcard.id === id) {
						let newRating;
						switch (ratingType) {
							case 0:
								newRating = 0;
								break;
							case 1:
								newRating = (flashcard.rating || 0) + 1;
								break;
							case 2:
								newRating = (flashcard.rating || 0) + 2;
								break;
							default:
								newRating = flashcard.rating || 0;
						}
						return {
							...flashcard,
							rating: newRating,
							showAnswer: false
						};
					}
					return flashcard;
				})
			};

		default:
			return model;
	}
}

function app(initialModel, update, view, node) {
	let model = initialModel;
	let currentView = view(dispatch, model);
	let rootNode = createElement(currentView);
	node.appendChild(rootNode);

	function dispatch(message, value) {
		model = update(message, model, value);
		const updatedView = view(dispatch, model);
		const patches = diff(currentView, updatedView);
		rootNode = patch(rootNode, patches);
		currentView = updatedView;
	}
}

const initialModel = {
	flashcards: [],
	newFlashcard: { question: "", answer: "" },
	showForm: false,
	editingFlashcard: null,
	editableFlashcard: { question: "", answer: "" }
};

// To test add line comments to the 2 lines below
const rootNode = document.getElementById("app");
app(initialModel, update, view, rootNode);

module.exports = {
	flashcardView,
	newFlashcardFormView,
	view,
	update,
	messages
};
