# PROGRESSO

Estado atual do projeto. Atualize ao fim de cada tarefa grande: mova o que
foi feito para "Feito recentemente", ajuste "Pendências" e apague o que ficou
velho (histórico completo fica no `git log`).

*Última atualização: 06/10/2026*

## Contexto atual

A apresentação na escola (25/09) já passou. Próximo marco: **banca do TCC,
prevista para o fim de novembro/2026**, apresentada **rodando localmente** no
notebook, com a tela na TV (os avaliadores não usam o site). Por isso a
produção está sendo desativada (06/10). Revisão comparativa com a auditoria
de 25/08 (06/10):
https://claude.ai/artifact/K3saGQbTGks3dtkfBZUfQW

## Feito recentemente

- **06/10: tirando do ar.** Keep-alive removido do repositório. Falta fazer
  nos painéis (usuário): apagar o MySQL no Aiven (some com os dados dos
  visitantes), suspender/apagar o `mindmoney-backend` no Render e
  apagar/pausar o `mindmoney-frontend` no Vercel.
- **06/10:** a redefinição de senha não devolve mais o token em produção
  (`PASSWORD_RESET_DEMO`, desligado por padrão com `NODE_ENV=production`).
  Antes, qualquer um trocava a senha de qualquer conta sabendo o e-mail.
  Corrigido também o `score.test.ts`, que falhava sozinho fora de setembro.
- **06/10 (UI):** sidebar fixa ao rolar, rolagem interna nas listas, card do
  Assistente removido do Dashboard, Educação Financeira em 2º na sidebar.
- **25 contas de demonstração criadas em produção (23/09)** pelo
  `backend/scripts/seed-demo.ts`, rodado pelo usuário: `lab01`–`lab25@mindmoney.demo`,
  mesma senha, lista em Downloads/contas-demonstracao.txt (fora do repo).
  lab01–lab20 nos PCs do laboratório, lab21–lab25 de reserva. Mais contas:
  rodar o script com outro `--prefix`.
- **Remote Control ativado** na sessão do Claude Code, para pedir ajuda pelo
  celular na sexta (PC de casa ligado, sem suspensão, app aberto). Folha de
  emergência para celular: Downloads/Emergencia-MindMoney.pdf.

- **Preparação para o laboratório (23/09):** `trust proxy` em produção e rate
  limit configurável por env, com padrão de 6000 ações e 200 logins a cada
  15 min por IP (antes, 300/30 travariam o laboratório inteiro, que sai pelo
  mesmo IP). Publicado e confirmado em produção. Teste de carga com 20 usuários
  simultâneos no `/health`: 1613 requisições em 45 s, zero falhas, mediana
  ~250 ms.
- **Keep-alive (23/09):** workflow do GitHub Actions visita o `/health` a cada
  10 min, para o Aiven não desligar o banco nem o Render dormir.
- **Incidente (22/09):** o Aiven gratuito desligou o banco em menos de 24 h sem
  uso; como o servidor só sobe com banco, login e cadastro pararam. Religado
  manualmente em 23/09.
- **Materiais da apresentação:** cartaz A4 (versões branca, verde e branca com
  logo; a equipe vai imprimir a branca), slide para a TV, guia em PDF de
  publicação/problemas/lembretes e CSV de dados de exemplo para as contas de
  demonstração (arquivos na pasta Downloads do usuário, fora do repositório).
- **Deploy na nuvem (21/09):** frontend no Vercel, backend no Render, banco no
  Aiven, todos no plano gratuito, sem cartão cadastrado.
- **Etapas 44 a 48:** Central de Dívidas, Meta unificada com Objetivo, cartão
  de crédito parcelado, contas/carteiras múltiplas e Central de Ativos, plano
  estratégico na Educação Financeira.

## Pendências

- [ ] Apagar/suspender Aiven, Render e Vercel nos painéis (ver acima).
- [ ] Antes da banca: no notebook da apresentação, conferir MySQL do XAMPP,
  backend e frontend locais, e rodar `backend/scripts/seed-demo.ts` contra o
  banco local para ter uma conta de demonstração com dados.
- [ ] Se republicar no futuro: avatares fora do disco do Render, cabeçalhos
  de segurança no `vercel.json`, termos de uso/privacidade, recriar o
  keep-alive.

## Pontos de atenção

- Apresentação local: o MySQL do XAMPP precisa estar ligado (sem ele o
  backend nem sobe). Testes do backend também dependem dele.
- `score.test.ts`, `insights.test.ts` e `objectives.test.ts` travam o relógio
  com `vi.setSystemTime`; testes com mês fixo e sem relógio travado quebram
  sozinhos quando o mês vira.
