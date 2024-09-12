import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { JoinTestComponent } from './join-test/join-test.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { ChatScreenComponent } from './chat-screen/chat-screen.component';
import { FormsModule } from '@angular/forms';
import { PlanTestComponent } from './plan-test/plan-test.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { TestIdComponent } from './test-id/test-id.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CustomSectionComponent } from './custom-section/custom-section.component';
import { MatDialogModule } from '@angular/material/dialog';  // Add MatDialogModule

@NgModule({
  declarations: [	
    AppComponent,
    HomeComponent,
    JoinTestComponent,
    SignInPageComponent,
    ChatScreenComponent,
    PlanTestComponent,
    TestIdComponent,
    SignUpComponent,
    CustomSectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),  // Initialize Firebase
    AngularFireDatabaseModule,
    MatDialogModule  // Ensure MatDialogModule is imported here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
