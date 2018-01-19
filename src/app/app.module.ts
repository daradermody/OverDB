import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
import {AppRoutingModule} from "./app-routing.module";
import {MoviesComponent} from './movies/movies.component';
import {SearchComponent} from './search/search.component';
import {MovieServiceService} from "./movie-service.service";
import {HttpClientModule} from "@angular/common/http";
import { MovieInfoComponent } from './movie-info/movie-info.component';
import {NgxPageScrollModule} from "ngx-page-scroll";


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MoviesComponent,
    SearchComponent,
    MovieInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPageScrollModule
  ],
  providers: [
    MovieServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
