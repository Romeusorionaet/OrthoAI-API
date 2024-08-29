import { UseCaseError } from "@/core/errors/use-case-error";

export class ContentCouldNotExtractError extends Error implements UseCaseError {
  constructor() {
    super("Problema ao extrair o conteúdo.");
  }
}
