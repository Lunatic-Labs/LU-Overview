import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SettingsDetailComponent } from './settings-detail/settings-detail.component';

const routes: Routes =
	[
		{ path: '', component: DashboardComponent },
		{ path: 'dashboard', component: DashboardComponent },
		{ path: 'login', component: LoginComponent },
		{ path: 'settings', component: SettingsComponent },
		{ path: 'settings/:id', component: SettingsDetailComponent }
	];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
// export const routingComponents = [SettingsComponent, DashboardComponent, LoginComponent, SettingsDetailComponent]
