const testFunction = async () => {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  const data = await response.json();
  console.log(data.meals[0]);
};

testFunction();
