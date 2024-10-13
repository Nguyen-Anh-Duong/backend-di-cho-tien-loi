const axios = require('axios')
const mongoose = require('mongoose');
const recipeModel = require('../models/recipe.model');
const { forEach } = require('lodash');

const API_URL = 'https://www.themealdb.com/api/json/v1/1/random.php';
const RAPID_API_KEY = 'ad4264eb0cmsh25d2f0eb8ff8eebp12f991jsn844061a51936'
const key = 'bbe166f3f2msh54b7a9cb98f9a46p17760bjsn02c5adb21dc8'
const mongoURI = 'mongodb://localhost:27017/di-cho-tien-loi'
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
})

.then(() => console.log('MongoDB connected successfully'))

async function main() {
    
    let t = 1;
    while(t<2) {
        console.log(`[t]==${t}`)
        t++;
        try {
            
            const response = await recipeModel.find()
            // console.log(response[0])

            for(let i = 0; i < response.length; ++i) {
                let text = response[i].recipe_name + " | " + response[0].recipe_desciption ;
                let recipe_ingredients = response[i].recipe_ingredients;
                console.log(recipe_ingredients)
                recipe_ingredients.forEach((item, index) => {
                    text+= " | "+item.name
                })

                console.log(text)
        
                try {
                    const options = {
                        method: 'POST',
                        url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
                        headers: {
                            'x-rapidapi-key': key,
                            'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
                            'Content-Type': 'application/json'
                        },
                        data: {
                            from: 'en',
                            to: 'vi',
                            text: text // Gửi toàn bộ mảng text cần dịch
                        }
                    };
                    const responseOK = await axios.request(options);
                    const translatedTexts = responseOK.data['trans'];
                    console.log("==>", translatedTexts)
                    const temp = translatedTexts.split("|")
                    const tempIngre = temp.slice(2, temp.length+1)
                    console.log(temp.slice(2, temp.length+1));
                    for(let i = 0; i < tempIngre.length; i++) {
                        recipe_ingredients[i].name = tempIngre[i];
                    }
                    console.log(recipe_ingredients)
                    
                    try {
                        // ... (rest of the translation code remains the same)
                    
                        const query = {_id: response[i]._id}
                        const updateSet = {
                            recipe_name: temp[0],
                            recipe_ingredients: recipe_ingredients,
                        }

    
                        const updateRecipe = await recipeModel.findOneAndUpdate(query, updateSet, {new: true})
                        if(!updateRecipe) {
                            console.log("Error updating recipe!")
                        } else {
                            console.log("Updated recipe:", updateRecipe)
                        }
    
                    
                        
                    } catch (error) {
                        console.error("Error in translation or update:", error)
                    }
                    
                } catch (error) {
                    
                }
            }



            // console.log(data)
            

            // Gửi yêu cầu dịch
         

            // const options = {
            //     method: 'POST',
            //     url: 'https://free-google-translator.p.rapidapi.com/external-api/free-google-translator',
            //     params: {
            //       from: 'en',
            //       to: 'vi',
            //       query: data['strInstructions']
            //     },
            //     headers: {
            //       'x-rapidapi-key': key,
            //       'x-rapidapi-host': 'free-google-translator.p.rapidapi.com',
            //       'Content-Type': 'application/json'
            //     },
            //     data: {
            //       translate: 'rapidapi'
            //     }
            //   };

            // const res = await axios.request(options);

            // // Kết quả dịch
            // const translatedTexts = res.data['trans'];
            // console.log(translatedTexts)

            // // Ánh xạ kết quả dịch lại vào đúng chỗ
            // const translatedInstructions = translatedTexts[0];  // Bản dịch của `strInstructions`
            // const translatedIngredients = ingredients.map((item, index) => ({
            //     name: translatedTexts[index + 1],  // Dịch tên ingredient
            //     measure: translatedTexts[index + 1 + ingredients.length]  // Dịch measure
            // }));
            // console.log(translatedInstructions)
            // console.log(translatedIngredients)




            // const foundRecipe = await recipeModel.findOne({recipe_id_crawl: data[`idMeal`]})
            // if(foundRecipe) continue
            // const newRecipe = await recipeModel.create({
            //     recipe_name: data["strMeal"],
            //     recipe_category: data[`strCategory`],
            //     recipe_desciption: translatedInstructions,
            //     recipe_image: data[`strMealThumb`] ?  data[`strMealThumb`] : "",
            //     recipe_id_crawl: data[`idMeal`],
            //     recipe_ingredients: translatedIngredients,
            //     recipe_youtube_url: data[`strYoutube`]? data[`strYoutube`]: ""
            // })
            // if(newRecipe) {
            //     console.log(`Insert OK ${t}`)
            // } else {
            //     console.log
            // }
        } catch (error) {
            console.log(error)
        }
    }
}

main()