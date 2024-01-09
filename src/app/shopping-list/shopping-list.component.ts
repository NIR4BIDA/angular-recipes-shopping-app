import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../services/shoppingList.service';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[] = []
  constructor(private shoppingListService:ShoppingListService){}
  ngOnInit(): void {
    this.ingredients=this.shoppingListService.ingredients
    this.shoppingListService.ingredientsChanged.subscribe(ingredients=>{
      this.ingredients=ingredients
    })
  }
  onEdit(id:number){
    this.shoppingListService.edittedNum.next(id)
  }
}
