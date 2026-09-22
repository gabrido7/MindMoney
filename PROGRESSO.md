# PROGRESSO

Estado atual do projeto. Atualize ao fim de cada tarefa grande: mova o que
foi feito para "Feito recentemente", ajuste "Pendências" e apague o que ficou
velho (histórico completo fica no `git log`).

*Última atualização: 22/09/2026*

## Contexto atual

Apresentação do projeto na escola na **sexta-feira, 25/09/2026**, para alunos
de outras escolas que não são da área de TI. A apresentação terá slides
(teoria) e o site no ar (prática).

## Feito recentemente

- **Etapas 44 a 48:** Central de Dívidas com motor de conselhos; Meta unificada
  com Objetivo (tabela `saving_goals` removida); cartão de crédito parcelado;
  contas/carteiras múltiplas e Central de Ativos com patrimônio líquido; plano
  estratégico personalizado na trilha de Educação Financeira.
- **Polimento de UI:** nível de XP removido da sidebar; scroll interno nos cards
  com lista.
- **Deploy na nuvem (21/09):** frontend no Vercel, backend no Render, banco no
  Aiven, todos no plano gratuito, sem cartão cadastrado. Vercel e Render
  conectados ao GitHub (push na `master` publica sozinho). Cadastros reais já
  estão sendo gravados no banco de produção.
- **Slides da apresentação:** 9 telas com a identidade visual do MindMoney.
  Logo só na capa.
- **Landing page:** fotos dos criadores removidas; o carrossel mostra só nome,
  cargo e bio.

## Pendências

- [ ] **Bloquear usuários específicos por e-mail** — pedido em 21/09. Ainda não
  existe no projeto; precisa ser criado no backend (recusar cadastro e login
  de e-mails bloqueados). Aguardando o(s) e-mail(s) a bloquear. Mexe no fluxo
  de login: fazer com calma e testar bem, não em cima da apresentação.
- [ ] **Proteger o código contra cópia** — o repositório no GitHub está
  **público**. Recomendado: (1) deixá-lo privado, o que exige reconectar o
  Render com autorização do GitHub (o Vercel já tem acesso autorizado);
  (2) adicionar um arquivo de licença "todos os direitos reservados".
  Aguardando decisão.
- [ ] Definir um "congelamento" antes da apresentação (ex.: quinta à noite),
  depois do qual nada mais é alterado no site.

## Pontos de atenção

- **Render dorme após ~15 min sem uso:** a primeira requisição pode levar até
  ~1 minuto. No dia da apresentação, abra o site e faça login **5 a 10 minutos
  antes**.
- **Aiven pode desligar após muitos dias sem uso:** na véspera ou na manhã da
  apresentação, confira no painel do Aiven se o serviço está "Running".
- O painel do Aiven não mostra as tabelas do MySQL; para ver os dados, use um
  cliente como o HeidiSQL.
- O MySQL do XAMPP falha ao conectar no Aiven (erro `caching_sha2_password`);
  use outro cliente.
- Às vezes o `git push` é bloqueado para o Claude; nesse caso, o usuário roda o
  push manualmente.
