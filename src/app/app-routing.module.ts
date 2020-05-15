import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MapComponent } from './pages/map/map.component';
import { RoutesComponent } from './pages/routes/routes.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogCategoryComponent } from './pages/blog-category/blog-category.component';
import { BlogDetailComponent } from './pages/blog-detail/blog-detail.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
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

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'map', component: MapComponent },
  { path: 'routes', component: RoutesComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-category/:category', component: BlogCategoryComponent },
  { path: 'blog-detail/:id', component: BlogDetailComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'weather', component: WeatherComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'admin', component: AdminComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'create-post' },
      { path: 'create-post', component: CreatePostComponent },
      { path: 'post/:id/edit', component: EditPostComponent},
      { path: 'post', component: PostComponent },
      { path: 'admin-category', component: AdminCategoryComponent},
      { path: 'admin-tags', component: AdminTagsComponent},
      { path: 'admin-gallery', component: AdminGalleryComponent},
      { path: 'user', component: UserComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
