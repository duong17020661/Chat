import { NgModule } from '@angular/core';
import { UiComponent } from './ui/ui.component';
import { LoginComponent } from './ui/login/login.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home',loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
  { path: '**' , component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }