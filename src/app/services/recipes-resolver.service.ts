import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Recipe } from '../recipes/recipe.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpService } from './http.service';
import { RecipeService } from './recipe.service';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private httpService: HttpService,
    private recipeService: RecipeService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    console.log(this.recipeService.recipes)
    if(this.recipeService.recipes.length===0){
        return this.httpService
        .fetchData(
          'https://angular-practice-http-f8e64-default-rtdb.firebaseio.com/recipes.json'
        )
        .pipe(
          tap((recipes) => {
            this.recipeService.updateRecipes(recipes);
          })
        );
    }
    else{
        return this.recipeService.recipes
    }

  }
}
