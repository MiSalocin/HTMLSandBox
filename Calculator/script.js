const answers = document.querySelector("#answer")
const body = document.querySelector("body")
const operations = ["/","*","+"]
let calculate = []
let memory = []
let depth = 0
let valid = false

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
  const lastInput = calculate[calculate.length-1]
  // Corrects the string if it has line breaks
  key = key.replace(/(\r\n|\n|\r)/gm, "")

  // Remove blank spaces
  if (key == "" || key == " ") {
    return
  }

  // Deals with numbers
  else if(Number(key) || key == "0") {
    if (valid){
      inputHandler("Clear")
      valid = false
    }
    calculate.push(key)
  }

  // Deals with the minus key
  else if (key === "-" && lastInput != "-") {
    if (lastInput == "+") {
      calculate.pop()
    }
    calculate.push(key)
  }

  // Deals with the operations
  else if (operations.includes(key)
  && calculate.length>0&&lastInput!="-"){
    if(operations.includes(lastInput)){
      calculate[calculate.length-1] = key
    }
    else calculate.push(key)
  }

  // Deals with parenthesis
  else if (key == "(") {
    depth++ 
    calculate.push(key)
  }

  // Deals with parenthesis
  else if (key == ")") {
    if (depth > 0 && Number(lastInput) ){
      calculate.push(key)
      depth-=1
    }
  }

  // Deals with decimal points
  else if (key == "."){
    for (let i = calculate.length - 1; i >= 0; i -= 1) {
      if (operations.includes(calculate[i]) || calculate[i] == "-" || i == 0) {
        calculate.push(key)
        break
      } else if (calculate[i] == ".") {
        break
      }
    }
    if (calculate.length == 0) 
      calculate.push(key)
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

  
  for (let number in calculate) {
        
  }

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

  memory.push(calculate.join(''))
  console.log(memory)
  calculate = String((numbers[0])).split("")
  valid = true
}
