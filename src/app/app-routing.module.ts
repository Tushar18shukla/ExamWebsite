import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { JoinTestComponent } from './join-test/join-test.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { ChatScreenComponent } from './chat-screen/chat-screen.component';
import { PlanTestComponent } from './plan-test/plan-test.component';
import { TestIdComponent } from './test-id/test-id.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CustomSectionComponent } from './custom-section/custom-section.component';
import { AuthGuard } from './auth.guard';  // Import the guard

const routes: Routes = [
  { path: '', component: HomeComponent },  // Default route
  { path: 'join-test', component: JoinTestComponent },
  { path: 'sign-in-page', component: SignInPageComponent },
  { path: 'chat-screen', component: ChatScreenComponent },
  { path: 'plan-test', component: PlanTestComponent, canActivate: [AuthGuard] },  // Guard applied here
  { path: 'test-id', component: TestIdComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'custom-section', component: CustomSectionComponent },  // Route for Custom Section
  { path: '**', redirectTo: '', pathMatch: 'full' }  // Wildcard route for unknown paths
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
