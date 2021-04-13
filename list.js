//Fetch saved goal list and complete goal list from browser API, if nothing is saved, add empty array as string so it can be parsed later as JSON
let goalsArray = localStorage.getItem('goalsArray') || '[]';
let completedGoalsArray = localStorage.getItem('completedGoalsArray') || '[]';


// parse the string JSON to an array and add them to dom
goalsArray = JSON.parse(goalsArray);
// Add all saved items to goals list
for (let item of goalsArray)
  addToList(item);


completedGoalsArray = JSON.parse(completedGoalsArray);
// Add all saved items to completed goals list
for (let item of completedGoalsArray)
  addToCompletedGoals(item);


// Function created with name addItemToList which
function addItemToList() {
  //get user data from input field entered by user in page index.html
  const userInput = document.getElementById('myGoal').value;
  document.getElementById('myGoal').value = '';
  // check if user input is empty
  // if yes then show alert and return out of function
  if (userInput === '') {
    alert('please enter the goal name!! ');
    return;
  }
  let txt = addToList(userInput);
  addLinks(txt);
  goalsArray.push(userInput);
  saveGoalsList();
}

function addLinks(node) {
  let nodes = Array.from(node.parentNode.parentNode.children);
  let index = nodes.indexOf(node.parentNode);
  let text = node.innerText;
  fetch('https://api.dandelion.eu/datatxt/nex/v1?token=1a6a3a92444b4c6bb0c658888f9bf582&lang=en&text=' + text).then(res => {
    if (res.status !== 200)
      return;
    // Change text to add links for detected items
    let newText = text;
    res.json().then(body => {
      for (let item of body['annotations'])
        if (item.uri) {
          // When changing items to links, we are increasing length of text. So for future indexes to be accurate, we need to consider the new length
          let extraLength = newText.length - text.length;
          newText = newText.substring(0, item.start + extraLength) + '<a target="_blank" href= "' + item.uri + '">' + item['spot'] + '</a>' + newText.substring(item.end + extraLength);
        }

      node.innerHTML = newText;
      goalsArray[index] = newText;
      saveGoalsList();
    });
  });
}

// Function that deletes li from its parent ul and removes item from goals list
function deleteGoal(li) {
  // Get index from ul
  let nodes = Array.from(li.parentNode.children);
  let index = nodes.indexOf(li);
  // Remove from goals list using index
  goalsArray.splice(index, 1);
  saveGoalsList();
  li.remove();
}

// Function that adds item to completed goals and saves the array and then removes it from goals list
function completeGoal(li) {
  addToCompletedGoals(li.innerHTML);
  deleteGoal(li);
  completedGoalsArray.push(li.innerHTML);
  saveCompletedGoalsArray();
}

// Function that adds text to completed goals list
function addToCompletedGoals(text) {
  const completedList = document.createElement('li');
  const completed_ul = document.getElementById('completedList');
  const txt = document.createElement('tag');
  txt.innerHTML = text;
  completedList.appendChild(txt);
  completed_ul.append(completedList);
}

// Function that adds the text to goals list
function addToList(text) {
  // creates list <li> dynamically
  const listItem = document.createElement('li');
  //create text node for list item text
  const txt = document.createElement('tag');
  txt.innerHTML = text;
  // create input dynamically for deleting the list
  const btnDelete = document.createElement('input');
  // setting type to button
  btnDelete.type = 'button';
  // adding id of delete button and it will be same for all buttons
  btnDelete.id = 'btn_delete';
  // adding the value that user will see on page
  btnDelete.value = 'Delete Goal';
  // setting name to userInput in case we need to use it
  btnDelete.name = text;
  // button click function which remove the parent element of this(this means current position which is button)
  // this.parent will move the position from (button->list<li>)
  btnDelete.onclick = function () {
    deleteGoal(this.parentNode);
  };


  // create input dynamically for moving goals to the complete list
  const btnComplete = document.createElement('input');
  //Assign different attributes to the element.
  btnComplete.type = 'button';
  // adding id of delete button and it will be same for all buttons
  btnComplete.id = 'btn_complete';
  // adding the value that user will see on page
  btnComplete.value = 'Move to completed List';
  // setting name to userInput which is used to set the text of completed list
  btnComplete.name = text;

  // this function creates new list element
  // then it will fetch the ul list from html page
  // text node is created and data is taken from completed button name
  // text node is append to list (li) which is created in first line of this function
  // list is append to completed ul list
  // then li is removed from my goals.
  btnComplete.onclick = () => completeGoal(txt);

  // list appends text node
  listItem.appendChild(txt);
  // list appends btnDelete
  listItem.appendChild(btnDelete);
  // list appends btnComplete
  listItem.appendChild(btnComplete);

  // ul list is fetched from index.html
  const ul = document.getElementById('goalList');
  // ul appends li
  ul.append(listItem);
  return txt;
}

// Functions that save items from both goals and completed goals to localStorage browser API in order to keep them saved even after page is closed
function saveGoalsList() {
  localStorage.setItem('goalsArray', JSON.stringify(goalsArray));
}

function saveCompletedGoalsArray() {
  localStorage.setItem('completedGoalsArray', JSON.stringify(completedGoalsArray));
}

// on click function or event handler 
// when user click button this function is called
document.getElementById('btn').onclick = function () {
  // calls addItemToList function when this function is called
  addItemToList();
};


document.getElementById('clearBtn').onclick = function () {
  // clear completed goals list and completed goals array
  const completed_ul = document.getElementById('completedList');
  completed_ul.innerHTML = '';
  completedGoalsArray = [];
  saveCompletedGoalsArray();
};
