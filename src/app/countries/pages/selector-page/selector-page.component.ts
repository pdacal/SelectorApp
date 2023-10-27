import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required],
  })

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ) { }

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChanged(): void {
    //recibir valor dun observable e subscribirme a outro observable-> switchMap
    //cando a rexion cambia
    this.myForm.get('region')!.valueChanges
      .pipe(
        //borramos os countries
        tap( () => this.myForm.get('country')!.setValue('')),
        //borrramos os borders
        tap( () => this.borders = []),
        //toma o valor do anterior obsrevable e subscribese ao novo Observable
        switchMap(region => this.countriesService.getCountriesByRegion(region)),
      )
      //recollemos a colecion de SmallCOuntries
      .subscribe(countries => { this.countriesByRegion = countries; })
  }

  onCountryChanged(): void{
    //se cambia o pais
    this.myForm.get('country')!.valueChanges
    .pipe(
      //borramos os borders
      tap( () => this.myForm.get('borders')!.setValue('') ),
      //filtramolo, que siga so se hai algun
      filter( (value: string) =>  value.length > 0),
      //o que ven subscribimolo a un novo observable
      //devolve SmallCountries segun o alpha code
      switchMap( (alphaCode) => this.countriesService.getCountryByAlphaCode(alphaCode) ),
      //dewvolve o array de SmallCountry[] segundo os codigos das fronteiras
      switchMap( country => this.countriesService.getCountryBorderByCodes(country.borders) ),
    )
    //devolve as fronteiras, mostrandoas coma paises (segundo o codigo coma fixemos antes)
    .subscribe(countries => {
      this.borders = countries;
    })
  }


}
