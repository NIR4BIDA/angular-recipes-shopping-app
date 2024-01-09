import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { ShoppingListService } from '../services/shoppingList.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './Header.component.html',
  styleUrl: './Header.component.css',
})
export class Header implements OnInit, OnDestroy {
  userSub: Subscription;
  isAuthenticated = false;
  constructor(
    private recipeService: RecipeService,
    private shoppingListService: ShoppingListService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = user ? true : false;
    });
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  onSave() {
    console.log('save');
    this.recipeService.postData();
    this.shoppingListService.postData();
  }
  onFetch() {
    console.log('fetch');
    this.shoppingListService.fetchData();
    this.recipeService.fetchData();
  }
  logout(){
    this.authService.logout()
  }
}
