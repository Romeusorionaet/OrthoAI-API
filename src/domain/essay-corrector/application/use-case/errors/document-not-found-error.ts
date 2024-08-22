import { UseCaseError } from "@/core/errors/use-case-error";

export class DocumentNotFoundError extends Error implements UseCaseError {
  constructor() {
    super("Documento não encontrado.");
  }
}
