const items = db.collection("publicacio");
const storageRef = storage.ref();
const comentari = db.collection("comentari");
var uniqueId = 0;
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
   
                
                //guardar el id del usuario actual en una variable
                var uidActual = firebase.auth().currentUser.uid;

                if (doc.data().image != null) {
                    image = doc.data().image;
                }

                let uid = doc.data().uid;
                
                db.collection('usuari').doc(uid).get()
                    .then((userDoc) => {
                        var username = userDoc.data().nomUsuari;
                        var enlaceFoto = userDoc.data().foto;

                        if (uidActual == uid) {

                            document.getElementById("listItems").insertAdjacentHTML('beforeend',`
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
                                        <img src="${image}" class="post-image" alt="${doc.data().content}">
                                    </div>
                                    <div class="divTextoContenido">
                                        ${doc.data().content}
                                    </div>
                                    <div class="divLike">
                                    <button class="btnLike" id="botonComentario${uniqueId}">Comentaris</button>
                                </div>
                                </div>
                            </div>
                            `);
                        }else{
                            
                            
                            document.getElementById("listItems").insertAdjacentHTML('beforeend',`
                            <div class="post">
                                <div class="parteUser">
                                    <div class="fotoPerfil">
                                        <img src="${enlaceFoto}" alt="Perfil">
                                    </div>
                                    <div class="username">
                                        ${username}
                                    </div>
                                    <div class="dropdown">
                               
                                    </div>
                                </div>
                                <div class="divContenido">
                                    <div class="divImgContenido">
                                        <img src="${image}" class="post-image" alt="${doc.data().content}">
                                    </div>
                                    <div class="divTextoContenido">
                                        ${doc.data().content}
                                    </div>
                                    <div class="divLike">
                                        <button class="btnLike" id="botonComentario${uniqueId}">Comentaris</button>
                                    </div>
                                 
                                </div>
                            </div>
                            `);
                            

                        }

                        

                        document.getElementById(`botonComentario${uniqueId}`).addEventListener('click', function() {
                            irComentarios(doc.id); // Suponiendo que doc.id es el ID del objeto que quieres pasar
                        });

                        uniqueId++;

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



// Poner para hacer zoom en la imagen
document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("imageModal");
    var modalImg = document.getElementById("modalImage");
    var captionText = document.getElementById("caption");
    var closeBtn = document.getElementsByClassName("close")[0];

    document.addEventListener("click", function(event) {
        if (event.target.classList.contains("post-image")) {
            modal.style.display = "block";
            modalImg.src = event.target.src;
            captionText.innerHTML = event.target.alt;
        }
    });

    closeBtn.onclick = function() {
        modal.style.display = "none";
    }
});






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
    console.log("IMagen");
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







// .......................................................

// COMENTARIOS DE LOS POSTS

// .......................................................


//Listener para el boton de comentarios






function irComentarios(idComentari) {

    console.log("ID: " + idComentari);
    document.getElementById("inicio").style.display = "none";
    document.getElementById("itemsForm").style.display = "none";
    document.getElementById("divPaginaComentario").style.display = "flex";
    document.getElementById("listItems").style.display = "none";

    //Encontrar el post con el id
    db.collection('publicacio').doc(idComentari).get()
            .then((doc) => {
                let image = "imatges/LogoPico.png";
                if (doc.data().image != null) {
                    image = doc.data().image;
                }
                let uid = doc.data().uid;
                db.collection('usuari').doc(uid).get()
                    .then((userDoc) => {
                        var username = userDoc.data().nomUsuari;
                        var enlaceFoto = userDoc.data().foto;
                        document.getElementById("divPaginaComentario").innerHTML = `
                        <div class="post">
                            <div class="parteUser">
                                <div class="fotoPerfil">
                                    <img src="${enlaceFoto}" alt="Perfil">
                                </div>
                                <div class="username">
                                    ${username}
                                </div>
                            </div>
                            <div class="divContenido">
                                <div class="divImgContenido">
                                    <img src="${image}" alt="${doc.data().content}">
                                </div>
                                <div class="divTextoContenido">
                                    ${doc.data().content}
                                </div>
                            </div>
                            <div class="addComent">
                                <div class="divComentario2">
                                    <textarea id="comentario" class="textComent" placeholder="Escriu un comentari"></textarea> 
                                    <input type="file" class="inputImg" id="image" style="display: none;">
				                    <label for="image" class="custom-file-upload">
					                    <img src="imatges/upload.png" alt="Upload Icon" class="upload-icon">
					                    Pujar contingut
				                    </label>

                                    <button onclick="addComentari('${idComentari}')" class="boton">Comentar</button>
                                </div>

                            </div>
                                    
                        </div>

                        <br>
                        <h2>Comentaris</h2>
                        <br>

                        `;
                    })
                    .catch(() => {
                        showAlert("Error al obtener el nombre de usuario", "alert-danger");
                    });
            })
            .catch(() => {
                showAlert("Error al obtener el post", "alert-danger");
            });


    loadComentaris(idComentari);


}





// Añadir un comentario

function addComentari(idComentari) {
    var uid = firebase.auth().currentUser.uid;
    var content = document.getElementById("comentario").value;
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
            // Añadir un nuevo documento a la colección 'comentari' con la URL de la imagen
            db.collection('comentari').add({
                usuari: uid,
                missatge: content,
                publicacio: idComentari,
                data: new Date().toLocaleString(),
                imatge: downloadURL ? downloadURL : null
            })
            .then(() => {
                document.getElementById("comentario").value = "";
                loadComentaris(idComentari);
                

                showAlert("Comentari guardat correctament", "alert-success");
            })
          
        });

    });
}







// Cargar los comentarios de un post




function loadComentaris(idPublicacion) {
  
    var comentari = db.collection("comentari");
    document.getElementById("comentarios").style.display = "flex";
    selectAll(comentari)
        .then((arrayItems) => {
            //Recorrer todos los comentarios

            arrayItems.forEach((doc) => {
                
                let usuariComentador = doc.data().usuari;
                let missatgeComentario = doc.data().missatge;
                let dataComentario = doc.data().data;
                let imatgeComentario = doc.data().imatge;
                let publicacioComentada = doc.data().publicacio;

                console.log("ID: " + idPublicacion);
                console.log("ID2: " + publicacioComentada);
                console.log("Usuario que comenta: " + usuariComentador);
                console.log("Mensaje: " + missatgeComentario);
                console.log("Fecha: " + dataComentario);
                console.log("Imagen: " + imatgeComentario);
                console.log("-----------------");

            
                if (idPublicacion == publicacioComentada) {
                    console.log("Comentario encontrado");
                    db.collection('usuari').doc(usuariComentador).get()
                        .then((userDoc) => {
                            var username = userDoc.data().nomUsuari;
                            var enlaceFoto = userDoc.data().foto;

                            
                            
                            if (imatgeComentario == null) {
                                
                                document.getElementById("divPaginaComentario").insertAdjacentHTML('beforeend', `
                                <div class="comentario">
                                    <div class="parteUser">
                                        <div class="fotoPerfil">
                                            <img src="${enlaceFoto}" alt="Perfil">
                                        </div>
                                        <div class="username">
                                            ${username}
                                        </div>
                                    </div>
                                    <div class="divContenido">
                                        <div class="divTextoContenido">
                                            ${missatgeComentario}
                                        </div>
                                    </div>
                                </div>

                                <br>
                            `);
                            console.log("Elemento encontrado");
                        
                      
                    
                            }else{
                                document.getElementById("divPaginaComentario").insertAdjacentHTML('beforeend', `
                                <div class="comentario">
                                    <div class="parteUser">
                                        <div class="fotoPerfil">
                                            <img src="${enlaceFoto}" alt="Perfil">
                                        </div>
                                        <div class="username">
                                            ${username}
                                        </div>
                                    </div>
                                    <div class="divContenido">
                                        <div class="divImgContenido">
                                            <img src="${imatgeComentario}">
                                        </div>
                                        <div class="divTextoContenido">
                                            ${missatgeComentario}
                                        </div>
                       
                                    </div>
                                </div>

                                <br>
                            `);
                            console.log("Elemento encontrado");
                        }
                        }
                    )
            
                }
            });
        })
    .catch(() => {
        showAlert("Error al mostrar els elements", "alert-danger");
    });
}




