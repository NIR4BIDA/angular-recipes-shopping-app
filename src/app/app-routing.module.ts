import { RouterModule, Routes } from "@angular/router";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { NgModule } from "@angular/core";
import { RecipeDetailsComponent } from "./recipes/recipe-details/recipe-details.component";
import { RecipesHomeComponent } from "./recipes/recipes-home/recipes-home.component";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
import { RecipesResolverService } from "./services/recipes-resolver.service";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./services/auth.guard";

const appRoutes:Routes=[
    {path:'',redirectTo:'/recipes',pathMatch:'full'},
    {path:'shopping-list',component:ShoppingListComponent},
    {path:'auth',component:AuthComponent},
    {path:'recipes',component:RecipesComponent,canActivate:[AuthGuard],children:[
        {path:'',component:RecipesHomeComponent},
        {path:'new',component:RecipeEditComponent},
        {path:':id',component:RecipeDetailsComponent,resolve:[RecipesResolverService]},
        {path:':id/edit',component:RecipeEditComponent,resolve:[RecipesResolverService]},
    ]},
]
@NgModule({
    imports:[RouterModule.forRoot(appRoutes)],
    exports:[RouterModule]
})
export class AppRoutingModule{}
