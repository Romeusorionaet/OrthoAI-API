import { UseCaseError } from "@/core/errors/use-case-error";

export class CompletionNotPossibleError extends Error implements UseCaseError {
  constructor() {
    super("was not possible get result completion.");
  }
}
