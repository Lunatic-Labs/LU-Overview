import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SDetailsComponent } from './s-details/s-details.component';

const routes: Routes =
	[
    { path: '', component: DashboardComponent },
		{ path: "dashboard", component: DashboardComponent },
		{ path: "settings", component: SettingsComponent },
    { path: 'detail/:id', component: SDetailsComponent }
	];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
