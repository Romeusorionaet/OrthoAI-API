import { UseCaseError } from "@/core/errors/use-case-error";

export class NoDocumentsFoundError extends Error implements UseCaseError {
  constructor() {
    super("Nem um Documento foi encontrado.");
  }
}
