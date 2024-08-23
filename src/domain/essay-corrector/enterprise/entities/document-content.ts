import { Optional } from "@/core/@types/optional";
import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface DocumentContentProps {
  originalDocument: string;
  newDocument?: string;
  rules?: string;
  evaluation?: string;
  createdAt: Date | null;
}

export class DocumentContent extends Entity<DocumentContentProps> {
  get originalDocument() {
    return this.props.originalDocument;
  }

  get newDocument() {
    return this.props.newDocument;
  }

  get rules() {
    return this.props.rules;
  }

  get evaluation() {
    return this.props.evaluation;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<DocumentContentProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const documentContent = new DocumentContent(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    );

    return documentContent;
  }

  update(props: Partial<DocumentContentProps>): DocumentContent {
    return new DocumentContent(
      {
        ...this.props,
        ...props,
      },
      this.id,
    );
  }
}
