const API_BASE = "http://localhost:8080";

/* ---------------- Helpers ---------------- */

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

function formatDate(isoString) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  return date.toLocaleString("pt-BR");
}

const toastContainer = document.getElementById("toast-container");

function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = "toast" + (type ? " " + type : "");
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

async function apiRequest(path, options) {
  const response = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    let message = `Erro ${response.status}`;
    try {
      const body = await response.json();
      // Bean Validation devolve os erros de campo em "errors"
      if (Array.isArray(body.errors) && body.errors.length > 0) {
        message = body.errors
          .map((e) => `${e.field}: ${e.defaultMessage}`)
          .join(" | ");
      } else {
        message = body.message || body.error || message;
      }
    } catch {
      // ignore body parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/* ---------------- Ícones ---------------- */

const ICON_PLUS = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
const ICON_REFRESH = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>';
const ICON_EDIT = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
const ICON_DELETE = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>';

/* ---------------- Colunas reutilizáveis ---------------- */

const colunaId = {
  label: "ID",
  cell: (registro) => `<span class="id-chip">#${registro.id}</span>`,
};

const colunaNome = {
  label: "Nome",
  className: "nome-cell",
  cell: (registro) => escapeHtml(registro.nome),
};

const colunaCriadoEm = {
  label: "Criado em",
  cell: (registro) => formatDate(registro.criadoEm),
};

// O back-end usa "ativa" para categoria e "ativo" para usuário
function colunaStatus(chave) {
  return {
    label: "Status",
    cell: (registro) => {
      const ativo = registro[chave];
      const classe = ativo ? "badge-ativa" : "badge-inativa";
      const texto = ativo ? "Ativo" : "Inativo";
      return `<span class="badge ${classe}">${texto}</span>`;
    },
  };
}

/* ---------------- Configuração dos recursos ---------------- */

const RESOURCES = [
  {
    key: "categorias",
    path: "/categorias",
    tabLabel: "Categorias",
    listTitle: "Categorias cadastradas",
    formSubtitle: "Preencha os campos abaixo para cadastrar uma categoria",
    novoTitulo: "Nova categoria",
    editarTitulo: (id) => `Editar categoria #${id}`,
    submitNovo: "Criar categoria",
    contagem: (n) => `${n} categoria${n === 1 ? "" : "s"} no total`,
    vazio: "Nenhuma categoria cadastrada ainda.",
    msgCriado: "Categoria criada com sucesso.",
    msgAtualizado: "Categoria atualizada com sucesso.",
    msgApagado: "Categoria apagada com sucesso.",
    confirmTitulo: "Apagar categoria",
    confirmMensagem: "Essa ação não pode ser desfeita. Deseja realmente apagar esta categoria?",
    fields: [
      {
        name: "nome",
        label: "Nome",
        type: "text",
        required: true,
        minlength: 2,
        maxlength: 60,
        placeholder: "Ex: Eletrônicos",
        hint: "Entre 2 e 60 caracteres",
      },
      {
        name: "descricao",
        label: "Descrição",
        type: "textarea",
        maxlength: 255,
        placeholder: "Descrição opcional",
        hint: "Até 255 caracteres",
        wide: true,
      },
    ],
    columns: [
      colunaId,
      colunaNome,
      {
        label: "Descrição",
        className: "wrap",
        cell: (registro) => escapeHtml(registro.descricao) || "-",
      },
      colunaStatus("ativa"),
      colunaCriadoEm,
    ],
  },
  {
    key: "usuarios",
    path: "/usuarios",
    tabLabel: "Usuários",
    listTitle: "Usuários cadastrados",
    formSubtitle: "Preencha os campos abaixo para cadastrar um usuário",
    novoTitulo: "Novo usuário",
    editarTitulo: (id) => `Editar usuário #${id}`,
    submitNovo: "Criar usuário",
    contagem: (n) => `${n} usuário${n === 1 ? "" : "s"} no total`,
    vazio: "Nenhum usuário cadastrado ainda.",
    msgCriado: "Usuário criado com sucesso.",
    msgAtualizado: "Usuário atualizado com sucesso.",
    msgApagado: "Usuário apagado com sucesso.",
    confirmTitulo: "Apagar usuário",
    confirmMensagem: "Essa ação não pode ser desfeita. Deseja realmente apagar este usuário?",
    fields: [
      {
        name: "nome",
        label: "Nome",
        type: "text",
        required: true,
        minlength: 2,
        maxlength: 100,
        placeholder: "Ex: Maria Silva",
        hint: "Entre 2 e 100 caracteres",
      },
      {
        name: "email",
        label: "E-mail",
        type: "email",
        required: true,
        maxlength: 150,
        placeholder: "maria@example.com",
        hint: "E-mail válido e único",
        wide: true,
      },
    ],
    columns: [
      colunaId,
      colunaNome,
      {
        label: "E-mail",
        className: "wrap",
        cell: (registro) => escapeHtml(registro.email) || "-",
      },
      colunaStatus("ativo"),
      colunaCriadoEm,
    ],
  },
];

/* ---------------- Modal de confirmação (compartilhado) ---------------- */

const confirmDialog = document.getElementById("confirm-dialog");
const confirmTitle = document.getElementById("confirm-title");
const confirmMessage = document.getElementById("confirm-message");
const confirmYes = document.getElementById("confirm-yes");
const confirmNo = document.getElementById("confirm-no");

let onConfirm = null;

function pedirConfirmacao({ titulo, mensagem, aoConfirmar }) {
  confirmTitle.textContent = titulo;
  confirmMessage.textContent = mensagem;
  onConfirm = aoConfirmar;
  confirmDialog.hidden = false;
}

function fecharConfirmacao() {
  onConfirm = null;
  confirmDialog.hidden = true;
}

confirmNo.addEventListener("click", fecharConfirmacao);

confirmYes.addEventListener("click", () => {
  const acao = onConfirm;
  fecharConfirmacao();
  if (acao) acao();
});

/* ---------------- Montagem de um painel de CRUD ---------------- */

function montarCampo(field) {
  const attrs = [
    `id="${field.name}"`,
    `name="${field.name}"`,
    field.required ? "required" : "",
    field.minlength ? `minlength="${field.minlength}"` : "",
    field.maxlength ? `maxlength="${field.maxlength}"` : "",
    field.placeholder ? `placeholder="${field.placeholder}"` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const control =
    field.type === "textarea"
      ? `<textarea ${attrs} rows="1"></textarea>`
      : `<input type="${field.type}" ${attrs} />`;

  return `
    <div class="field${field.wide ? " field-wide" : ""}">
      <label for="${field.name}">${field.label}${field.required ? ' <span class="required">*</span>' : ""}</label>
      ${control}
      ${field.hint ? `<small class="hint">${field.hint}</small>` : ""}
    </div>
  `;
}

function criarPainel(config) {
  const panel = document.createElement("section");
  panel.className = "panel";
  panel.id = `panel-${config.key}`;
  panel.hidden = true;

  panel.innerHTML = `
    <div class="card form-card">
      <div class="card-head">
        <div>
          <h2 data-role="form-title">${config.novoTitulo}</h2>
          <p class="card-subtitle">${config.formSubtitle}</p>
        </div>
      </div>

      <form data-role="form" novalidate>
        <input type="hidden" data-role="id" />
        <div class="form-grid">
          ${config.fields.map(montarCampo).join("")}
        </div>
        <div class="actions">
          <button type="submit" class="btn btn-primary" data-role="submit">
            ${ICON_PLUS}<span>${config.submitNovo}</span>
          </button>
          <button type="button" class="btn btn-ghost" data-role="cancel" hidden>Cancelar</button>
        </div>
      </form>
    </div>

    <div class="card">
      <div class="card-head">
        <div>
          <h2>${config.listTitle}</h2>
          <p class="card-subtitle" data-role="count">Carregando...</p>
        </div>
        <button type="button" class="btn btn-ghost btn-icon-only" data-role="refresh" title="Atualizar lista">
          ${ICON_REFRESH}
        </button>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              ${config.columns.map((c) => `<th>${c.label}</th>`).join("")}
              <th class="col-actions">Ações</th>
            </tr>
          </thead>
          <tbody data-role="tbody">
            <tr><td colspan="${config.columns.length + 1}" class="empty">Carregando...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  const form = panel.querySelector('[data-role="form"]');
  const idInput = panel.querySelector('[data-role="id"]');
  const formTitle = panel.querySelector('[data-role="form-title"]');
  const submitBtn = panel.querySelector('[data-role="submit"]');
  const submitLabel = submitBtn.querySelector("span");
  const cancelBtn = panel.querySelector('[data-role="cancel"]');
  const refreshBtn = panel.querySelector('[data-role="refresh"]');
  const tbody = panel.querySelector('[data-role="tbody"]');
  const count = panel.querySelector('[data-role="count"]');
  const colspan = config.columns.length + 1;

  function resetForm() {
    form.reset();
    idInput.value = "";
    formTitle.textContent = config.novoTitulo;
    submitLabel.textContent = config.submitNovo;
    cancelBtn.hidden = true;
  }

  function preencherParaEdicao(registro) {
    idInput.value = registro.id;
    config.fields.forEach((field) => {
      form.elements[field.name].value = registro[field.name] ?? "";
    });
    formTitle.textContent = config.editarTitulo(registro.id);
    submitLabel.textContent = "Salvar alterações";
    cancelBtn.hidden = false;
    form.elements[config.fields[0].name].focus();
  }

  function renderRows(registros) {
    if (!registros || registros.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty">${config.vazio}</td></tr>`;
      count.textContent = config.contagem(0);
      return;
    }

    count.textContent = config.contagem(registros.length);

    tbody.innerHTML = registros
      .map((registro) => {
        const celulas = config.columns
          .map((c) => `<td${c.className ? ` class="${c.className}"` : ""}>${c.cell(registro)}</td>`)
          .join("");

        return `
          <tr data-id="${registro.id}">
            ${celulas}
            <td>
              <div class="row-actions">
                <button type="button" class="row-btn edit" data-action="edit" title="Editar">${ICON_EDIT}</button>
                <button type="button" class="row-btn delete" data-action="delete" title="Apagar">${ICON_DELETE}</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  async function carregar() {
    tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty">Carregando...</td></tr>`;
    count.textContent = "Carregando...";
    try {
      renderRows(await apiRequest(config.path));
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty">Erro ao carregar: ${escapeHtml(err.message)}</td></tr>`;
      count.textContent = "Erro ao carregar";
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const payload = {};
    config.fields.forEach((field) => {
      payload[field.name] = form.elements[field.name].value.trim();
    });

    const id = idInput.value;
    submitBtn.disabled = true;

    try {
      if (id) {
        await apiRequest(`${config.path}/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        showToast(config.msgAtualizado, "success");
      } else {
        await apiRequest(config.path, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        showToast(config.msgCriado, "success");
      }
      resetForm();
      await carregar();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      submitBtn.disabled = false;
    }
  });

  cancelBtn.addEventListener("click", resetForm);
  refreshBtn.addEventListener("click", carregar);

  tbody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = button.closest("tr").dataset.id;

    if (button.dataset.action === "edit") {
      try {
        preencherParaEdicao(await apiRequest(`${config.path}/${id}`));
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        showToast(err.message, "error");
      }
      return;
    }

    pedirConfirmacao({
      titulo: config.confirmTitulo,
      mensagem: config.confirmMensagem,
      aoConfirmar: async () => {
        try {
          await apiRequest(`${config.path}/${id}`, { method: "DELETE" });
          showToast(config.msgApagado, "success");
          if (idInput.value === String(id)) resetForm();
          await carregar();
        } catch (err) {
          showToast(err.message, "error");
        }
      },
    });
  });

  resetForm();
  return { panel, carregar };
}

/* ---------------- Abas ---------------- */

const tabsNav = document.getElementById("tabs");
const panelsRoot = document.getElementById("panels");
const paineis = [];

RESOURCES.forEach((config, indice) => {
  const { panel, carregar } = criarPainel(config);
  panelsRoot.appendChild(panel);

  const tab = document.createElement("button");
  tab.type = "button";
  tab.className = "tab";
  tab.textContent = config.tabLabel;
  tab.setAttribute("role", "tab");
  tabsNav.appendChild(tab);

  paineis.push({ tab, panel, carregar, carregado: false });

  tab.addEventListener("click", () => selecionarAba(indice));
});

function selecionarAba(indice) {
  paineis.forEach((item, i) => {
    const ativo = i === indice;
    item.tab.classList.toggle("active", ativo);
    item.tab.setAttribute("aria-selected", String(ativo));
    item.panel.hidden = !ativo;

    // Carrega a lista na primeira vez que a aba é aberta
    if (ativo && !item.carregado) {
      item.carregado = true;
      item.carregar();
    }
  });
}

selecionarAba(0);
