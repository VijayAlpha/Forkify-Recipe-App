import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.publisher = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        const numOfIng = this.ingredients.length;
        const periods = Math.ceil(numOfIng / 3);
        this.time = periods * 15;
    }

    
    calcServings() {
        this.servings = 4;
    }


    parseIngredients() {

        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShot = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const unit = [...unitsShot, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {

            //**** eg : el = "4 1/2 cups (20.25 ounces) unbleached high-gluten, bread, or all-purpose flour, chilled"

            // 1. Uniform units
            let ingredient = el.toLowerCase();
            //**** eg1 (no uppercase do the same result) : el.toLowercase = "4 1/2 cups (20.25 ounces) unbleached high-gluten, bread, or all-purpose flour, chilled" 

            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShot[i]);

                //**** eg2 (there is cups so replaced to cup) => ingredient = "4 1/2 cup (20.25 ounces) unbleached high-gluten, bread, or all-purpose flour, chilled" 
            });

            // 2. remove words inside the paraentheses

            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //**** eg3 (there is words inside the paraentheses so it  replaced with ' ') => ingredient = "4 1/2 cup unbleached high-gluten, bread, or all-purpose flour, chilled" 

            // 3. paras ingredients into counts

            const arrIng = ingredient.split(' ');
            /* */

            //**** eg4 (split() method split the the strings and returns array) => arrIng = [4 , 1/2, cup, unbleached, high-gluten, bread, or, all-purpos,e flour, chilled]

            const unitIndex = arrIng.findIndex(el2 => unitsShot.includes(el2));
            /* findIndex() methods  returns the array index of frist true value */

            //**** eg4  => arrIng = [4 , 1/2, cup, unbleached, high-gluten, bread, or, all-purpos,e flour, chilled]

            // includes cup so retrun the index of that OP: 3;

            let objIng;

            if (unitIndex > -1) {
                // if there is units;
                const arrCount = arrIng.slice(0, unitIndex);
                // Ex : [4 , 1/2, cups] => [4,1/2]

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }



            } else if (parseInt(arrIng[0], 10)) {
                // if there is no units but frist index in numders

                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')

                    //here ingredient = "unbleached high-gluten, bread, or all-purpose flour, chilled" 
                    // arrIng is an array, so the slice method will remove the 0th element and  take count of 1st element to the end (becase we didn't say where to end) and join the element with ' ' and return a string
                    // without unit and counts;
                }


            } else if (unitIndex === -1) {
                // if there is no units and numbers
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });

        this.ingredients = newIngredients;
    }
    
    updateServings(type) {

        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }

}
