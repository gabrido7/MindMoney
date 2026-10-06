import { Link } from "react-router-dom";
import LegalLayout, { ExternalLink, LegalList, LegalSection } from "../features/legal/components/LegalLayout";
import { CONTACT_URL } from "../features/legal/legalInfo";

export default function Privacy() {
  return (
    <LegalLayout
      title="Política de Privacidade"
      intro="Aqui explicamos, sem juridiquês, quais dados o Mind Money guarda sobre você, para que usamos, com quem eles passam e como você pode controlá-los. Seguimos a Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018)."
    >
      <LegalSection title="1. Quem é responsável pelos seus dados">
        <p>
          O Mind Money é um projeto acadêmico de conclusão de curso. Os responsáveis pelo tratamento dos dados são os
          estudantes autores do projeto (veja a seção "Criadores" na página inicial). Como não somos uma empresa, não há
          um encarregado de dados formal; o canal de contato está na seção 10.
        </p>
      </LegalSection>

      <LegalSection title="2. Quais dados guardamos">
        <p className="font-medium text-ink">Que você informa no cadastro:</p>
        <LegalList>
          <li>nome, e-mail e senha. A senha nunca é guardada como você digitou: só um código irreversível (hash) dela;</li>
          <li>a confirmação de que você aceitou estes textos, com a data e a versão aceita.</li>
        </LegalList>
        <p className="font-medium text-ink">Que você cadastra ao usar o sistema:</p>
        <LegalList>
          <li>
            transações, categorias, contas, patrimônio, dívidas, metas e orçamentos, ou seja, as suas informações
            financeiras;
          </li>
          <li>
            seu perfil financeiro e respostas do onboarding (por exemplo, experiência, prioridades, fontes de renda e
            hábitos), preferências de notificação e de aparência;
          </li>
          <li>seu progresso nas aulas, pontos, conquistas e favoritos;</li>
          <li>a foto de perfil, se você enviar uma.</li>
        </LegalList>
        <p className="font-medium text-ink">Que o sistema registra sozinho:</p>
        <LegalList>
          <li>
            para cada sessão aberta, a data e o navegador/aparelho usado, que aparecem em Perfil para você poder
            encerrar sessões que não reconhece;
          </li>
          <li>
            registros técnicos do servidor, com o tipo e o endereço de cada requisição (que pode incluir filtros, como
            o mês ou um termo de busca) e o resultado, mas sem o conteúdo dos seus lançamentos. O provedor de hospedagem também pode registrar o endereço IP de quem acessa;
          </li>
          <li>o endereço IP, mantido apenas na memória do servidor, para limitar tentativas excessivas de login.</li>
        </LegalList>
        <p className="font-medium text-ink">Newsletter (opcional):</p>
        <LegalList>
          <li>se você se inscrever no formulário da página inicial, guardamos o nome e o e-mail informados.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="3. Para que usamos seus dados">
        <LegalList>
          <li>
            <strong className="text-ink">Fazer o serviço funcionar:</strong> mostrar seus saldos, gráficos, score,
            alertas e conselhos, calculados a partir do que você cadastrou.
          </li>
          <li>
            <strong className="text-ink">Manter a conta segura:</strong> autenticar você, limitar abusos e investigar
            problemas.
          </li>
          <li>
            <strong className="text-ink">Enviar novidades do projeto:</strong> somente se você se inscreveu na
            newsletter.
          </li>
        </LegalList>
        <p>
          Não vendemos seus dados, não os usamos para publicidade e não os usamos para treinar sistemas de
          inteligência artificial. O Mind Money não usa nenhuma IA externa.
        </p>
      </LegalSection>

      <LegalSection title="4. Com quem os dados passam">
        <p>
          Não compartilhamos seus dados com terceiros para fins próprios deles. Para o site funcionar, usamos
          empresas de infraestrutura que tratam os dados em nosso nome:
        </p>
        <LegalList>
          <li>Vercel: hospedagem das páginas do site;</li>
          <li>Render: hospedagem do servidor (a API) do Mind Money;</li>
          <li>Aiven: hospedagem do banco de dados, onde ficam as informações da sua conta.</li>
        </LegalList>
        <p>
          Esses provedores podem armazenar ou processar dados em servidores fora do Brasil. Além deles, o site carrega
          as fontes de letra do Google Fonts, o que faz o seu navegador contatar o Google (que então vê o seu endereço
          IP) ao abrir as páginas. Fora isso, só entregamos dados se uma autoridade exigir por lei.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies e armazenamento no navegador">
        <p>
          O Mind Money não usa cookies de rastreamento, nem ferramentas de análise de audiência, nem publicidade. Ele
          guarda no próprio navegador (armazenamento local) apenas o que é necessário para funcionar: as chaves da
          sua sessão de login, sua preferência de tema e o estado do menu lateral. Ao sair da conta, as chaves de
          sessão são removidas.
        </p>
      </LegalSection>

      <LegalSection title="6. Segurança">
        <LegalList>
          <li>A comunicação com o site e com a API é criptografada (HTTPS).</li>
          <li>Senhas são guardadas apenas como hash; as sessões usam chaves de curta duração que podem ser revogadas.</li>
          <li>Cada consulta ao banco é restrita à conta de quem está logado: ninguém vê os dados de outra pessoa.</li>
          <li>As páginas têm proteções contra injeção de código e há limite de tentativas de login.</li>
        </LegalList>
        <p>
          Nenhum sistema é totalmente imune a falhas. Se descobrirmos um incidente que possa afetar seus dados,
          avisaremos pelo site e pelos meios que tivermos para falar com você.
        </p>
      </LegalSection>

      <LegalSection title="7. Por quanto tempo guardamos">
        <LegalList>
          <li>
            Os dados da conta ficam guardados enquanto ela existir. Ao excluir a conta (Perfil), seus dados são
            apagados definitivamente do banco: transações, metas, dívidas, patrimônio, progresso, foto e sessões.
            Cópias de segurança automáticas do provedor do banco, se existirem, são descartadas por ele no seu próprio
            ciclo.
          </li>
          <li>Dados da newsletter ficam até você pedir a remoção.</li>
          <li>
            Como o Mind Money é um projeto acadêmico, ele pode ser encerrado. Nesse caso, os dados guardados serão
            apagados.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="8. Seus direitos">
        <p>Pela LGPD, você pode a qualquer momento:</p>
        <LegalList>
          <li>
            <strong className="text-ink">Ver e corrigir seus dados:</strong> tudo o que você cadastrou aparece nas
            telas do sistema, e nome e e-mail podem ser editados em Perfil.
          </li>
          <li>
            <strong className="text-ink">Levar uma cópia:</strong> o painel "Exportar / Importar" do Dashboard baixa
            suas transações e categorias em JSON ou CSV.
          </li>
          <li>
            <strong className="text-ink">Apagar tudo:</strong> a exclusão de conta em Perfil remove seus dados e
            encerra o seu consentimento.
          </li>
          <li>
            <strong className="text-ink">Pedir informação, remoção da newsletter ou esclarecimentos</strong> pelo
            contato da seção 10.
          </li>
          <li>
            <strong className="text-ink">Reclamar à Autoridade Nacional de Proteção de Dados (ANPD)</strong> se achar
            que seus direitos não foram respeitados.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="9. Crianças e adolescentes">
        <p>
          O Mind Money é destinado a maiores de 18 anos. Não coletamos dados de menores de propósito. Se descobrirmos
          uma conta nessa situação sem autorização de um responsável, ela poderá ser excluída.
        </p>
      </LegalSection>

      <section id="contato" className="flex scroll-mt-6 flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">10. Contato</h2>
        <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-ink-soft">
          <p>
            Quase tudo você resolve sozinho no sistema (corrigir dados, exportar, excluir a conta). Para dúvidas ou
            pedidos que não dê para fazer por lá, abra uma solicitação na página do projeto:{" "}
            <ExternalLink href={CONTACT_URL}>{CONTACT_URL}</ExternalLink>.
          </p>
          <p>
            Essa página é pública. <strong className="text-ink">Não escreva ali dados pessoais ou financeiros</strong>,
            nem sua senha: descreva só o assunto, e a equipe orienta como seguir.
          </p>
        </div>
      </section>

      <LegalSection title="11. Mudanças nesta política">
        <p>
          Podemos atualizar esta política. A data da última atualização aparece no topo da página, e mudanças
          relevantes serão avisadas no site. Veja também os{" "}
          <Link to="/termos" className="font-medium text-brand-deep underline underline-offset-2 hover:text-brand">
            Termos de Uso
          </Link>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
