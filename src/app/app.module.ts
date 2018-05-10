import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {MainComponent} from './components/main/main.component';
import {AppRoutingModule} from './app-routing.module';
import {MoviesComponent} from './components/movies/movies.component';
import {SearchComponent} from './components/search/search.component';
import {MovieServiceService} from './services/movie-service.service';
import {HttpClientModule} from '@angular/common/http';
import {PersonSearchService} from './services/person-search.service';


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
    MovieServiceService,
    PersonSearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
