window.onload = generateTodos();

// TASK 5.8 -: Integrate Pagination of Api in '/read-item' & '.add_item' & show more Button
function generateTodos() {
  axios
    .get("/read-item") 
    .then((res) => {
      // console.log(res);

      if (res.data.status !== 200) {
        alert(res.data.message);
        return;
      }

      //  console.log(res.data.data);
      const todos = res.data.data;

      const todoListELement = document.getElementById("item_list");
      //console.log(todoListElement);
      todoListELement.insertAdjacentHTML(
        "beforeend",
        todos
          .map((item) => {
            return `
            <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <span class="item-text"> ${item.todo}</span>
            <div>
                <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
          </li>`;
          })
          .join("")
      );
    })
    .catch((err) => console.log(err));
}

document.addEventListener("click", (event) => {
  //console.log("clicking");
  //console.log(event.target);
  if (event.target.classList.contains("edit-me")) {
    //console.log("clicked on edit");
    //console.log(event.target.getAttribute("data-id"));
    const todoId = event.target.getAttribute("data-id");
    const newTodo = prompt("Enter New Task");
    //console.log(newTodo);
    axios
      .post("/edit-item", { newTodo, todoId })
      .then((res) => {
        //console.log(res);
        if (res.data.status !== 200) {
          alert(res.data.message);
          return;
        }

        const todoTextElement =
          event.target.parentElement.parentElement.querySelector(".item-text");
        //console.log(todoTextElement)
        todoTextElement.innerHTML = newTodo;
      })
      .catch((err) => console.log(err));
  } else if (event.target.classList.contains("delete-me")) {
    //console.log("clicked on delete");
    //console.log(event.target.getAttribute("data-id"))
    const todoId = event.target.getAttribute("data-id");

    axios
      .post("/delete-item", { todoId })
      .then((res) => {
        //console.log(res);
        if (res.data.status !== 200) {
          alert(res.data.message);
          return;
        }
        const todoElement = event.target.parentElement.parentElement;
        //console.log(todoElement);
        todoElement.remove();
      })
      .catch((err) => console.log(err));
  } else if (event.target.classList.contains("add_item")) {
    //console.log("clicked on add item");
    const inputElement = document.getElementById("create_field");
    const todo = inputElement.value;
    //console.log(todo);

    axios
      .post("/create-item", { todo })
      .then((res) => {
        // console.log(res);
        if (res.data.status != 201) {
          alert(res.data.message);
          return;
        }

        inputElement.value = ""; //Clear the input field

        // console.log(res.data.data);

        const todoListELement = document.getElementById("item_list");
        todoListELement.insertAdjacentHTML(
          "beforeend",
          `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <span class="item-text"> ${res.data.data.todo}</span>
            <div>
                <button data-id="${res.data.data._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                <button data-id="${res.data.data._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
          </li>`
        );
      })
      .catch((err) => console.log(err));
  } else if (event.target.classList.contains("logoutBtn")) {
    //console.log("logout clicked");
    axios
      .post("/logout")
      .then((res) => {
        //console.log(res);
        if (res.status !== 200) {
          alert(res.data.message);
          return;
        }

        // Redirect to login page
        window.location.href = "/login";
      })
      .catch((err) => console.log(err));
  } else if (event.target.classList.contains("logout-All-Btn")) {
    //console.log("logout All  clicked");
    axios
      .post("/logout-from-all")
      .then((res) => {
        //console.log(res);
        if (res.status !== 200) {
          alert(res.data.message);
          return;
        }
        // Redirect to login page
        window.location.href = "/login";
      })
      .catch((err) => console.log(err));
  }
});
