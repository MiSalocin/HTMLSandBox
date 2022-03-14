let calculate = []
let memory = []
let valid = false
const operations = ["/","*","+"]
const answers = document.querySelector("#answer")
const body = document.querySelector("body")

// Handles with the buttons displayed on screen
function addChar(char) {
  inputHandler(char)
  answers.textContent = calculate.join("")
}

// Handles with the keys pressed
body.addEventListener("keydown", (event) => {
  inputHandler(event.key)
  answers.textContent = calculate.join("")
})

// Handles the paste command
body.addEventListener("paste", (event) => {
  Array.from((event.clipboardData || window.clipboardData)
    .getData('text/plain')).forEach(element => inputHandler(String(element)))
  answers.textContent = calculate.join("")
})

// Verify and add the received character to the array
function inputHandler(key) {

  // Corrects the string if it has line breaks
  key = key.replace(/(\r\n|\n|\r)/gm, "")

  // Remove blank spaces
  if (key == "" || key == " ") {
    return
  }

  // Deals with numbers
  else if(Number(key) || key == "0") {
    if (valid){
      calculate.pop()
      valid = false
    }
    
    calculate.push(key)
  }

  // Deals with the minus key
  else if (key === "-" && calculate[calculate.length - 1] != "-") {
    if (calculate[calculate.length - 1] == "+") {
      calculate.pop()
    }
    calculate.push(key)
  }

  // Deals with the operations
  else if (operations.includes(key)
  && calculate.length > 0
  && calculate[calculate.length - 1] != "-"){
    if (operations.includes(calculate[calculate.length - 1])){
      calculate[calculate.length - 1] = key
    }
    else calculate.push(key)
  }

  // Deals with parenthesis
  else if (key == "(" || key == ")") {

  }

  // Deals with decimal points
  else if (key == "."){

  }
  
  valid = false

  // Deals with the enter key
  if (key == "Enter") {
    result()
  }

  // Deals with deleting numbers
  else if (key == "Backspace" ) {
    calculate.pop()
  }

  // Deals with the clear button
  else if (key == "Clear") {
    valid = true
    for (let i = calculate.length; i > 0; i = calculate.length) {
      calculate.pop()
    }
  }
}

// Calculate the result using the primary array
function result() {
  while (!Number(calculate[calculate.length - 1])
  && calculate[calculate.length - 1] != 0
  && calculate.length > 0){
    calculate.pop()
  }

  let numbers = []
  let actions = []

  let numberID = 0
  calculate.forEach((element) => {
    if (numbers[numberID] == undefined) {
      numbers.push(element)

    } else if (operations.includes(element) || (element == "-" && numbers[numberID] != undefined)) {
      actions.push(element)
      numberID++

    } else {
      numbers[numberID] += element
    }
  })

  for (let e in numbers) {
    numbers[e] = Number(numbers[e])
  }

  while (actions.length > 0) {
    levelCalc(numbers, actions, "/", "*")
    levelCalc(numbers, actions, "-", "+")
  }

  function levelCalc(numArray, actArray, firstOp, secondOp) {
    let result
    let operation
    let index
    while (actArray.includes(firstOp)
    ||     actArray.includes(secondOp)) {
      operation = firstOp
      if ((actArray.indexOf(firstOp) > actArray.indexOf(secondOp)
      || !actArray.includes(firstOp))
      && actArray.includes(secondOp)) {
        operation = secondOp
      }
      index = actArray.indexOf(operation)
      let n1 = numArray[index]
      let n2 = numArray[index + 1]
      if (operation == firstOp)
        result = eval(n1 + firstOp + n2)
       else 
        result = eval(n1 + secondOp + n2)
      
      numArray[index] = result
      numArray.splice(index + 1, 1)
      actArray.splice(index, 1)
    }
  }


  inputHandler("Clear")
  calculate.push(String(numbers[0]))
}