import { NgModule } from '@angular/core';
import { UiComponent } from './ui/ui.component';
import { LoginComponent } from './ui/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './ui/chat/chat.component';
import { UsersListComponent } from './ui/share/users-list/users-list.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  { path: 'chat/:id',
  component: UiComponent},
  { path: 'login' , component: LoginComponent },
  { path: '**', redirectTo: 'chat/:id' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }