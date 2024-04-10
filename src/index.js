const express = require("express"); //Import express framework module
const morgan = require("morgan"); //Import morgan for middleware to log HTTP requests and errors
const menu = require("./models/menu.json"); //Import morgan for middleware to log HTTP requests and errors
const port = 5555; //Define port: first checks if available in environment variables

const app = express(); //Main express app
const router = express.Router(); 

app.use(morgan("tiny")); //Log request

const recommendationController = require("./controllers/Recommendations");
router.get("/recomendations", recommendationController.getRecommendation); 

const hourSuggestion = require("./controllers/HourSuggestions");
router.get("/suggestions", hourSuggestion.getHourSuggestion); 

app.get('/menu', (req, res) => {
    res.json(menu);
  });

app.use(router); 

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = {
    app
};