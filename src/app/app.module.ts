import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './ui/login/login.component';
import { UiComponent } from './ui/ui.component';
import { ChatComponent } from './ui/chat/chat.component';
import { MainChatComponent } from './ui/chat/main-chat/main-chat.component';
import { InfoChatComponent } from './ui/chat/info-chat/info-chat.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersListComponent } from './ui/share/users-list/users-list.component'
import { IgxListModule, IgxAvatarModule, IgxIconModule } from 'igniteui-angular';

import { DatatransferService } from './services/datatransfer.service';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    MainChatComponent,
    InfoChatComponent,
    LoginComponent,
    UiComponent,
    UsersListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    IgxListModule,
    IgxAvatarModule,
    IgxIconModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [DatatransferService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
