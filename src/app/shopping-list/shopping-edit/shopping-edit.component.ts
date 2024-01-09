import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../../services/shoppingList.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css',
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') form: NgForm;
  subscription: Subscription;
  editMode = false;
  edittedItem: Ingredient;
  editId: number;
  constructor(private shoppingListService: ShoppingListService) {}
  ngOnInit(): void {
    this.subscription = this.shoppingListService.edittedNum.subscribe(
      (id: number) => {
        this.editMode = true;
        this.editId = id;
        this.edittedItem = this.shoppingListService.getItemById(id);
        this.form.form.patchValue({
          name: this.edittedItem.name,
          amount: this.edittedItem.amount,
        });
      }
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  onSubmit() {
    if (this.editMode) {
      const vals=this.form.value
      this.shoppingListService.updateItem(this.editId, new Ingredient(vals.name,vals.amount));
    } else {
      this.shoppingListService.addItem(
        new Ingredient(this.form.value.name, this.form.value.amount)
      );
    }
    this.onClear()
  }
  onClear(){
    this.editMode=false
    this.form.reset();
  }
  onDelete(){
    this.shoppingListService.deleteItem(this.editId)
    this.onClear()
  }
}
