import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UiComponent } from './ui.component';
import { ChatComponent } from './chat/chat.component';


const routes: Routes = [
{
    path: '',
    component: UiComponent,
    children: [
      {
        path: 'chat/:id',
        component: ChatComponent
      },
      {
        path: 'chat', redirectTo: 'chat/1', pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UiRoutingModule { }
