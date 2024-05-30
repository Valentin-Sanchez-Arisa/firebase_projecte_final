const items = db.collection("publicacio");
const storageRef = storage.ref();


function addItem(doc) {
    var uid = firebase.auth().currentUser.uid;
    var content = document.getElementById("content").value;
    var imageFile = document.getElementById("image").files[0];

    // Crear una referencia a 'images/uid/filename'
    var imageRef = storageRef.child('images/' + uid + '/' + imageFile.name);

    // Subir el archivo de imagen a Firebase Storage
    var uploadTask = imageRef.put(imageFile);

    // Escuchar los cambios de estado
    uploadTask.on('state_changed', function(snapshot) {
        // Puedes mostrar una barra de progreso con snapshot.bytesTransferred / snapshot.totalBytes
    }, function(error) {
        // Manejar el error de subida
        showAlert("Error al subir la imagen", "alert-danger");
    }, function() {
        // Cuando la subida se ha completado con éxito, obtener la URL de la imagen
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            // Añadir un nuevo documento a la colección 'publicacio' con la URL de la imagen
            db.collection('publicacio').add({
                uid: uid,
                content: content,
                image: downloadURL,
            })
            .then(() => {
                loadItems();
                document.getElementById("content").value = "";
                document.getElementById("image").value = "";

                showAlert("Element guardat correctament", "alert-success");
            })
            .catch(() => {
                showAlert("Error al intentar guardar l'element", "alert-danger");
            });
        });
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
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Agrega una animación suave
    });
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
            document.getElementById("listItems").innerHTML = "";
            arrayItems.forEach((doc) => {
                let image = "imatges/LogoPico.png"; 
                
                if (doc.data().image != null) {
                    image = doc.data().image;
                }

                let uid = doc.data().uid;
                
                db.collection('usuari').doc(uid).get()
                    .then((userDoc) => {
                        var username = userDoc.data().nomUsuari;
                        var enlaceFoto = userDoc.data().foto;

                        document.getElementById("listItems").innerHTML += `
                        <div class="post">
                            <div class="parteUser">
                                <div class="fotoPerfil">
                                    <img src="${enlaceFoto}" alt="Perfil">
                                </div>
                                <div class="username">
                                    ${username}
                                </div>
                                <div class="dropdown">
                                    <button class="dropdown-toggle"  id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-ellipsis-v"></i>
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <button class="dropdown-item" onclick="editItem('${doc.id}')">Editar</button>
                                        <button class="dropdown-item" onclick="deleteItem('${doc.id}', '${doc.data().image}')">Eliminar</button>
                                    </div>
                                </div>
                            </div>
                            <div class="divContenido">
                                <div class="divImgContenido">
                                    <img src="${image}">
                                </div>
                                <div>
                                    ${doc.data().content}
                                </div>
                            </div>
                        </div>
                        `;
                    })
                    .catch(() => {
                        if(document.getElementById("inicio").style.display == "none"){
                            showAlert("Error al obtener el nombre de usuario", "alert-danger");
                        }
                    });
            });
        })
        .catch(() => {
            if(document.getElementById("inicio").style.display == "none"){
                showAlert("Error al mostrar els elements", "alert-danger");
            }
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

