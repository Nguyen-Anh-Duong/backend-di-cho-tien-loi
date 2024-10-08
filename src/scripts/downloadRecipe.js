const axios = require('axios')
const mongoose = require('mongoose');
const recipeModel = require('../models/recipe.model');

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
            const response = await axios.get(API_URL);
            const data = response.data.meals[0]
            // console.log(data)
            let ingredients = []
            for(let i = 1; i <= 15; i++) {
                let ingredient = data[`strIngredient${i}`];
                let measure = data[`strMeasure${i}`];
            
                // Check if both ingredient and measure exist
                if (ingredient && measure) {
                    let temp = {
                        name: ingredient,
                        measure: measure
                    };
                    ingredients.push(temp);
                }
            } 
            // console.log(ingredients)
            const text = data['strInstructions'];
            // const options = {
            //     method: 'POST',
            //     url: 'https://google-api31.p.rapidapi.com/translate',
            //     headers: {
            //       'x-rapidapi-key': key,
            //       'x-rapidapi-host': 'google-api31.p.rapidapi.com',
            //       'Content-Type': 'application/json'
            //     },
            //     data: {
            //         text: text,
            //       to: 'vi',
            //       from_lang: ''
            //     }
            //   };

              
            // const options = {
            //     method: 'POST',
            //     url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
            //     headers: {
            //     'x-rapidapi-key': key,
            //     'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
            //     'Content-Type': 'application/json'
            //     },
            //     data: {
            //     from: 'auto',
            //     to: 'vi',
            //     text: text
            //     }
            // };

            // // const {rsOK} = await axios.post('https://libretranslate.com/translate', {
            // //     q: text,
            // //     source: 'en',
            // //     target: 'vi',
            // //     format: 'text'
            // // });  
            // const res = await axios.request(options)
            // console.log(res.data['trans'])
            // const translated = res.data['trans']

            //TODO
            // Chuẩn bị các chuỗi cần dịch
            const textToTranslate = [
                data['strInstructions'],  // Dịch instructions
                ...ingredients.map(item => item.name),  // Dịch tất cả tên ingredients
                ...ingredients.map(item => item.measure)  // Dịch tất cả measure
            ];

            // Gửi yêu cầu dịch
            const options = {
                method: 'POST',
                url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
                headers: {
                    'x-rapidapi-key': RAPID_API_KEY,
                    'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
                    'Content-Type': 'application/json'
                },
                data: {
                    from: 'auto',
                    to: 'vi',
                    text: textToTranslate // Gửi toàn bộ mảng text cần dịch
                }
            };

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

            const res = await axios.request(options);

            // Kết quả dịch
            const translatedTexts = res.data['translation'];
            console.log(translatedTexts)

            // Ánh xạ kết quả dịch lại vào đúng chỗ
            const translatedInstructions = translatedTexts[0];  // Bản dịch của `strInstructions`
            const translatedIngredients = ingredients.map((item, index) => ({
                name: translatedTexts[index + 1],  // Dịch tên ingredient
                measure: translatedTexts[index + 1 + ingredients.length]  // Dịch measure
            }));
            console.log(translatedInstructions)
            console.log(translatedIngredients)




            const foundRecipe = await recipeModel.findOne({recipe_id_crawl: data[`idMeal`]})
            if(foundRecipe) continue
            const newRecipe = await recipeModel.create({
                recipe_name: data["strMeal"],
                recipe_category: data[`strCategory`],
                recipe_desciption: translatedInstructions,
                recipe_image: data[`strMealThumb`] ?  data[`strMealThumb`] : "",
                recipe_id_crawl: data[`idMeal`],
                recipe_ingredients: translatedIngredients,
                recipe_youtube_url: data[`strYoutube`]? data[`strYoutube`]: ""
            })
            if(newRecipe) {
                console.log(`Insert OK ${t}`)
            } else {
                console.log
            }
        } catch (error) {
            console.log(error)
        }
    }
}

main()