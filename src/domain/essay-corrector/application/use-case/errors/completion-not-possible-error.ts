import { UseCaseError } from "@/core/errors/use-case-error";

export class CompletionNotPossibleError extends Error implements UseCaseError {
  constructor() {
    super("Não foi possível obter o resultado de conclusão.");
  }
}
