const axios = require('axios')
const {translate} = require('@vitalets/google-translate-api')
const {HttpProxyAgent} = require('http-proxy-agent');
const http = require('https');
const ingredientsModel = require('../models/ingredients.model');
const mongoose = require('mongoose')


const API_URL = "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
const agent = new HttpProxyAgent('http://103.123.246.162:8080');
const RAPID_API_KEY = 'ad4264eb0cmsh25d2f0eb8ff8eebp12f991jsn844061a51936'
const mongoURI = 'mongodb://localhost:27017/di-cho-tien-loi'
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));
const key = 'bbe166f3f2msh54b7a9cb98f9a46p17760bjsn02c5adb21dc8'
async function importIngredients() {
    try {
        const response = await axios.get(API_URL);
        const ingredients = response.data.meals
        let count = 0
        const index = 3
        console.log('dataOK')
        for(let ingredient of ingredients) {
            if(ingredient.idIngredient>=index) break
            count++
            const strIngredient = ingredient?.strIngredient || "null";
            // const options = {
            //     method: 'POST',
            //     url: 'https://google-api31.p.rapidapi.com/translate',
            //     headers: {
            //       'x-rapidapi-key': key,
            //       'x-rapidapi-host': 'google-api31.p.rapidapi.com',
            //       'Content-Type': 'application/json'
            //     },
            //     data: {
            //         text: strIngredient,
            //       to: 'vi',
            //       from_lang: ''
            //     }
            //   };
            

              const {data} = await axios.post('https://libretranslate.com/translate', {
                q: strIngredient,
                source: 'en',
                target: 'vi',
                format: 'text'
            });
            console,log(data)
            // const {data} = await axios.request(options);
            // const {translated} = data[0]
            // console.log( {
            //     name_en: strIngredient,
            //     name_vi: translated,
            //     image: 'https://www.themealdb.com/images/ingredients/'+strIngredient+'.png',
            //     thumbnail: 'https://www.themealdb.com/images/ingredients/'+strIngredient+'-Small.png'
            // })
            // await ingredientsModel.create({
            //     ingredient_name: strIngredient,
            //     ingredient_name_vi: translated,
            //     ingredient_image: 'https://www.themealdb.com/images/ingredients/'+strIngredient+'.png',
            //     ingredient_thumbnail: 'https://www.themealdb.com/images/ingredients/'+strIngredient+'-Small.png'
            // })
            // console.log(`insert::${count}`)
        }
    } catch (error) {
        console.log(error)
    }
}
importIngredients()

