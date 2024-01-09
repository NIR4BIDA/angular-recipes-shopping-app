import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css',
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode: boolean = false;
  formi: FormGroup;
  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router:Router
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }
  private initForm() {
    let recipeIngredients = new FormArray([]);
    let name = '';
    let image = '';
    let description = '';
    if (this.editMode) {
      const recipe = this.recipeService.getRecipeById(this.id);
      name = recipe.name;
      image = recipe.imagePath;
      description = recipe.description;
      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        }
      }
    }
    this.formi = new FormGroup({
      name: new FormControl(name, Validators.required),
      image: new FormControl(image, Validators.required),
      description: new FormControl(description, Validators.required),
      ingredients: recipeIngredients,
    });
  }
  get controls() {
    return (this.formi.get('ingredients') as FormArray).controls;
  }
  onSubmit() {
    const newRecipe = new Recipe(
      this.formi.value['name'],
      this.formi.value['description'],
      this.formi.value['image'],
      this.formi.value['ingredients']
    );
    if (this.editMode) {
      this.recipeService.updateRecipe(newRecipe, this.id);
    }
    else{
      this.recipeService.addRecipe(newRecipe)
    }
    this.onCancel()
  }
  onAddIngredient() {
    (this.formi.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }
  onCancel(){
    this.router.navigate(['../'],{relativeTo:this.route})
  }
  onDeleteIngredient(id:number){
    (this.formi.get('ingredients') as FormArray).removeAt(id)
  }
}
