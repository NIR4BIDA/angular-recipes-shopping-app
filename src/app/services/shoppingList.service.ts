import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
@Injectable()
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  ingredients: Ingredient[] = [];
  edittedNum = new Subject<number>();
  constructor(private httpService: HttpService) {}
  addItem(item: Ingredient) {
    this.ingredients.push(item);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
  getItemById(id: number) {
    return this.ingredients[id];
  }
  updateItem(id: number, item: Ingredient) {
    this.ingredients[id] = item;
    this.ingredientsChanged.next(this.ingredients.slice());
  }
  deleteItem(id: number) {
    this.ingredients.splice(id, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
  postData() {
    this.httpService.postData(
      'https://angular-practice-http-f8e64-default-rtdb.firebaseio.com/shopping-list.json',
      this.ingredients
    );
  }
  fetchData() {
    this.httpService
      .fetchData(
        'https://angular-practice-http-f8e64-default-rtdb.firebaseio.com/shopping-list.json'
      )
      .subscribe((data) => {
        console.log(data);
        this.ingredients = data;
        this.ingredientsChanged.next(this.ingredients.slice());
      });
  }
}
