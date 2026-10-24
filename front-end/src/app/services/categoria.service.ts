import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoriaCadastrarRequest } from '../model/categoria.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private baseUrl:string="http://localhost:8080";
  constructor(private httpClient : HttpClient){
  }
  cadastrar(categoria:CategoriaCadastrarRequest): Observable<void> {
    const url = this.baseUrl + "/categorias"
    
    return this.httpClient.post<void>(url, categoria);
  }

  



}

