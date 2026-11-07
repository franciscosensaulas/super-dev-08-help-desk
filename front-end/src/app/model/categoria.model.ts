// criar a pasta de models dentro de app
// criar arquivo categoria.model.ts

export interface CategoriaCadastrarRequest {
    nome: string;
    descricao: string;
}

export interface CategoriaResponse{
    id: number;
    nome: string;
    descricao: string;
    ativa: boolean;
}