import { Injectable } from '@angular/core';
import { Observable, of, catchError, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Hero } from './hero';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'http://localhost:3333/heroes';
  private httpOptions = {
    headers: new HttpHeaders({
      'ContentType': 'application/json',
    })
  }

  constructor(
    private messageService: MessageService,
    private http: HttpClient,
  ) { }

  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => {
          this.log('fetched heroes');
        }),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }
  
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => {
          this.log(`fetched hero id: ${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id: ${id}`))
      )
  }

  updateHero(hero: Hero) {
    const url = `${this.heroesUrl}/${hero.id}`;
    return this.http.put<Hero>(url, hero, this.httpOptions)
    .pipe(
      tap(_ => {
        this.log(`updated hero id: ${hero.id}`);
      }),
      catchError(this.handleError<Hero[]>('updateHero', []))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
    .pipe(
      tap((newHero: Hero) => {
        this.log(`added hero id: ${newHero.id}`);
      }),
      catchError(this.handleError<Hero>('addHero'))
    ); 
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions)
    .pipe(
      tap(_ => {
        this.log(`deleted hero id: ${id}`);
      }),
      catchError(this.handleError<Hero>('deleteHero'))
    ); 
  }
}
