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
import { RecommendComponent } from './pages/recommendations/recommend.component';
import { ChatComponent } from './pages/chat/chat.component';
import { AuthGuard, NonAuthGuard } from './services/auth-guard.service';


// Main routes
const routes: Routes = [
  { path: "", component: HomeComponent, pathMatch: "full"},
  { path: "about", component: AboutComponent},
  
  { path: "connexion", component: ConnexionComponent, canActivate: [NonAuthGuard]},
  { path: "inscription", component: InscriptionComponent, canActivate: [NonAuthGuard]},
  { path: "motdepasse", component: PasswordLostComponent, canActivate: [NonAuthGuard]},

  { path: "deconnexion", component: DeconnexionComponent, canActivate: [AuthGuard]},
  { path: "admin", component: AdminComponent, canActivate: [AuthGuard]},
  { path: "profil", component: ProfileComponent, canActivate: [AuthGuard]},
  { path: "monspace", component: MyspaceComponent, canActivate: [AuthGuard]},
  { path: "membre/:id", component: ScrapbookComponent, canActivate: [AuthGuard]},
  { path: "amis", component: FriendsComponent, canActivate: [AuthGuard]},
  { path: "messagerie", component: MessagesComponent, canActivate: [AuthGuard]},
  { path: "avis", component: RecommendComponent, canActivate: [AuthGuard]},
  { path: "chat", component: ChatComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
