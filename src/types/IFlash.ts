// export interface IFlashcard {
//     username: string
//     flashcardId: string
//     process: string
//     lastLearnedDate: string
//     recentWrongExam: boolean
//     recentWrongLearn: boolean
//     flashcard: {
//         flashcardId: string
//         question: string
//         answer: string
//         answerLang: string
//         questionLang: string
//         image: string
//         isDeleted: boolean
//         creditId: string
//     }
// }

export interface ILearn {
    username: string
    flashcardId: string
    process: string
    lastLearnedDate: string
    recentWrongExam: boolean
    recentWrongLearn: boolean
    countLearnedTrue: Number
}


export interface IFlashcard {
    flashcardId: string
    question: string
    answer: string
    answerLang: string
    questionLang: string
    image: string
    isDeleted: boolean
    creditId: string
    learns: ILearn[]|null
    questionType: any // để sinh câu hỏi trong chức năng "Kiểm tra"
    learn: boolean // trạng thái true/false phục vụ chức năng kiểm tra (nghĩa là đang trả lời cái thẻ ấy đúng hay sai)
    answerExam: string // đáp án khi làm kiểm tra 
    listMultipleAns: any // phục phụ phần "Kiểm tra" - khi re-render
}

// export interface IListFlashcardProps {
//     flashcards: IFlashcard[];
// }

export interface IFlashcardProps {
    flashcard: IFlashcard;
}

