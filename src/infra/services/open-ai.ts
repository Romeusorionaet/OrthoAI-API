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
        - Em caso do conteúdo houver título, mantenha esse título na correção.

      2. **Verificação de Questões:**
        - Se houver questões fornecidas, responda de forma precisa e resumida, incluindo apenas o essencial.
        - As respostas devem ser colocadas diretamente após cada pergunta, no formato que contenha 
          a Pergunta e em seguida a Resposta.

      3. **Comentário Resumido:**
        - Escreva um comentário resumindo sobre o que foi corrigido e oque pode melhorar.

      **Regras de correção:** ${rules}

      **Questões a serem respondidas:** ${questions}

      **Conteúdo original:** ${content}

      **Formato JSON esperado:**

      {
        "correctedContent": "Aqui vai o conteúdo corrigido.",
        "evaluation": "Nota de 0 a 5.",
        "questionVerification": [
          "Pergunta? Resposta.",
          "Pergunta? Resposta.",
          "Pergunta? Resposta."
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
      // const resultContent = {
      //   correctedContent:
      //     "A Exploração do Trabalho Infantil no Brasil: Um Retrocesso para o Desenvolvimento Nacional A exploração do trabalho infantil no Brasil é uma questão alarmante que constitui uma grave violação dos direitos humanos, além de representar um obstáculo significativo ao desenvolvimento social e econômico do país. Apesar de existir um robusto arcabouço legal que proíbe o trabalho de menores de 16 anos, salvo na condição de aprendiz a partir dos 14, a realidade de muitas crianças e adolescentes ainda é marcada por jornadas de trabalho extenuantes e condições precárias. O Estatuto da Criança e do Adolescente (ECA) e a Constituição Federal são pilares legislativos que visam proteger os direitos das crianças e adolescentes, garantindo-lhes uma infância segura e plena. No entanto, a prática do trabalho infantil persiste, expondo jovens a situações que comprometem seriamente seu desenvolvimento físico e emocional. Essas condições, muitas vezes severas, não apenas afetam a saúde e bem-estar dos jovens, mas também os afastam do sistema educacional, perpetuando um ciclo de pobreza e exclusão social que é difícil de romper. O afastamento das crianças da escola para inseri-las em trabalhos inadequados limita severamente suas oportunidades futuras, reduzindo suas chances de alcançar uma vida digna e produtiva. A falta de acesso à educação de qualidade, combinada com a pressão econômica que leva muitas famílias a dependerem do trabalho infantil, contribui para a manutenção de um ciclo vicioso de pobreza, em que as gerações seguintes acabam reproduzindo as mesmas condições de exclusão social. Diante desse cenário, torna-se imprescindível que o Estado, em colaboração com a sociedade civil, intensifique os esforços para erradicar o trabalho infantil no Brasil. A implementação de políticas públicas eficazes, que garantam o acesso universal à educação de qualidade e a proteção integral dos jovens, é essencial para romper o ciclo de pobreza e proporcionar um futuro digno às novas gerações. Somente assim será possível assegurar o progresso e o desenvolvimento sustentável da nação como um todo.",
      //   evaluation: "4",
      //   questionVerification: [
      //     "Quais são os principais obstáculos para erradicar o trabalho infantil no Brasil? A falta de acesso à educação de qualidade e a pressão econômica que leva famílias a dependerem do trabalho infantil.",
      //     "Como o trabalho infantil perpetua o ciclo de pobreza? O afastamento das crianças da escola para inseri-las em trabalhos inadequados reduz suas oportunidades futuras, mantendo um ciclo vicioso de pobreza e exclusão social.",
      //     "Quais ações podem garantir a educação e erradicar o trabalho infantil? Implementação de políticas públicas eficazes que garantam acesso à educação de qualidade e proteção integral dos jovens.",
      //   ],
      //   comment:
      //     "O texto aborda de forma clara e concisa a problemática do trabalho infantil no Brasil, destacando a importância da educação e da proteção integral dos jovens para romper o ciclo de pobreza. Reforça a necessidade de políticas públicas eficazes e da colaboração entre Estado e sociedade civil para erradicar essa prática e garantir um futuro digno às novas gerações.",
      // };

      if (!resultContent) {
        return null;
      }

      const resultObject: ResultCompletionProps | null =
        JSON.parse(resultContent);

      return resultObject;
    } catch (err) {
      console.error("Error creating completion:", err);
      return null;
    }
  }
}
