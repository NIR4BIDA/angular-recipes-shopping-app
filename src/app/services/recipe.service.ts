import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shoppingList.service';
import { HttpService } from './http.service';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  recipes: Recipe[] = [];
  constructor(
    private shoppingListService: ShoppingListService,
    private httpService: HttpService
  ) {}
  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    for (let i = 0; i < ingredients.length; i++) {
      this.shoppingListService.addItem(ingredients[i]);
    }
  }
  getRecipeById(id: number) {
    return this.recipes[id];
  }
  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }
  updateRecipe(recipe: Recipe, id: number) {
    this.recipes[id] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }
  deleteRecipe(id: number) {
    this.recipes.splice(id, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
  postData() {
    this.httpService.postData(
      'https://angular-practice-http-f8e64-default-rtdb.firebaseio.com/recipes.json',
      this.recipes
    );
  }
  fetchData() {
    this.httpService
      .fetchData(
        'https://angular-practice-http-f8e64-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(
        map((recipes) => {
          console.log('pipe');
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        })
      )
      .subscribe((data) => {
        this.updateRecipes(data);
      });
  }
  updateRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }
}
