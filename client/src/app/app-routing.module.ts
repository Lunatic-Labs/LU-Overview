import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';

const routes: Routes =
	[
		{ path: '', component: DashboardComponent },
		{ path: 'dashboard', component: DashboardComponent },
		{ path: 'login', component: LoginComponent },
		{ path: 'settings', component: SettingsComponent }
	];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
// export const routingComponents = [SettingsComponent, DashboardComponent, LoginComponent, SettingsDetailComponent]
