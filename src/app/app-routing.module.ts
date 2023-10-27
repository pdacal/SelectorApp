import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


/**
 * 1º declarar rutas en countries-routing.module(ruta:..+children[{..},{...}...]) + imports:RouterModule.forChild(routes)
 * 2º importalo a Countries.Module en 'imports:[CountriesRoutingModule]',
 * 3º importalo eiqui co loadChildren + imports:[RouterModule.forRoot(routes)]
 */
const routes: Routes = [
  {
    path: 'selector',
    loadChildren: () => import('./countries/countries.module').then(m => m.CountriesModule)
  },
  {
    path: '**', redirectTo: 'selector'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
