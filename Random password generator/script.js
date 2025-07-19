function generatePassword(
  length,
  includeLowercase,
  includeUppercase,
  includeNumbers,
  includeSymbols
) {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";
  let allowedChars = "";
  let password = "";
  allowedChars += includeLowercase ? lower : "";
  allowedChars += includeUppercase ? upper : "";
  allowedChars += includeNumbers ? numberChars : "";
  allowedChars += includeSymbols ? symbols : "";
  if (length <= 0) {
    return "Password length must be greater than 0";
  }
  if (allowedChars.length === 0) {
    return `(at least 1 set of characters must be selected)`;
  }
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allowedChars.length);
    password += allowedChars[randomIndex];
  }
  return password;
}

document.addEventListener("DOMContentLoaded", function () {
  const passwordOutput = document.getElementById("passwordOutput");
  const lengthSlider = document.getElementById("passwordLength");
  const lengthValue = document.getElementById("lengthValue");
  const includeLowercase = document.getElementById("includeLowercase");
  const includeUppercase = document.getElementById("includeUppercase");
  const includeNumbers = document.getElementById("includeNumbers");
  const includeSymbols = document.getElementById("includeSymbols");
  const generateBtn = document.getElementById("generateBtn");
  const clearBtn = document.getElementById("clearBtn");
  const copyBtn = document.getElementById("copyBtn");

  lengthSlider.addEventListener("input", function () {
    lengthValue.textContent = this.value;
  });

  generateBtn.addEventListener("click", function () {
    const passwordLength = parseInt(lengthSlider.value);
    const includeLower = includeLowercase.checked;
    const includeUpper = includeUppercase.checked;
    const includeNum = includeNumbers.checked;
    const includeSymb = includeSymbols.checked;

    let password = generatePassword(
      passwordLength,
      includeLower,
      includeUpper,
      includeNum,
      includeSymb
    );
    passwordOutput.value = password;
    console.log(`Generated Password : ${password}`);
  });

  clearBtn.addEventListener("click", function () {
    passwordOutput.value = "";
  });

  copyBtn.addEventListener("click", function () {
    if (passwordOutput.value) {
      passwordOutput.select();
      document.execCommand("copy");
      alert("Password copied to clipboard!");
    }
  });

  const initialPassword = generatePassword(12, false, true, true, true);
  passwordOutput.value = initialPassword;
  console.log(`Generated Password : ${initialPassword}`);
});
