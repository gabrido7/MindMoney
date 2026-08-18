# Auditoria de Segurança — Mind Money (Etapa 16)

Revisão de código real (não só checklist) sobre backend, frontend e banco.
Cada item abaixo foi verificado no código, não presumido.

## Verificado e correto (sem alteração necessária)

- **SQL Injection**: toda query em todos os repositories usa `pool.query()`
  com placeholders `?` e um array de parâmetros — inclusive o único ponto
  com WHERE dinâmico (`transactions.repository.ts#list`), onde só
  fragmentos de SQL fixos são concatenados, nunca valores do usuário.
- **XSS**: nenhum uso de `dangerouslySetInnerHTML`/`innerHTML` em todo o
  frontend — toda renderização passa pelo escape automático do JSX.
- **CSRF**: não aplicável na forma clássica — autenticação é via header
  `Authorization: Bearer`, não cookie, então não há envio automático de
  credencial por um site de terceiros.
- **Autorização / IDOR**: toda query de leitura/escrita em todo módulo
  filtra por `user_id` vindo do JWT (nunca do corpo da requisição);
  subcategoria verifica a categoria-mãe antes de agir nela. Testado com
  chamadas HTTP reais entre dois usuários em várias etapas anteriores
  (transactions, categories, goals, notifications) — reconfirmado por
  leitura de código nesta auditoria.
- **Senhas**: hash com bcrypt (12 rounds), nunca texto puro, nunca
  retornada em nenhuma resposta da API (`toPublicUser` sempre filtra).
- **Endpoints desprotegidos**: todos os 8 módulos de recurso usam
  `requireAuth`; só `/health` e `POST /api/auth/register|login` são
  públicos, por design.
- **Secrets no código**: nenhuma chave/senha hardcoded encontrada (grep
  dedicado); `.env` nunca foi commitado (confirmado no histórico do git);
  `.env.example` só tem placeholders.
- **CORS**: restrito à origem configurada (`CORS_ORIGIN`), não wildcard.
- **Logs**: erros não tratados são logados só no servidor
  (`console.error`); a resposta ao cliente nunca inclui stack trace,
  sempre uma mensagem genérica.
- **localStorage**: só guarda o token JWT e a preferência de tema — dados
  financeiros saíram de lá desde a etapa 8.

## Corrigido nesta etapa

- **Dependências vulneráveis (frontend)**: `npm audit` acusava 12
  vulnerabilidades (2 low, 10 high) — a mais relevante era
  `react-router-dom` (usado em produção; as outras eram `vite`/`postcss`/
  `picomatch`, ferramentas de build que não vão pro bundle final, mas
  corrigidas mesmo assim). Todas as correções couberam dentro do range de
  versão já declarado no `package.json` (`npm update`, sem breaking
  change) — build e todos os fluxos testados de novo depois. Resultado:
  0 vulnerabilidades. Backend já estava em 0.
- **Sem rate limiting em login/cadastro**: endpoints mais visados por
  força bruta e spam de contas não tinham nenhum limite de tentativas.
  Adicionado `express-rate-limit`: 30 tentativas/15min por IP em
  `/api/auth/*`, e um limite geral de 300/15min no resto da API
  autenticada como defesa adicional de baixo custo.
- **Dependência desnecessária**: `@types/react-router-dom` (pacote de
  tipos para a v5 da lib) removida — a v7, já em uso, tem tipos próprios.

## Decisão consciente (não é uma falha, é um trade-off documentado)

- **Token JWT em localStorage, não em cookie httpOnly**: localStorage é
  legível por qualquer script rodando na página (risco em caso de XSS);
  cookie httpOnly não é (mas troca esse risco por exigir proteção contra
  CSRF). Como não há nenhum `dangerouslySetInnerHTML`/`innerHTML` no
  projeto (verificado acima), a superfície de XSS hoje é praticamente
  nula, então o risco prático de escolher localStorage é baixo agora.
  Migrar para cookie httpOnly é uma melhoria válida para uma eventual
  produção real, mas exigiria mudanças de CORS (`credentials`), um
  esquema de proteção CSRF, e mudar o `services/api.ts` — escopo maior do
  que uma correção pontual de auditoria, registrado aqui para uma
  decisão futura consciente, não escondido.
- **JWT sem refresh token, expira em 7 dias**: um token roubado continua
  válido até expirar. Aceitável para o estágio atual do projeto; refresh
  tokens de curta duração seriam o próximo passo antes de produção real.

## Não aplicável neste projeto

- Exposição de dados de outros usuários em endpoint público: não há
  endpoint público que retorne dado de usuário nenhum (só register/login,
  que não vazam se um e-mail já existe — a mensagem de erro é genérica
  em ambos os casos, testado na etapa 7).
