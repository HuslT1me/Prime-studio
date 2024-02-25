let newObjLesson;

function fetchPrices(category, value, oldPriceElem, priceElem){
  fetch(`https://ba8cca62efa88fa6.mokky.dev/lessons?category=${category}&value=${value}`)
  .then(res => {
  return res.json();
  })
  .then(data => {
    newObjLesson = data[0];
    oldPriceElem.textContent = data[0].oldPrice;
    priceElem.textContent = data[0].price;
  });
}
