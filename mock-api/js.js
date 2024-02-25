// https://65194606818c4e98ac603751.mockapi.io/users/userdata



function fetchUsers() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        loadUsers(this.responseText);
      }
    };
    
    xhttp.open("GET", " https://65194606818c4e98ac603751.mockapi.io/users", true);
    xhttp.send();
  }
    function addUser(user) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 201) {
        fetchUsers();
        document.getElementById("inputName").value = "";
        document.getElementById("inputAge").value = "";
        document.getElementById("inputState").value = "State";
      }
    };


    xhttp.open("POST", "https://65194606818c4e98ac603751.mockapi.io/users", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
  }

  function loadUsers(responseText) {
    const usersList = document.getElementById('userList');
    const users = JSON.parse(responseText);
    usersList.innerHTML = '';
  
    users.forEach((user) => {
      const trow = document.createElement('tr');
      trow.innerHTML = `
        <td class="name">${user.userName}</td>
        <td class="age">${user.age}</td>
        <td class="state">${user.state}</td>
        <td class="functions">
          <button class="edit" data-id="${user.id}"><i class="fa-solid fa-pen"></i></button><button class="deleteB" data-id="${user.id}"><i class="fa-solid fa-trash-can"></i></button><button class="save" data-id="${user.id}" style="display: none;">Save</button>
        </td>
      `;
      usersList.appendChild(trow);
    });
  }
  




  
  function deleteUser(userId) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 204) {
          console.log("User deleted successfully");
        } else if (this.status == 404) {
          console.log("User not found");
        } else {
          console.log("Error deleting user. Status: " + this.status);
        }
        fetchUsers();
      }
    };
  
    xhttp.open("DELETE", `https://65194606818c4e98ac603751.mockapi.io/users/${userId}`, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
  }
  
  function updateUser(userId, editedUser) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          console.log("updated users  successfully", editedUser);
        } else {
          console.log("Error in updating the users (error.status): " + this.status);
        }
      }
    };
  
    xhttp.open("PUT", `https://65194606818c4e98ac603751.mockapi.io/users${userId}`, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(editedUser));
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    const usersList = document.getElementById("userList");
    const addModal = document.getElementById("modalAddUser");
    const addUserButton = document.getElementById("addUser");
  
    addUserButton.addEventListener("click", () => {
      addModal.style.display = "block";
    });
  
    addModal.addEventListener("click", function (event) {
      if (event.target === addModal) {
        addModal.style.display = "none";
      }
    });
  
    const addUserSubmitButton = document.getElementById("addUserButton");
    addUserSubmitButton.addEventListener("click", function () {
      const inputName = document.getElementById("inputName").value;
      const inputAge = document.getElementById("inputAge").value;
      const inputState = document.getElementById("inputState").value;
  
      const newUser = {
        userName: inputName,
        age: inputAge,
        state: inputState,
      };
  
      addUser(newUser);
      addModal.style.display = "none";
    });
  
    usersList.addEventListener("click", function (event) {
      if (event.target.classList.contains("deleteB")) {
        const userId = event.target.getAttribute("data-id");
        const userName = event.target.closest("tr").querySelector(".name").textContent;
        const deleteModal = document.getElementById("deleteModal");
        const userDeleted = document.getElementById("userDeleted");
        userDeleted.textContent = userName;
        const dbox=document.querySelector(".delbox");
        dbox.style.display="block";

  
        const confirmDeleteButton = document.querySelector(".confirmDelete");
        confirmDeleteButton.addEventListener("click", function () {
          deleteUser(userId);
          deleteModal.style.display = "none";
        });
  
        const cancelDeleteButton = document.querySelector(".deleteCancel");
        cancelDeleteButton.addEventListener("click", function () {
          deleteModal.style.display = "none";
        });
      }
    });
  
    usersList.addEventListener("click", function (event) {
      if (event.target.classList.contains("edit")) {
        const userId = event.target.getAttribute("data-id");
        const userRow = event.target.closest("tr");
        const userNameCell = userRow.querySelector(".name");
        const userAgeCell = userRow.querySelector(".age");
        const userStateCell = userRow.querySelector(".state");
  
        userNameCell.innerHTML = `<input type="text" id="editName" value="${userNameCell.textContent}">`;
        userAgeCell.innerHTML = `<input type="number" id="editAge" value="${userAgeCell.textContent}" min="0" max="100">`;
        userStateCell.innerHTML = `<input type="text" id="editState" value="${userStateCell.textContent}">`;
  
        const saveButton = document.createElement("button");
        saveButton.className = "save";
        saveButton.textContent = "Save";
        userRow.querySelector(".functions").appendChild(saveButton);
        event.target.style.display = "none";
  
        saveButton.addEventListener("click", function () {
          const editName = document.getElementById("editName").value;
          const editedAge = document.getElementById("editAge").value;
          const editedState = document.getElementById("editState").value;
          updateUser(userId, { userName: editName, age: editedAge, state: editedState });
  
          userNameCell.innerHTML = editName;
          userAgeCell.innerHTML = editedAge;
          userStateCell.innerHTML = editedState;
  
          saveButton.remove();
          event.target.style.display = "inline-block";
        });
      }
    });
  
    fetchUsers();
  });
  
