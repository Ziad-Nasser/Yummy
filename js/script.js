let mealsByNameList = [];
let dataRow = document.getElementById("dataRow");
let searchContainer = document.getElementById("searchContainer");

$(document).ready(() => {
  getSearchByName("").then(() => {
    $(".loading-screen").fadeOut(500);
    $("body").css("overflow", "auto");
  });
});
let navWidth = $(".nav-content").innerWidth();
function sideNav() {
  $(".nav-content").animate({ left: -navWidth }, 0);
  $(".side-menu").animate({ left: -navWidth }, 0);
  $(".menu-controller-icon span").on("click", function () {
    $(".menu-controller-icon span").toggleClass("fa-close");
    if ($(".nav-content").css("left") == "0px") {
      //close
      $(".nav-content").animate({ left: -navWidth }, 500);
      $(".side-menu").animate({ left: -navWidth }, 500);
      $("nav li").animate({ top: 300 }, 500);
    } else {
      //open
      $(".nav-content").animate({ left: 0 }, 500);
      $(".side-menu").animate({ left: 0 }, 500);
      // animate nav links
      for (let i = 0; i < 5; i++)
        $("nav li")
          .eq(i)
          .animate({ top: 0 }, (i + 9) * 100);
    }
  });
}
// Check if nav is open and close it
function closeNavIfOpen() {
  if ($(".nav-content").css("left") == "0px") {
    $(".nav-content").animate({ left: -navWidth }, 500);
    $(".side-menu").animate({ left: -navWidth }, 500);
    $(".menu-controller-icon span").toggleClass("fa-close");
  }
}
// When user clicks on nav links remove the side-menu
$("nav li a").on("click", function () {
  closeNavIfOpen();
});

async function getMealsByName() {
  sideNav();
  let mealsByNameAPI = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=`
  );
  let mealsByNameList = await mealsByNameAPI.json();
  displayMealsByName(mealsByNameList.meals);
}

function displayMealsByName(mealsByNameList) {
  let result = ``;
  for (let i = 0; i < mealsByNameList.length; i++) {
    result += `
        <div class="col-md-3">
            <div class="img-card position-relative" onclick="getMealsDetailsById(${mealsByNameList[i].idMeal})">
                <img src="${mealsByNameList[i].strMealThumb}" alt="${mealsByNameList[i].strMeal}" class="border border-0 rounded-2">
                    <div class="img-overlay position-absolute bg-white bg-opacity-75 border border-0 rounded-2 overflow-hidden">
                        <h2 class="meal-name d-flex align-items-center h-100">${mealsByNameList[i].strMeal}</h2>
                    </div>
            </div>
        </div>
        `;
  }
  dataRow.innerHTML = result;
}
getMealsByName();

async function getMealsDetailsById(idMeal) {
  closeNavIfOpen();
  $(".inner-loading-screen").fadeIn(300);
  let mealsByIdAPI = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
  );
  let mealsByIdList = await mealsByIdAPI.json();
  displayMealDetailsById(mealsByIdList);
  $(".inner-loading-screen").fadeOut(300);
}

function displayMealDetailsById(mealsByIdList) {
  searchContainer.innerHTML = ``;
  let tags = mealsByIdList.meals[0].strTags;
  let resultTags = ``;
  if (tags != null) {
    let arrTags = tags.split(",");
    for (let i = 0; i < arrTags.length; i++)
      resultTags += `<li class="border border-0 rounded-2 bg-danger-subtle text-danger-emphasis p-2">${arrTags[i]}</li>`;
  }
  let resultRecipes = ``;
  let ingredientsArr = [];
  let measuresArr = [];
  let recipesArr = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = `strIngredient${i}`;
    const measure = `strMeasure${i}`;
    const ingredients = mealsByIdList.meals[0][ingredient];
    const measures = mealsByIdList.meals[0][measure];
    if (ingredients !== "" && ingredients !== null) {
      ingredientsArr.push(ingredients);
      measuresArr.push(measures);
    }
  }
  for (let i = 0; i < measuresArr.length; i++) {
    const measuresArray = measuresArr[i];
    const ingredientsArray = ingredientsArr[i];
    recipesArr.push(`${measuresArray} ${ingredientsArray}`);
    resultRecipes += `<li class="border border-0 rounded-2 bg-info-subtle text-info-emphasis p-2">${recipesArr[i]}</li>`;
  }
  let result = `
        <div class="col-md-3">
        <div class="meal-caption">
            <img src="${mealsByIdList.meals[0].strMealThumb}" alt="${mealsByIdList.meals[0].strMeal}" class="border border-0 rounded-2">
            <h1 class="text-white">${mealsByIdList.meals[0].strMeal}</h1>
        </div>
    
    </div>
    <div class="col-md-9">
        <div class="meal-info text-white">
            <h2>Instructions</h2>
            <p class="mb-2">${mealsByIdList.meals[0].strInstructions}</p>
            <h2 class="mb-2">Area : ${mealsByIdList.meals[0].strArea}</h2>
            <h2 class="mb-2">Category : ${mealsByIdList.meals[0].strCategory}</h2>
            <div class="recipes mb-2">
                <h2 class="mb-2">Recipes :</h2>
                <ul class="d-flex flex-wrap gap-2">${resultRecipes}</ul>
            </div>
            <div class="tags mb-4">
                <h2 class="mb-2">Tags :</h2>
                <ul class="d-flex flex-wrap gap-2">${resultTags}</ul>
            </div>
            <ul class="d-flex flex-wrap gap-2">
            <li class="btn btn-success p-2"><a href="${mealsByIdList.meals[0].strSource}" target="_blank">Source</a></li>
            <li class="btn btn-danger p-2"><a href="${mealsByIdList.meals[0].strYoutube}" target="_blank">Youtube</a></li>
        </ul>
        </div>
    </div>
    `;
  dataRow.innerHTML = result;
}

function displaySearchInputs() {
  let searchInputResult = `
    <div class="row py-4">
        <div class="col-md-6">
            <input type="text" onkeyup="getSearchByName(this.value)" class="form-control text-white bg-transparent" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input type="text" onkeyup="getSearchByFirstLetter(this.value)" class="form-control text-white bg-transparent" placeholder="Search By First Letter" maxlength="1">
        </div>
    </div>`;
  searchContainer.innerHTML = searchInputResult;
  dataRow.innerHTML = ``;
}

async function getSearchByName(searchQuery) {
  $(".inner-loading-screen").fadeIn(300);
  let searchByNameAPI = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
  );
  let searchByNameList = await searchByNameAPI.json();
  displaySearchByName_FirstLetter(searchByNameList);
}

async function getSearchByFirstLetter(searchQuery) {
  $(".inner-loading-screen").fadeIn(300);
  let searchByFirstLetterAPI = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
  );
  let searchByFirstLetterList = await searchByFirstLetterAPI.json();
  displaySearchByName_FirstLetter(searchByFirstLetterList);
}

function displaySearchByName_FirstLetter(searchQuery) {
  if (searchQuery.meals != null) displayMealsByName(searchQuery.meals);
  $(".inner-loading-screen").fadeOut(300);
}

async function getMealsByCategories() {
  $(".inner-loading-screen").fadeIn(300);
  let mealsByCategoryAPI = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let mealsByCategoryList = await mealsByCategoryAPI.json();
  displayMealsByCategory(mealsByCategoryList.categories);
  $(".inner-loading-screen").fadeOut(300);
}

function displayMealsByCategory(mealsByCategoryList) {
  searchContainer.innerHTML = ``;
  let result = ``;
  for (let i = 0; i < mealsByCategoryList.length; i++) {
    result += `
        <div class="col-md-3">
            <div class="img-card position-relative" onclick="filterMealsByCategory('${mealsByCategoryList[i].strCategory}')">
                <img src="${mealsByCategoryList[i].strCategoryThumb}" alt="${mealsByCategoryList[i].strCategory}" class="border border-0 rounded-2">
                    <div class="img-overlay position-absolute text-center bg-white bg-opacity-75 border border-0 rounded-2 overflow-hidden">
                        <h2>${mealsByCategoryList[i].strCategory}</h2>
                        <p>${mealsByCategoryList[i].strCategoryDescription}</h2>
                    </div>
            </div>
        </div>
        `;
  }
  dataRow.innerHTML = result;
}

async function filterMealsByCategory(categoryName) {
  closeNavIfOpen();
  $(".inner-loading-screen").fadeIn(300);
  let filterByCategoryAPI = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName.trim()}`
  );
  let filterByCategoryList = await filterByCategoryAPI.json();
  filterByCategoryList = filterByCategoryList.meals.slice(0, 20);
  displayMealsByName(filterByCategoryList);
  $(".inner-loading-screen").fadeOut(300);
}

async function getMealsByArea() {
  $(".inner-loading-screen").fadeIn(300);
  let mealsByAreaAPI = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let mealsByAreaList = await mealsByAreaAPI.json();
  displayMealsByArea(mealsByAreaList.meals);
  $(".inner-loading-screen").fadeOut(300);
}

function displayMealsByArea(mealsByAreaList) {
  searchContainer.innerHTML = ``;
  let result = ``;
  for (let i = 0; i < mealsByAreaList.length; i++) {
    result += `
        <div class="col-md-3">
            <div class="text-white text-center cursor-pointer" onclick="filterMealsByArea('${mealsByAreaList[i].strArea}')">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h2>${mealsByAreaList[i].strArea}</h2>   
            </div>
        </div>
        `;
  }
  dataRow.innerHTML = result;
}

async function filterMealsByArea(areaName) {
  closeNavIfOpen();
  $(".inner-loading-screen").fadeIn(300);
  let filterByAreaAPI = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`
  );
  let filterByAreaList = await filterByAreaAPI.json();
  filterByAreaList = filterByAreaList.meals.slice(0, 20);
  displayMealsByName(filterByAreaList);
  $(".inner-loading-screen").fadeOut(300);
}

//----------------------IngredientsPage-------------
async function getMealsByIngredients() {
  $(".inner-loading-screen").fadeIn(300);
  let mealsByIngredientsAPI = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let mealsByIngredientsList = await mealsByIngredientsAPI.json();
  mealsByIngredientsList = mealsByIngredientsList.meals.slice(0, 20);
  displayMealsByIngredients(mealsByIngredientsList);
  $(".inner-loading-screen").fadeOut(300);
}

function displayMealsByIngredients(mealsByIngredientsList) {
  searchContainer.innerHTML = ``;
  let result = ``;
  for (let i = 0; i < mealsByIngredientsList.length; i++) {
    result += `
        <div class="col-md-3">
            <div class="text-white text-center cursor-pointer" onclick="filterMealsByIngredients('${
              mealsByIngredientsList[i].strIngredient
            }')">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h2>${mealsByIngredientsList[i].strIngredient}</h2>  
                <p>${mealsByIngredientsList[i].strDescription.slice(0, 100)}<p> 
            </div>
        </div>
        `;
  }
  dataRow.innerHTML = result;
}

async function filterMealsByIngredients(ingredientName) {
  closeNavIfOpen();
  $(".inner-loading-screen").fadeIn(300);
  let filterByIngredientsAPI = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`
  );
  let filterByIngredientsList = await filterByIngredientsAPI.json();
  filterByIngredientsList = filterByIngredientsList.meals.slice(0, 20);
  displayMealsByName(filterByIngredientsList);
  $(".inner-loading-screen").fadeOut(300);
}

//------------- ContactPage----------
function contactForm() {
  searchContainer.innerHTML = ``;
  let result = `
    <div class="min-vh-100 w-75 mx-auto d-flex align-items-center justify-content-center">

                    <form action="#">
                        <div class="row g-4" id="">
                            <div class="col-md-6">
                                <input type="text" id="nameInput"  class="form-control "
                                    placeholder="Enter Your Name">
                                <p id="nameAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Special characters and numbers not allowed
                                </p>
                            </div>
                            <div class="col-md-6">
                                <input type="email" id="emailInput" class="form-control "
                                    placeholder="Enter Your Email">
                                <p id="emailAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Email not valid *exemple@yyy.zzz
                                </p>
                            </div>
                            <div class="col-md-6">
                                <input type="tel" id="phoneInput"  class="form-control "
                                    placeholder="Enter Your Phone">
                                <p id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Enter valid Phone Number
                                </p>
                            </div>
                            <div class="col-md-6">
                                <input type="number" id="ageInput"  class="form-control "
                                    placeholder="Enter Your Age" min="18" max="60">
                                <p id="ageAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Enter valid age
                                </p>
    
                            </div>
                            <div class="col-md-6">
                                <input type="password" id="passInput"  class="form-control "
                                    placeholder="Enter Your Password">
                                <p id="passAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                                </p>
                            </div>
                            <div class="col-md-6">
                                <input type="password" id="repassInput"  class="form-control "
                                    placeholder="RePassword">
                                <p id="repassAlert" class="alert alert-danger w-100 mt-2 d-none text-center">
                                    Enter valid repassword
                                </p>
                            </div>
                            <div class="col text-center">
                                <button id="submitBtn" onclick="getMealsByName();" class="btn btn-outline-danger cursor-pointer" disabled>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>   
    `;
  dataRow.innerHTML = result;
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const phoneInput = document.getElementById("phoneInput");
  const ageInput = document.getElementById("ageInput");
  const passInput = document.getElementById("passInput");
  const repassInput = document.getElementById("repassInput");
  const nameAlert = document.getElementById("nameAlert");
  const emailAlert = document.getElementById("emailAlert");
  const phoneAlert = document.getElementById("phoneAlert");
  const ageAlert = document.getElementById("ageAlert");
  const passAlert = document.getElementById("passAlert");
  const repassAlert = document.getElementById("repassAlert");

  function validateInput(inputElement, regexFunc, alertElement) {
    if (inputElement.value.trim() !== "" && regexFunc(inputElement.value)) {
      alertElement.classList.replace("d-block", "d-none");
    } else {
      alertElement.classList.replace("d-none", "d-block");
    }
    checkAllValidation();
  }

  function validateRepassInput() {
    if (
      repassInput.value.trim() !== "" &&
      passRegexFunc(repassInput.value) &&
      repassInput.value === passInput.value
    ) {
      repassAlert.classList.replace("d-block", "d-none");
    } else {
      repassAlert.classList.replace("d-none", "d-block");
    }
    checkAllValidation();
  }

  nameInput.addEventListener("blur", () =>
    validateInput(nameInput, nameRegex, nameAlert)
  );
  nameInput.addEventListener("input", () =>
    validateInput(nameInput, nameRegex, nameAlert)
  );

  emailInput.addEventListener("blur", () =>
    validateInput(emailInput, emailRegexFunc, emailAlert)
  );
  emailInput.addEventListener("input", () =>
    validateInput(emailInput, emailRegexFunc, emailAlert)
  );

  phoneInput.addEventListener("blur", () =>
    validateInput(phoneInput, phoneRegexFunc, phoneAlert)
  );
  phoneInput.addEventListener("input", () =>
    validateInput(phoneInput, phoneRegexFunc, phoneAlert)
  );

  ageInput.addEventListener("blur", () =>
    validateInput(ageInput, ageRegexFunc, ageAlert)
  );
  ageInput.addEventListener("input", () =>
    validateInput(ageInput, ageRegexFunc, ageAlert)
  );

  passInput.addEventListener("blur", () =>
    validateInput(passInput, passRegexFunc, passAlert)
  );
  passInput.addEventListener("input", () =>
    validateInput(passInput, passRegexFunc, passAlert)
  );

  repassInput.addEventListener("blur", validateRepassInput);
  repassInput.addEventListener("input", validateRepassInput);

  function emailRegexFunc(value) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(value);
  }

  function nameRegex(value) {
    const nameRegex = /^[a-z ,.'-]+$/i;
    return nameRegex.test(value);
  }

  function phoneRegexFunc(value) {
    const phoneRegex = /^(\d{10}|\d{11})$/;
    return phoneRegex.test(value);
  }

  function ageRegexFunc(value) {
    const ageRegex = /^(1[8-9]|[2-5][0-9]|60)$/;
    return ageRegex.test(value);
  }

  function passRegexFunc(value) {
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passRegex.test(value);
  }

  function checkAllValidation() {
    const submitBtn = document.getElementById("submitBtn");
    if (
      nameRegex(nameInput.value) &&
      emailRegexFunc(emailInput.value) &&
      phoneRegexFunc(phoneInput.value) &&
      ageRegexFunc(ageInput.value) &&
      passRegexFunc(passInput.value) &&
      passRegexFunc(repassInput.value) &&
      repassInput.value === passInput.value
    ) {
      submitBtn.removeAttribute("disabled");
    } else {
      submitBtn.setAttribute("disabled", "");
    }
  }
}
