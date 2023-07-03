function createTable() {
    var name = document.getElementById("name").value;
    var surname = document.getElementById("surname").value;
    var age = document.getElementById("age").value;

    if (name === "" || surname === "" || age === "") {
        alert("Заполните все поля.");
        return;
    }
     
    var table = document.getElementById("dataTable");
    var row = table.insertRow();
    
    var nameCell = row.insertCell(0);
    nameCell.innerHTML = name;
    
    var surnameCell = row.insertCell(1);
    surnameCell.innerHTML = surname;
    
    var ageCell = row.insertCell(2);
    ageCell.innerHTML = age;
    
    var actionsCell = row.insertCell(3);
    
    var editButton = document.createElement("button");
    editButton.innerHTML = '<img src="icons/edit.svg" alt="Edit" />';
    editButton.className = "icon-button";
    editButton.onclick = function() {
        editRow(row);
    };
    
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<img src="icons/delete.svg" alt="Delete" />';
    deleteButton.className = "icon-button";
    deleteButton.onclick = function() {
        deleteRow(row);
    }; 
    
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    
    clearForm();   

    
    

    // Создаем объект данных для отправки на сервер
    var data = {
        name: name,
        surname: surname,
        age: age
    };

    // Отправляем запрос POST на сервер для создания пользователя
    fetch("http://localhost:3007/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(function(response) {
        if (response.ok) {
            window.location.reload(); //вот такую штуку надо
            // Если запрос успешен, добавляем данные в таблицу
        
        } else {
            throw new Error("Ошибка создания пользователя.");
        }
    })
    /*.then(function(user) {     
        // Создаем новую строку в таблице с данными пользователя
        var row = table.insertRow();

        var nameCell = row.insertCell(0);
        nameCell.innerHTML = user.name;

        var surnameCell = row.insertCell(1);
        surnameCell.innerHTML = user.surname;

        var ageCell = row.insertCell(2);
        ageCell.innerHTML = user.age;

        var actionsCell = row.insertCell(3);

        var editButton = document.createElement("button");
        editButton.innerHTML = '<img src="icons/edit.svg" alt="Edit" />';
        editButton.className = "icon-button";
        editButton.onclick = function() {
            editRow(row, user.id);
        };

        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<img src="icons/delete.svg" alt="Delete" />';
        deleteButton.className = "icon-button";
        deleteButton.onclick = function() {
            deleteRow(row, user.id);
        };

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        clearForm();  
    }) */
    .catch(function(error) {
        alert(error.message);
    });
}

function editRow(row, userId) { 
    var nameCell = row.cells[0];
    var surnameCell = row.cells[1];
    var ageCell = row.cells[2];
    var actionsCell = row.cells[3];

    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = nameCell.innerHTML;
    nameCell.innerHTML = "";
    nameCell.appendChild(nameInput);

    var surnameInput = document.createElement("input");
    surnameInput.type = "text";
    surnameInput.value = surnameCell.innerHTML;
    surnameCell.innerHTML = "";
    surnameCell.appendChild(surnameInput);

    var ageInput = document.createElement("input");
    ageInput.type = "number";
    ageInput.value = ageCell.innerHTML;
    ageCell.innerHTML = "";
    ageCell.appendChild(ageInput);

    var saveButton = document.createElement("button");
    saveButton.innerHTML = '<img src="icons/save.svg" alt="Save" />'
    saveButton.className = "icon-button";
    saveButton.onclick = function() {
        saveRow(row, userId);
    };

    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<img src="icons/delete.svg" alt="Delete" />'
    deleteButton.className = "icon-button";
    deleteButton.onclick = function() {
        deleteRow(row, userId);
    };

    actionsCell.innerHTML = "";
    actionsCell.appendChild(saveButton);
    actionsCell.appendChild(deleteButton);
}

function saveRow(row, userId) {
    var nameInput = row.cells[0].querySelector("input");
    var surnameInput = row.cells[1].querySelector("input");
    var ageInput = row.cells[2].querySelector("input");

    var newName = nameInput.value;
    var newSurname = surnameInput.value;
    var newAge = ageInput.value;

    if (newName === "" || newSurname === "" || newAge === "") {
        alert("Заполните все поля.");
        return;
    }

    // Создаем объект данных для отправки на сервер
    var data = {
        name: newName,
        surname: newSurname,
        age: newAge
    };

    // Отправляем запрос PATCH на сервер для обновления данных пользователя
    fetch(`http://localhost:3007/users/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(function(response) {
        if (response.ok) {
            window.location.reload();
            // Если запрос успешен, обновляем данные в таблице
            //return response.json();
            //window.location.reload(); //тут менял
        } else {
            throw new Error("Ошибка обновления пользователя.");
        }
    })
    .then(function(user) {
        /* row.cells[0].innerHTML = user.name;
        row.cells[1].innerHTML = user.surname;
        row.cells[2].innerHTML = user.age; */
        row.cells[0].innerHTML = newName;
        row.cells[0].innerHTML = newSurname;
        row.cells[0].innerHTML = newAge;

        var editButton = document.createElement("button");
        editButton.innerHTML = '<img src="icons/edit.svg" alt="Edit" />'
        editButton.className = "icon-button";
        editButton.onclick = function() {
            editRow(row, user.id);
        };

        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<img src="icons/delete.svg" alt="Delete" />';
        deleteButton.className = "icon-button";
        deleteButton.onclick = function() {
            deleteRow(row, user.id);
        };

        var actionsCell = row.cells[3];
        actionsCell.innerHTML = "";
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
    })
    .catch(function(error) {
        alert(error.message);
    });
}

function deleteRow(row, userId) {
    // Отправляем запрос DELETE на сервер для удаления пользователя
    fetch(`http://localhost:3007/users/${userId}`, {
        method: "DELETE"
    })
    .then(function(response) {
        if (response.ok) {
            // Если запрос успешен, удаляем строку из таблицы
            row.parentNode.removeChild(row);
        } else {
            throw new Error("Ошибка удаления пользователя.");
        }
    })
    .catch(function(error) {
        alert(error.message);
    });
}

// Загрузка данных с бд при загрузке страницы
window.addEventListener("DOMContentLoaded", function() {
    
    fetch("http://localhost:3007/users")  // Отправляем запрос GET на сервер для получения данных пользователей
    .then(function(response) {
        if (response.ok) {
            return response.json()
        } else {
            throw new Error("Ошибка получения данных.");
        }
    })
    .then(function(users) {
        var table = document.getElementById("dataTable");

        // Создаем строки таблицы для каждого пользователя
        users.forEach(function(user) {
            var row = table.insertRow();

            var nameCell = row.insertCell(0);
            nameCell.innerHTML = user.name;

            var surnameCell = row.insertCell(1);
            surnameCell.innerHTML = user.surname;

            var ageCell = row.insertCell(2);
            ageCell.innerHTML = user.age;

            var actionsCell = row.insertCell(3);

            var editButton = document.createElement("button");
            editButton.innerHTML = '<img src="icons/edit.svg" alt="Edit" />';
            editButton.className = "icon-button";
            editButton.onclick = function() {
                editRow(row, user.id);
            };

            var deleteButton = document.createElement("button");
            deleteButton.innerHTML = '<img src="icons/delete.svg" alt="Delete" />';
            deleteButton.className = "icon-button";
            deleteButton.onclick = function() {
                deleteRow(row, user.id);
            };

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
        });
    })
    .catch(function(error) {
        alert(error.message);
    });
});

function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("surname").value = "";
    document.getElementById("age").value = "";
}
