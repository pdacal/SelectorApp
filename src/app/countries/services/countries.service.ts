import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Country, Region, SmallCountry } from '../interfaces/country.interfaces';
import { Observable, combineLatest, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v3.1';
  private _regions: Region[] = [Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania]

  constructor(
    private http: HttpClient
  ) { }

  get regions(): Region[] {
    return [...this._regions];
  }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
    //senon ven nada, pasamos o array vacio a observable co of()
    if (!region) return of([]);
    /**se ven algo, devolvemos un array de SmallCountry's
     * pero o que ven son Country's. temos que pasalos a SmallCountry co .pipe(map(countries.map))
     * countries.map() -> funcion map dos array NON de rxjs
     * que devolva un array cos borders do SmallCountry, senon un [] vacio-> ?? []
     */
    const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`
    return this.http.get<Country[]>(url)
    .pipe(
      map( countries => countries.map( country => ({
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? []})) ),
        tap(response => console.log({ response }))
        );
  }

  getCountryByAlphaCode(alphaCode: string): Observable<SmallCountry>{
    //devolvenos o pais
    const url = `${ this.baseUrl }/alpha/${alphaCode}?fields=cca3,name,borders`;
    return this.http.get<Country>(url)
    //transformamos o pais a small country
    .pipe(
      map( country => ({
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? [],
      }) )
    )
  }

  getCountryBorderByCodes( borders: string[] ): Observable<SmallCountry[]>{
    if(!borders || borders.length === 0) return of([]);
    const countriesRequest: Observable<SmallCountry>[]= [];
    borders.forEach(code => {
      const request = this.getCountryByAlphaCode( code );
      countriesRequest.push( request );
    });
    return combineLatest( countriesRequest );
  }
}
