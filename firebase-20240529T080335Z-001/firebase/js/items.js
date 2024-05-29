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
                let image = "imatges/LogoPico.png"; 
                if (doc.data().image != null) {
                    image = doc.data().image;
                }

                let username = "Nombre del Usuario"; 
                if (doc.data().username) {
                    username = doc.data().username;
                }

                document.getElementById("listItems").innerHTML += `
                    <tr class="divInicios item-container" id="divInicio">
                        <td colspan="3" style="text-align: center; position: relative; width: 50%; height: 50%">
                            <div class="post">
                                <div class="parteUser">
                                    <div class="fotoPerfil">
                                        <img src="imatges/ico.png" alt="Perfil">
                                    </div>
                                    <div class="dropdown" style="position: absolute; top: 10px; right: 10px;">
                                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-ellipsis-v"></i>
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <button class="dropdown-item" onclick="editItem('${doc.id}')">Editar</button>
                                        <button class="dropdown-item" onclick="deleteItem('${doc.id}', '${doc.data().image}')">Eliminar</button>
                                    </div>
                                </div>
                                    <div>
                                        ${username}
                                    </div>
                                </div>
                                <div class="divContenido">
                                    <div class="divImgContenido">
                                        <img src="${image}" alt="Contenido" class="rounded image-item" style="max-width: 100%; height: 100%;">
                                    </div>
                                    <div>
                                        ${doc.data().content}
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
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




document.getElementById('image').addEventListener('change', function() {
    var file = this.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var thumbnail = document.getElementById('thumbnail');
            thumbnail.src = e.target.result;
            thumbnail.style.visibility = 'visible';
        }
        reader.readAsDataURL(file);
    }
});

