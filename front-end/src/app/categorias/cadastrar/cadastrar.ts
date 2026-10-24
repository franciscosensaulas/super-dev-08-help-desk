import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaCadastrarRequest } from '../../model/categoria.model';
import { CategoriaService } from '../../services/categoria.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastrar',
  imports: [FormsModule, RouterLink],
  templateUrl: './cadastrar.html',
})
export class CategoriaCadastrar {

  constructor(private categoriaService: CategoriaService){}

  form: CategoriaCadastrarRequest = {
    nome:"",
    descricao:""
  };
  cadastrar(){
    this.categoriaService.cadastrar(this.form).subscribe({
      next: (response) => {
        alert("Categoria cadastrada com sucesso")
      }
    })
  }
}
