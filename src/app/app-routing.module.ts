import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MapComponent } from './pages/map/map.component';
import { RoutesComponent } from './pages/routes/routes.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogCategoryComponent } from './pages/blog-category/blog-category.component';
import { BlogTagsComponent } from './pages/blog-tags/blog-tags.component';
import { BlogDetailComponent } from './pages/blog-detail/blog-detail.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { GalleryCategoryComponent } from './pages/gallery-category/gallery-category.component';
import { GalleryTagsComponent } from './pages/gallery-tags/gallery-tags.component';
import { WeatherComponent } from './pages/weather/weather.component';
import { AboutComponent } from './pages/about/about.component';

import { AdminComponent } from './admin/admin.component';
import { CreatePostComponent } from './admin/create-post/create-post.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { EditPostComponent } from './admin/edit-post/edit-post.component';
import { PostComponent } from './admin/post/post.component';
import { AdminTagsComponent } from './admin/admin-tags/admin-tags.component';
import { AdminGalleryComponent } from './admin/admin-gallery/admin-gallery.component';
import { UserComponent } from './admin/user/user.component';
import { AdminWeatherComponent } from './admin/admin-weather/admin-weather.component';
import { AdminAdvicesComponent } from './admin/admin-advices/admin-advices.component';
import { AdminQuoteComponent } from './admin/admin-quote/admin-quote.component';

import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'map', component: MapComponent },
  { path: 'routes', component: RoutesComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-category/:category', component: BlogCategoryComponent },
  { path: 'blog-tags/:tag', component: BlogTagsComponent },
  { path: 'blog-detail/:id', component: BlogDetailComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'gallery-category/:category', component: GalleryCategoryComponent },
  { path: 'gallery-tags/:tag', component: GalleryTagsComponent },
  { path: 'weather', component: WeatherComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'admin', component: AdminComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'post' },
      { path: 'create-post', component: CreatePostComponent, canActivate: [AuthGuard] },
      { path: 'post/:id/edit', component: EditPostComponent, canActivate: [AuthGuard] },
      { path: 'post', component: PostComponent, canActivate: [AuthGuard] },
      { path: 'admin-category', component: AdminCategoryComponent, canActivate: [AuthGuard] },
      { path: 'admin-tags', component: AdminTagsComponent, canActivate: [AuthGuard] },
      { path: 'admin-gallery', component: AdminGalleryComponent, canActivate: [AuthGuard] },
      { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
      { path: 'admin-weather', component: AdminWeatherComponent, canActivate: [AuthGuard] },
      { path: 'admin-advices', component: AdminAdvicesComponent, canActivate: [AuthGuard] },
      { path: 'admin-quotes', component: AdminQuoteComponent, canActivate: [AuthGuard] }
    ]
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
