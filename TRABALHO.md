# Trabalho — CRUD de 4 Tabelas

## Objetivo

Construir uma aplicação completa com **CRUD de 4 tabelas**, contemplando back-end
(API REST) e front-end (interface web). O tema da aplicação é livre.

## Requisitos

### 1. Quatro tabelas com CRUD completo

Cada uma das 4 tabelas deve ter as quatro operações implementadas de ponta a ponta:

| Operação | Verbo HTTP | Rota                  |
| -------- | ---------- | --------------------- |
| Criar    | `POST`     | `/recurso`            |
| Listar   | `GET`      | `/recurso`            |
| Consultar| `GET`      | `/recurso/{id}`       |
| Editar   | `PUT`      | `/recurso/{id}`       |
| Apagar   | `DELETE`   | `/recurso/{id}`       |

Para cada tabela, a implementação deve incluir as camadas:

- **Modelo** (entidade JPA)
- **Repositório**
- **DTOs** (criar e atualizar)
- **Service**
- **Controller**

### 2. Progressão de campos

A **primeira tabela deve ter 2 campos**. A partir dela, **cada tabela seguinte
acrescenta 2 campos** em relação à anterior:

| Tabela | Campos mínimos |
| ------ | -------------- |
| 1ª     | 2              |
| 2ª     | 4              |
| 3ª     | 6              |
| 4ª     | 8              |

**Não há limite máximo de campos por tabela** — o número indicado é o mínimo.
Uma tabela pode ter mais campos do que o exigido.

### 3. Tema livre

O domínio da aplicação fica a critério de cada um (helpdesk, biblioteca, loja,
academia, etc.). O que é avaliado é a estrutura do CRUD, não o tema escolhido.

### 4. Front-end

O front-end deve ser **gerado com auxílio de IA** e usar **exclusivamente
HTML, CSS e JavaScript**.

Não é permitido usar frameworks ou bibliotecas de front-end (React, Vue, Angular,
Bootstrap, jQuery, etc.) — apenas HTML, CSS e JavaScript puros.

### 5. Apresentação

Serão **sorteadas algumas pessoas** para apresentar o trabalho.
O número de sorteados será definido pelo professor.

Prepare-se para, na apresentação:

- Demonstrar o CRUD das 4 tabelas funcionando no front-end
- Explicar o modelo de dados e a relação entre as tabelas
- Percorrer o código de uma tabela, camada por camada

## Checklist de entrega

- [ ] Tabela 1 — CRUD completo, mínimo 2 campos
- [ ] Tabela 2 — CRUD completo, mínimo 4 campos
- [ ] Tabela 3 — CRUD completo, mínimo 6 campos
- [ ] Tabela 4 — CRUD completo, mínimo 8 campos
- [ ] Front-end em HTML/CSS/JS puro, cobrindo as 4 tabelas
- [ ] Projeto versionado no Git e publicado no GitHub
