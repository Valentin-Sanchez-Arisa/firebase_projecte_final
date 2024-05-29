const items = db.collection("items");

function addItem(doc) {
    add(items, doc)
        .then(() => {
            loadItems();
            document.getElementById("content").value = "";
            document.getElementById("image").value = "";

            showAlert("Element guardat correctament", "alert-success");
        })
        .catch(() => {
            showAlert("Error al intentar guardar l'element", "alert-danger");
        });
}

function deleteItem(id) {
    deleteById(items, id)
        .then(() => {
            loadItems();
            showAlert("Element eliminat correctament", "alert-success");
        }).catch(() => {
            showAlert("Error al intentar eliminar l'element", "alert-danger");
        });
}

function editItem(id) {
    document.getElementById("elementId").value = id;
    document.getElementById("thumbnail").style.visibility = "visible";
    selectById(items, id)
        .then((doc) => {
            document.getElementById("content").value = doc.data().content;
            document.getElementById("thumbnail").src = doc.data().image;
        })
        .catch(() => {
            showAlert("Error al intentar editar l'element", "alert-danger");
        });
}
function loadItems() {
    selectAll(items)
        .then((arrayItems) => {
            document.getElementById("listItems").innerHTML = `<tr>
                                                                <th></th>
                                                                <th></th>
                                                            </tr>`;
            arrayItems.forEach((doc) => {
                let image = "";
                if (doc.data().image != null) {
                    image = `<div class="image-container">
                                <div class="barra-separadora"></div> <!-- Aquí agregamos la barra separadora encima de la imagen -->
                                <img src="${doc.data().image}" class="rounded image-item">
                             </div>`;
                }
                document.getElementById("listItems").innerHTML += `
                                                                 <tr class="divInicios item-container" id="divInicio">
                                                                    <td colspan="3" style="text-align: center; position: relative; width: 50%; height: 50%">
                                                                        <div class="dropdown" style="position: absolute; top: 10px; left: 10px;">
                                                                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                <i class="fas fa-ellipsis-v"></i>
                                                                            </button>
                                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                                <button class="dropdown-item" onclick="editItem('${doc.id}')">Editar</button>
                                                                                <button class="dropdown-item" onclick="deleteItem('${doc.id}', '${doc.data().image}')">Eliminar</button>
                                                                            </div>
                                                                        </div>
                                                                        ${image} </br>
                                                                        <div style="text-align: center;">
                                                                            ${doc.data().content}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                </br>`;
                                                                
            });
        })
        .catch(() => {
            showAlert("Error al mostrar els elements", "alert-danger");
        });
}





function updateItem(id, doc) {
    updateById(items, id, doc)
        .then(() => {
            loadItems();

            document.getElementById("elementId").value = "";
            document.getElementById("content").value = "";
            document.getElementById("image").value = "";
            document.getElementById("thumbnail").style.visibility = "hidden";

            showAlert("Element actualitzat correctament", "alert-success");
        })
        .catch(() => {
            showAlert("Error al intentar actualitzat l'element", "alert-danger");
        });
}
