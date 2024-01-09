import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
})
export class RecipeListComponent implements OnInit {
  @Output() recipeClicked = new EventEmitter<Recipe>();
  recipes: Recipe[] = [];
  constructor(private recipeService: RecipeService,private router:Router,private route:ActivatedRoute) {}
  ngOnInit(): void {
    this.recipes = this.recipeService.recipes;
    this.recipeService.recipesChanged.subscribe(recipes=>{
      this.recipes=recipes
    })
  }
  onNewClick(){
    this.router.navigate(['new'],{relativeTo:this.route})
  }
}
