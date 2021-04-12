import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {

  @Input() recipe = {
    name: 'Flan',
    prep_time: '20 min',
    cook_time: '60 min',
    servings: '8',
    cuicine: 'italiana',
    ingredients: [
      "3/4 cup sugar",
      "1/4 cup water",
      "1 package (8 ounces) cream cheese, softened",
      "5 large eggs",
      "1 can (14 ounces) sweetened condensed milk",
      "1 can (12 ounces) evaporated milk",
      "1 teaspoon vanilla extract"
    ],
    steps: [
      "In a heavy saucepan, cook sugar and water over medium-low heat until melted and golden, about 15 minutes. Brush down crystals on the side of the pan with additional water as necessary. Quickly pour into an ungreased 2-qt. round baking or souffle dish, tilting to coat the bottom; let stand for 10 minutes.",
      "Preheat oven to 350°. In a bowl, beat the cream cheese until smooth. Beat in eggs, 1 at a time, until thoroughly combined. Add remaining ingredients; mix well. Pour over caramelized sugar.",
      "Place the dish in a larger baking pan. Pour boiling water into larger pan to a depth of 1 in. Bake until the center is just set (mixture will jiggle), 50-60 minutes.",
      "Remove dish from a larger pan to a wire rack; cool for 1 hour. Refrigerate overnight.",
      "To unmold, run a knife around edges and invert onto a large rimmed serving platter. Cut into wedges or spoon onto dessert plates; spoon sauce over each serving."
    ]
  }

  constructor() { }

  ngOnInit(): void {
  }

}
