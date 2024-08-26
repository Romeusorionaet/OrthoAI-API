import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { EnvService } from "../env/env.service";
import {
  CompletionProps,
  ResultCompletionProps,
  TextGenerationServiceRepository,
} from "@/domain/essay-corrector/application/text-generation-service/text-generation-service-repository";

@Injectable()
export class OpenAIService implements TextGenerationServiceRepository {
  private openai: OpenAI;

  constructor(config: EnvService) {
    this.openai = new OpenAI({
      apiKey: config.get("OPENAI_API_KEY"),
      organization: config.get("OPENAI_ORGANIZATION_ID"),
      project: config.get("OPENAI_PROJECT_ID"),
    });
  }

  async createCompletion({
    content,
    rules,
    questions,
  }: CompletionProps): Promise<ResultCompletionProps | null> {
    const prompt = `
      Você é um assistente especializado em correção de conteúdos. Eu preciso que você corrija o conteúdo 
      a seguir e forneça a avaliação em um formato JSON específico. Siga as instruções cuidadosamente:

      1. **Correção e Avaliação:**
        - Corrija o conteúdo fornecido e atribua uma nota de 0 a 5 com base nas regras fornecidas.
        - Mantenha a formatação original do conteúdo, incluindo espaçamentos e quebras de linha. 
          Não remova parágrafos ou quebras de linha.

      2. **Verificação de Questões:**
        - Se houver questões fornecidas, responda de forma precisa e resumida, incluindo apenas o essencial.
        - As respostas devem ser colocadas diretamente após cada pergunta, no formato que contenha 
          a Pergunta e em seguida a Resposta.

      3. **Comentário Resumido:**
        - Escreva um comentário resumindo sobre o tema do conteúdo. Sinta-se à vontade para comentar, 
          mas mantenha o foco no tema.

      **Regras de correção:** ${rules}

      **Questões a serem respondidas:** ${questions}

      **Conteúdo original:** ${content}

      **Formato JSON esperado:**

      {
        "correctedContent": "Aqui vai o conteúdo corrigido.",
        "evaluation": "Nota de 0 a 5.",
        "questionVerification": [
          {"1": "Pergunta: Resposta."},
          {"2": "Pergunta: Resposta."},
          {"3": "Pergunta: Resposta."}
        ],
        "comment": "Aqui vai o comentário resumido sobre o assunto."
      }
    `;

    try {
      const result = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
      });

      const resultContent = result.choices[0].message.content;

      if (!resultContent) {
        return null;
      }

      const resultObject: ResultCompletionProps | null = null;

      return resultObject;
    } catch (err) {
      console.error("Error creating completion:", err);
      return null;
    }
  }
}
