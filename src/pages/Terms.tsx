import { Link } from "react-router-dom";
import LegalLayout, { LegalList, LegalSection } from "../features/legal/components/LegalLayout";

export default function Terms() {
  return (
    <LegalLayout
      title="Termos de Uso"
      intro="Estas regras valem para quem cria uma conta e usa o Mind Money. Leia com calma: ao criar sua conta, você confirma que leu e concorda com elas e com a Política de Privacidade."
    >
      <LegalSection title="1. O que é o Mind Money">
        <p>
          O Mind Money é um projeto acadêmico, desenvolvido por estudantes como trabalho de conclusão de curso. Ele
          ajuda você a organizar suas finanças pessoais (transações, metas, dívidas e patrimônio) e a aprender sobre
          educação financeira.
        </p>
        <p>
          Por ser um projeto de estudo, o serviço pode ser alterado, interrompido ou desativado, e os dados guardados
          nele podem ser apagados quando o projeto terminar. Se isso for acontecer, avisaremos pelo próprio site
          sempre que possível. Você pode baixar uma cópia das suas transações e categorias a qualquer momento, pelo
          painel "Exportar / Importar" do Dashboard.
        </p>
      </LegalSection>

      <LegalSection title="2. Quem pode usar">
        <p>
          O Mind Money é destinado a pessoas com 18 anos ou mais. Se você é menor de idade, só use com a autorização
          e o acompanhamento de um responsável.
        </p>
      </LegalSection>

      <LegalSection title="3. Sua conta">
        <LegalList>
          <li>Informe dados verdadeiros no cadastro e mantenha-os atualizados.</li>
          <li>Sua senha é pessoal. Não a compartilhe: tudo o que for feito na sua conta é de sua responsabilidade.</li>
          <li>Se suspeitar que alguém acessou sua conta, troque a senha em Perfil e encerre as outras sessões.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. O que o Mind Money faz, e o que não faz">
        <p>
          O Mind Money organiza as informações que <strong className="text-ink">você mesmo digita</strong> e calcula
          resultados a partir delas: saldo, score financeiro, alertas, conselhos sobre dívidas e simulações.
        </p>
        <LegalList>
          <li>Ele não é banco, corretora nem consultoria financeira, e não movimenta dinheiro.</li>
          <li>Ele não se conecta às suas contas bancárias: tudo depende do que você cadastra.</li>
          <li>
            Score, alertas, conselhos e calculadoras seguem regras automáticas e dão estimativas com fins
            educativos. Não são recomendação personalizada de investimento, crédito ou qualquer outra decisão.
          </li>
          <li>As decisões financeiras são suas. Em caso de dúvida, procure um profissional qualificado.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="5. Seus dados continuam sendo seus">
        <p>
          O que você cadastra no Mind Money continua pertencendo a você. Nós só usamos esses dados para fazer o
          serviço funcionar para você, conforme explicado na{" "}
          <Link to="/privacidade" className="font-medium text-brand-deep underline underline-offset-2 hover:text-brand">
            Política de Privacidade
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="6. Uso permitido">
        <p>Ao usar o Mind Money, você concorda em não:</p>
        <LegalList>
          <li>tentar acessar contas ou dados de outras pessoas;</li>
          <li>tentar burlar, testar sem autorização ou derrubar a segurança e o funcionamento do serviço;</li>
          <li>enviar arquivos ou conteúdos maliciosos, ou usar o serviço de forma automatizada que sobrecarregue o sistema;</li>
          <li>usar o serviço para qualquer atividade ilegal.</li>
        </LegalList>
        <p>Contas que violarem estas regras podem ser suspensas ou excluídas.</p>
      </LegalSection>

      <LegalSection title="7. Disponibilidade">
        <p>
          O serviço é oferecido "como está". Ele roda em hospedagem gratuita, então pode ficar lento ou fora do ar,
          principalmente no primeiro acesso depois de um período sem uso. Fazemos o possível para manter tudo
          funcionando, mas não garantimos disponibilidade contínua nem ausência de erros. Por isso, vale exportar uma
          cópia dos seus dados de tempos em tempos.
        </p>
      </LegalSection>

      <LegalSection title="8. Encerrar sua conta">
        <p>
          Você pode excluir sua conta quando quiser, em Perfil, na aba de exclusão de conta. A exclusão apaga seus
          dados de forma definitiva e não pode ser desfeita.
        </p>
      </LegalSection>

      <LegalSection title="9. Responsabilidade">
        <p>
          Dentro do que a lei permite, os criadores do Mind Money não respondem por perdas ou prejuízos decorrentes de
          decisões tomadas com base nos resultados do sistema, de indisponibilidade do serviço ou de perda de dados.
          Isso não afasta direitos que a lei garante a você e que não podem ser limitados por contrato.
        </p>
      </LegalSection>

      <LegalSection title="10. Mudanças nestes termos">
        <p>
          Podemos atualizar estes termos. A data da última atualização aparece no topo desta página. Quando a mudança
          for relevante, vamos avisar no site. Continuar usando o Mind Money depois do aviso significa que você
          concorda com a nova versão.
        </p>
      </LegalSection>

      <LegalSection title="11. Lei aplicável e contato">
        <p>
          Estes termos seguem as leis do Brasil. Para dúvidas, veja a seção de contato da{" "}
          <Link to="/privacidade#contato" className="font-medium text-brand-deep underline underline-offset-2 hover:text-brand">
            Política de Privacidade
          </Link>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
