import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Pages references
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


// Main routes
const routes: Routes = [
  { path: "", component: HomeComponent},
  { path: "about", component: AboutComponent},
  { path: "connexion", component: ConnexionComponent},
  { path: "inscription", component: InscriptionComponent},
  { path: "motdepasse", component: PasswordLostComponent},
  { path: "deconnexion", component: DeconnexionComponent},
  { path: "admin", component: AdminComponent},
  { path: "profil", component: ProfileComponent},
  { path: "monspace", component: MyspaceComponent},
  { path: "membre", component: ScrapbookComponent},
  { path: "amis", component: FriendsComponent},
  { path: "messagerie", component: MessagesComponent},
  { path: "discussion", component: DiscussionComponent},
  { path: "chat", component: ChatComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
