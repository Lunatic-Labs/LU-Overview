import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes =
	[
    // { path: '', component: DashboardComponent },
		{ path: "dashboard", component: DashboardComponent },
		{ path: "settings", component: SettingsComponent }
		,
		{ path: "", redirectTo: '/dashboard', pathMatch: "full" }
	];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
