export interface IKnowledgeBlock {
	id: string;
	name: string;
	description?: string;
}

export interface ISubject {
	id: string;
	subjectCode: string;
	name: string;
	credits: number;
}

export type IDifficulty = 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';

export interface IQuestion {
	id: string;
	questionCode: string;
	subjectId: string;
	knowledgeBlockId: string;
	content: string;
	difficulty: IDifficulty;
}

export interface IExamStructureRequirement {
	difficulty: IDifficulty;
	knowledgeBlockId: string;
	count: number;
}

export interface IExamStructure {
	id: string;
	name: string;
	subjectId: string;
	requirements: IExamStructureRequirement[];
}

export interface IExam {
	id: string;
	structureId: string;
	subjectId: string;
	questions: IQuestion[];
	createdAt: string;
}
