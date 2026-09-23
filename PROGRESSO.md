# PROGRESSO

Estado atual do projeto. Atualize ao fim de cada tarefa grande: mova o que
foi feito para "Feito recentemente", ajuste "Pendências" e apague o que ficou
velho (histórico completo fica no `git log`).

*Última atualização: 23/09/2026*

## Contexto atual

Apresentação do projeto na escola na **sexta-feira, 25/09/2026**, para alunos
de outras escolas que não são da área de TI. Haverá um cartaz A4 num expositor
e o site aberto em **~20 computadores de um laboratório** para os visitantes
testarem com as próprias mãos, cada PC logado numa conta de demonstração.

## Feito recentemente

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

- [ ] Equipe cria as contas de demonstração (1 por PC + 3 ou 4 reservas) e
  importa em cada uma o `MindMoney-dados-demonstracao.csv` (Dashboard →
  importar CSV).
- [ ] Congelamento na quinta à noite: nada mais é alterado no site.
- [ ] Opcional, depois da apresentação: conectar o Render à GitHub App para ter
  deploy automático.

## Pontos de atenção

- **O Render não publica sozinho:** mudança no backend exige **Manual Deploy**
  no painel do Render (ver CLAUDE.md). O Vercel publica sozinho.
- **Aiven gratuito desliga o banco por inatividade:** o keep-alive deve evitar;
  na véspera, confira se o serviço está "Running" e se o `/health` mostra
  `"status":"ok"`.
- Carga testada só no `/health` (sem login); telas autenticadas não foram
  testadas sob carga.
- Contas de demonstração nos PCs: visitantes podem trocar a senha ou excluir a
  conta pelo Perfil. Ter contas reserva.
- O painel do Aiven não mostra as tabelas do MySQL; use o HeidiSQL. O MySQL do
  XAMPP falha ao conectar no Aiven (`caching_sha2_password`).
