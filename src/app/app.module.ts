// Angular Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Material Modules
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
import { DiscussionComponent } from './pages/discussion/discussion.component';
import { ChatComponent } from './pages/chat/chat.component';
import { NotificationComponent } from './partials/notification/notification.component'
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { ConfirmationDialog, MessageDialog, CommentDialog, RecommandationDialog } from './partials/dialogs/dialogs.component';

@NgModule({
  declarations: [
    AppComponent,
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
    DiscussionComponent,
    ChatComponent,
    NotificationComponent,
    MessageDialog,
    CommentDialog,
    ConfirmationDialog,
    RecommandationDialog
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    //FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    LayoutModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatInputModule,
    MatListModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatGridListModule,
    MatCardModule,
    MatDialogModule,
    TextFieldModule,
    MatSnackBarModule
  ],
  entryComponents: [
    MessageDialog,
    CommentDialog,
    ConfirmationDialog,
    RecommandationDialog,
    NotificationComponent
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
