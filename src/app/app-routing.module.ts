import { NgModule } from '@angular/core';
import { UiComponent } from './ui/ui.component';
import { LoginComponent } from './ui/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './ui/chat/chat.component';
import { UsersListComponent } from './ui/share/users-list/users-list.component';

const routes: Routes = [
  { path: 'chat',loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
  { path: '**' , component: LoginComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }