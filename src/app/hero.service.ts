import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';
import { Caracter } from './caracter';
import { Data } from './data';
import { Result } from './marvel';
import { Marvel } from './marvel';


@Injectable({ providedIn: 'root' })
export class HeroService {

  private marvelUrl = 'http://gateway.marvel.com/v1/public/characters?ts=marvel&apikey=777d0f50a24bfb4afcd6df244b6162e5&hash=a5e60f4ab852a9d26f3b76a7dd118056';  // URL to web api
  number = Math.floor(Math.random() * 1462);
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  todos:number=0;
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET heroes from the server */
  getHeroes(offset:number): Observable<Caracter[]> {
    return this.http.get<Data>(this.marvelUrl)
    .pipe(
      map((heroes: Data) =>{
        return heroes.data.results
      })
    )
  }
  getRandom(): Observable<Caracter[]> {
    return this.http.get<Data>(this.marvelUrl + `&offset=${this.number}`)
    .pipe(
      map((heroes: Data) =>{
        return heroes.data.results
      })
    )
  }

  /** GET hero by id. Return `undefined` when id not found */
  getHeroNo404<Data>(id: number): Observable<Caracter> {
    const url = `${this.marvelUrl}/?id=${id}`;
    return this.http.get<Caracter[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Caracter>(`getHero id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Caracter> {
    const url = `${this.marvelUrl}&id=${id}`;
    return this.http.get<Data>(url).pipe(
      map((heroes: Data) => {
        console.log(heroes.data.results[0])
        return heroes.data.results[0]
      }),
      catchError(this.handleError<Caracter>(`getHero id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Result[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Marvel>(`${this.marvelUrl}&nameStartsWith=${term}&limit=5`).pipe(
      map((data:Marvel)=> { console.log(data.data.results)
        return data.data.results})
    )
  }

getPag(offset: number):Observable<Caracter[]>{
  let urlPag = `${this.marvelUrl}&offset=${offset}`;
  return this.http.get<Data>(urlPag)
  .pipe(
    map((pagina:Data)=>{
      this.todos = pagina.data.total;
      return pagina.data.results;
    }
    )
  )

}

todosHeroes(): number{
  return this.todos;
}


  //////// Save methods //////////

  /** POST: add a new hero to the 

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
