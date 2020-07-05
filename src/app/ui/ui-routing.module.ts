import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UiComponent } from './ui.component';
import { ChatComponent } from './chat/chat.component';
import { UsersListComponent } from './share/users-list/users-list.component';


const routes: Routes = [
{
    path: '',
    component: UiComponent,
    children: [
      {
        path: ':id',
        component: ChatComponent
      },
      {
        path: ':id',
        component: UsersListComponent
      },
      {
        path: '', redirectTo: '1', pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UiRoutingModule { }
