import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-listar',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './listar.html',
  styleUrl: './listar.css',

})
export class CategoriaListar {
  categorias = signal<any[]>([]);
  constructor(private categoriaService:CategoriaService){}
  ngOnInit(): void{
    this.carregarCategorias();
  }

  private carregarCategorias():void{
    this.categoriaService.listar().subscribe({
      next:(dados) => this.categorias.set(dados)
    })
  }

  apagar(id: number): void {
    this.categoriaService.apagar(id).subscribe({
      next: () => this.carregarCategorias()
    });
  }
}
