const writeResponse = (response, key1, key2, key3, value1, value2, value3) => {
    response[key1] = value1;
    response[key2] = value2;
    response[key3] = value3;
    return response
  }
  
const getOneMissingParameter = (foodType1, foodType2) => {
  const foodTypes = ["meal", "dessert", "drink"];

  const missingFoodType = foodTypes.find(type => type !== foodType1 && type !== foodType2);
  return missingFoodType;
};

const getTwoMissingParameter = (foodType) => {
  const foodTypes = ["meal", "dessert", "drink"];

  const missingFoodTypes = foodTypes.filter(type => type !== foodType);
  return missingFoodTypes;

};

module.exports = {
  getTwoMissingParameter,
  getOneMissingParameter,
  writeResponse,
};
