import { DocumentContent } from "@/domain/essay-corrector/enterprise/entities/document-content";

export class DocumentContentPresenter {
  static toHTTP(documentContent: DocumentContent) {
    return {
      originalDocumentContent: documentContent.originalDocument,
      newDocumentContent: documentContent.newDocument,
      rules: documentContent.rules,
      evaluation: documentContent.evaluation,
      comment: documentContent.comment,
      createdAt: documentContent.createdAt,
    };
  }
}
