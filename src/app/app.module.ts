// Angular Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { LayoutModule } from '@angular/cdk/layout';
import { TextFieldModule } from '@angular/cdk/text-field';

// Material Modules
import { MaterialModule } from './material-module';
// Formly
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { ArrayTypeComponent } from './pages/recommendations/array.type';
import { ObjectTypeComponent } from './pages/recommendations/object.type';

// My components
import { AppComponent } from './app.component';
import { HeaderComponent } from './partials/header/header.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { PasswordLostComponent } from './pages/password-lost/password-lost.component';
import { DeconnexionComponent } from './pages/deconnexion/deconnexion.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MyspaceComponent } from './pages/myspace/myspace.component';
import { ScrapbookComponent } from './pages/scrapbook/scrapbook.component';
import { FriendsComponent } from './pages/friends/friends.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { RecommendComponent } from './pages/recommendations/recommend.component';
import { ChatComponent } from './pages/chat/chat.component';
import { NotificationComponent } from './partials/notification/notification.component'
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { ConfirmationDialog, MessageDialog, CommentDialog, RecommandationDialog, NewDiscussionDialog } from './partials/dialogs/dialogs.component';

@NgModule({
  declarations: [
    AppComponent,
    ArrayTypeComponent,
    ObjectTypeComponent,
    HeaderComponent,
    ConnexionComponent,
    AboutComponent,
    HomeComponent,
    InscriptionComponent,
    PasswordLostComponent,
    DeconnexionComponent,
    AdminComponent,
    ProfileComponent,
    MyspaceComponent,
    ScrapbookComponent,
    FriendsComponent,
    MessagesComponent,
    RecommendComponent,
    ChatComponent,
    NotificationComponent,
    MessageDialog,
    CommentDialog,
    ConfirmationDialog,
    RecommandationDialog,
    NewDiscussionDialog
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    //FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    TextFieldModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    FormlyModule.forRoot({
      types: [
        { name: 'string', extends: 'input' },
        { name: 'array', component: ArrayTypeComponent },
        { name: 'object', component: ObjectTypeComponent },
      ]
    }),
    FormlyMaterialModule
  ],
  entryComponents: [
    MessageDialog,
    CommentDialog,
    ConfirmationDialog,
    RecommandationDialog,
    NewDiscussionDialog,
    NotificationComponent
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
