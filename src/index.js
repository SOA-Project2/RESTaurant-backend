const express = require("express");
const morgan = require("morgan"); 
const menu = require("./models/menu.json"); 
const port = 5555; 

const app = express(); //Main express app
const router = express.Router(); 
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan("tiny")); //Log request

const recommendationController = require("./controllers/Recommendations");
router.get("/recommendations", recommendationController.getRecommendation); 

const hourSuggestion = require("./controllers/HourSuggestions");
router.get("/suggestions", hourSuggestion.getHourSuggestion); 

const submitFeedback = require("./controllers/ChatBot");
router.post("/feedback", submitFeedback.submitFeedback); 

const getFeedback = require("./controllers/ChatBot");
router.get("/getFeedback", getFeedback.getFeedback); 


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