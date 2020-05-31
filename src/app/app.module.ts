import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MarkerService } from 'src/app/shared/services/marker.service';
import { PopUpService } from 'src/app/shared/services/pop-up.service';

// text editor plugin (https://www.npmjs.com/package/ngx-quill)
import { QuillModule } from 'ngx-quill/';

// ngx-ui-loader plugin (https://www.npmjs.com/package/ngx-ui-loader)
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { ngxUiLoaderConfig } from './ngxUiLoaderConfig';

// ngx-pagination plugin (https://www.npmjs.com/package/ngx-pagination)
import { NgxPaginationModule } from 'ngx-pagination';

// Angular 2 MultiSelect Dropdown (https://cuppalabs.github.io/components/multiselectDropdown/#Overview)
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

// Locale Ukraine
import { registerLocaleData } from '@angular/common';
import uaLocale from '@angular/common/locales/uk';

// ngx-light box (https://www.npmjs.com/package/ngx-lightbox)
import { LightboxModule } from 'ngx-lightbox';


// firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

// components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FollowBtnComponent } from './components/follow-btn/follow-btn.component';
import { ShareBoxComponent } from './components/share-box/share-box.component';

// pages
import { HomeComponent } from './pages/home/home.component';
import { MapComponent } from './pages/map/map.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { GalleryCategoryComponent } from './pages/gallery-category/gallery-category.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogCategoryComponent } from './pages/blog-category/blog-category.component';
import { BlogTagsComponent } from './pages/blog-tags/blog-tags.component';
import { BlogDetailComponent } from './pages/blog-detail/blog-detail.component';
import { WeatherComponent } from './pages/weather/weather.component';
import { AboutComponent } from './pages/about/about.component';
import { RoutesComponent } from './pages/routes/routes.component';

// widget
import { LatestPostsComponent } from './widgets/latest-posts/latest-posts.component';
import { CategoriesComponent } from './widgets/categories/categories.component';
import { TagsComponent } from './widgets/tags/tags.component';

// admin
import { AdminComponent } from './admin/admin.component';
import { CreatePostComponent } from './admin/create-post/create-post.component';
import { PostComponent } from './admin/post/post.component';
import { EditPostComponent } from './admin/edit-post/edit-post.component';
import { UserComponent } from './admin/user/user.component';
import { AdminGalleryComponent } from './admin/admin-gallery/admin-gallery.component';
import { AdminTagsComponent } from './admin/admin-tags/admin-tags.component';
import { AlertComponent } from './components/alert/alert.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminWeatherComponent } from './admin/admin-weather/admin-weather.component';
import { SortPipe } from './shared/pipes/sort.pipe';
import { MenuHoverDirective } from './shared/directives/menu-hover.directive';



registerLocaleData(uaLocale, 'ua');

export const firebaseConfig = {
  apiKey: 'AIzaSyCuKVuWy-H9ciJSrZIXXMRINPIPz05yD4c',
  authDomain: 'gorystytravelers.firebaseapp.com',
  databaseURL: 'https://gorystytravelers.firebaseio.com',
  projectId: 'gorystytravelers',
  storageBucket: 'gorystytravelers.appspot.com',
  messagingSenderId: '651404291260',
  appId: '1:651404291260:web:a5aa32a6c7a25542dc34b9'
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    MapComponent,
    GalleryComponent,
    BlogComponent,
    WeatherComponent,
    AboutComponent,
    AdminComponent,
    RoutesComponent,
    BlogDetailComponent,
    SidebarComponent,
    BlogCategoryComponent,
    BlogTagsComponent,
    FollowBtnComponent,
    ShareBoxComponent,
    LatestPostsComponent,
    CategoriesComponent,
    TagsComponent,
    CreatePostComponent,
    PostComponent,
    EditPostComponent,
    UserComponent,
    AdminGalleryComponent,
    AdminTagsComponent,
    AlertComponent,
    AdminCategoryComponent,
    GalleryCategoryComponent,
    AdminWeatherComponent,
    SortPipe,
    MenuHoverDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    QuillModule.forRoot(),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    NgxPaginationModule,
    AngularMultiSelectModule,
    LightboxModule
  ],
  providers: [MarkerService, PopUpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
