import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BasicAuthInterceptor } from './_helpers/basic-auth.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';

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
import { AvatarModule } from 'ngx-avatar';

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
    ReactiveFormsModule,
    AvatarModule,
  ],
  providers: [DatatransferService,
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
