import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatExpansionModule } from '@angular/material/expansion';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsDetailComponent } from './settings-detail/settings-detail.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';

const routes: Routes =
	[
		{ path: '', component: DashboardComponent },
		{ path: 'dashboard', component: DashboardComponent },
		{ path: 'login', component: LoginComponent },
		{ path: 'settings', component: SettingsComponent },
		{ path: 'settings/:id', component: SettingsDetailComponent }
	];

@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent,
		SettingsComponent,
		SettingsDetailComponent,
		LoginComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatExpansionModule,
		RouterModule.forRoot(routes)

	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
