import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
import {AppRoutingModule} from "./app-routing.module";
import {MoviesComponent} from './movies/movies.component';
import {SearchComponent} from './search/search.component';
import {MovieServiceService} from "./movie-service.service";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MoviesComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    MovieServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
