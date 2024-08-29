export interface CompletionProps {
  content: string;
  rules: string;
  questions: string;
}

export interface ResultCompletionProps {
  correctedContent: string;
  evaluation: string;
  questionVerification: string[];
  comment: string;
}

export abstract class TextGenerationServiceRepository {
  abstract createCompletion({
    content,
    rules,
    questions,
  }: CompletionProps): Promise<ResultCompletionProps | null>;
}
