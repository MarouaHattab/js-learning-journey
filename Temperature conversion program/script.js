const textbox = document.getElementById("textbox");
const ToFahrenheit = document.getElementById("ToFahrenheit");
const ToCelsius = document.getElementById("ToCelsius");
const result = document.getElementById("result");
let temp;
function convert() {
  if (ToCelsius.checked) {
    temp = Number(textbox.value);
    temp = temp * (9 / 5) - 32;
    // console.log(temp);
    // result.textContent = `${temp} °c`;
    result.textContent = temp.toFixed(1) + " °c"; // Displaying the result with one decimal place
  } else if (ToFahrenheit.checked) {
    temp = Number(textbox.value);
    temp = temp * (9 / 5) + 32;

    // console.log(temp);
    result.textContent = temp.toFixed(1) + " °c"; // Displaying the result with one decimal place
  } else {
    result.textContent = "Please select a unit to convert.";
  }
}
