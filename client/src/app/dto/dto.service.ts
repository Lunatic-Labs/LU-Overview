import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RepoCommits } from "./RepoCommits";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DtoService {

  private url: string = "http://localhost:3000/github/commits/1"

  constructor(private http: HttpClient) { }

  getCommits(): Observable<RepoCommits[]>{
    return this.http.get<RepoCommits[]>(this.url);
  }
}
