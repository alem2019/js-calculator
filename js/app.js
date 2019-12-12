/**
 * @license
 * Copyright (c) 2019 computecodes.com.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const buttons = document.getElementById("button-container");
const screenOutput = document.querySelector("#screen-content");
const optInput = ["+", "-", "*", "/"];
const nonOptInput = [".", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

let equalSignPressed = false;
let index = 0;

buttons.addEventListener("click", operateCalculator);
//screenOutput.innerHTML = "0";

function operateCalculator(e) {
  if (screenOutput.innerText == "0") {
    clearScreen();
  }
  let keyContent = e.target.textContent;
  if (keyContent == "C") {
    clearScreen();
  }
  if (keyContent == "del") {
    deleteLascChar(screenOutput.textContent);
  }

  // Clear the screen before starting another calculation
  resetScreen();

  //The if else handles both numeric value and operation signs
  if (
    nonOptInput.includes(keyContent) ||
    optInput.includes(keyContent) ||
    keyContent == "%"
  ) {
    let tempResult = "";

    tempResult += keyContent;

    //Make sure the first input is not one of the operators signs
    if (screenOutput.textContent == "" && optInput.includes(tempResult)) {
      tempResult = "";
    }

    /*
    Allow only one operator sign. For example If the last input is '+'
    and the user enters '*', the system delete the '+' and display the '*'

    */
    if (optInput.includes(tempResult)) {
      if (optInput.includes(getLastChar(screenOutput.textContent))) {
        deleteLascChar(screenOutput.textContent);
      }
    }

    //let us handle the decimal point
    let tempScreenOutput = "";
    if (optInput.includes(tempResult)) {
      //when the users enters an operator, what is the index of screen content
      index = screenOutput.textContent.length;
    }

    /*
    Starting from the screen content at the index value till the user enters another operator
    make sure there is no duplicate decimal points.
    */
    tempScreenOutput = screenOutput.textContent.substring(
      index,
      screenOutput.textContent.length
    );
    if (tempResult == ".") {
      if (/\./.test(tempScreenOutput) == true) {
        tempResult = "";
      }
    }

    /*
   If users forgets '*' after '%', the system inserts '*' for them

   */
    if (nonOptInput.includes(tempResult)) {
      if (getLastChar(screenOutput.textContent) == "%") {
        tempResult = "*" + tempResult;
      }
    }

    screenOutput.textContent += tempResult;
  }

  // Now display the calculation result
  displayResult(e);
}

/*
 The functions are listed below
 */


function displayResult(e) {
  if (e.target.textContent == "=") {
    if (screenOutput.textContent == "") {
      screenOutput.textContent = ""; //do nothing
    }

    if (!screenOutput.textContent == "") {
      if (optInput.includes(getLastChar(screenOutput.textContent))) {
        //before evaluation make sure the last char is not an operator sign
        deleteLascChar(screenOutput.textContent); //if the last char is an operator, remove it
      } else {
        // Replace the % sign with '*1/100'
        let tempOutput = screenOutput.textContent.replace(/%/g, "*1/100");

        //Only if it is necessary, round to two decimal places and display the result
        let result = Math.round(eval(tempOutput) * 100) / 100;
        if (result > Number.MAX_SAFE_INTEGER) {
          result = result.toExponential(); //This is just to limit the length of the result on screen
        }
        screenOutput.textContent = result;
        equalSignPressed = true;
      }
    }
  }
}

/*
 If the screen display is a result, clear the screen before entering a new input
 */
function resetScreen() {
  if (equalSignPressed) {
    clearScreen();
    equalSignPressed = false;
  }
}

function deleteLascChar(screenDisplay) {
  screenOutput.textContent = screenDisplay.substring(
    0,
    screenDisplay.length - 1
  );
}

function clearScreen() {
  screenOutput.textContent = "";
}

function getLastChar(screenDisplay) {
  return screenDisplay.substring(screenDisplay.length - 1);
}
