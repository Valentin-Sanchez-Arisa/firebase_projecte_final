const db = firebase.firestore();


function sendPasswordReset() {
    var auth = firebase.auth();
    var emailAddress = document.getElementById('loginRecuperar').value;
    var usersRef = db.collection('usuari');

    usersRef.where('email', '==', emailAddress).get().then(function(querySnapshot) {
        if (!querySnapshot.empty) {
        // El correo existe en la colección de usuarios
        auth.sendPasswordResetEmail(emailAddress).then(function() {
          // Email enviado
            alert('Correo de recuperación enviado.');
        }).catch(function(error) {
          // Ocurrió un error al enviar el correo de recuperación
            console.error('Error al enviar el correo de recuperación', error);
            alert('Error al enviar el correo de recuperación: ' + error.message);
        });
        } else {
        // El correo no existe en la colección de usuarios
        alert('El correo introducido no existe en nuestros registros.');
        }
    }).catch(function(error) {
      // Ocurrió un error al verificar el correo en Firestore
        console.error('Error al verificar el correo en Firestore', error);
        alert('Error al verificar el correo en nuestros registros: ' + error.message);
    });
}