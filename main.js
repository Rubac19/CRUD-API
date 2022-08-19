/* Hay que tener en cuenta la documentación del endPoint, los parametros son diferentes dependiendo de la api */
//Usamos el metodo callback, para insetar una función en el promesa
function leer(callback){
    fetch("https://62995fbc6f8c03a97841e0b2.mockapi.io/users")
    .then(function(respuesta){
        return respuesta.json();
    }).then(function(users){
        callback(users);
    });
}

function makeCard(user){
    //Creando una etiqueta Article
    const cardUser = document.createElement('article');
    //Asignando codigo HTML al Article
    cardUser.innerHTML=`
        <div class="card">
            <img src=${user.photo} class="card-img-top" >
            <div class="card-body">
                <h5 class="card-title">${user.name} ${user.lastname}</h5>
                <h5 class="card-title">${user.cellphone}</h5>
                <p class="card-text">${user.description}</p>
                <button class="js_delete">Eliminar</button>
                <button data-bs-toggle="modal" data-bs-target="#exampleModal" class="js_edit">Editar</button>
            </div>
        </div>
     `;
     //Agregando clases al Article
    cardUser.classList.add("col","col-4","mb-4");
    //Atrapamos el boton de eliminar
    cardUser.querySelector('.js_delete').onclick = function(){
        if(confirm("Estas seguro de ELIMINAR este USUARIO")){
            fetch(`https://62995fbc6f8c03a97841e0b2.mockapi.io/users/${user.id}`,{//Formato de mockapi
            method : 'DELETE',//metodo a ejecutarse
            }).then((respuesta)=> respuesta.json())
            .then((respuesta) => {
                cardUser.remove();//eliminando la tarjeta del código
                console.log("respuesta",respuesta);
                alert(`Se elemino correctamente el usuario ${user.name} ${user.lastname}`);
            });
        }
        
    };
    //Atrapamos el boton de editar
    cardUser.querySelector('.js_edit').onclick = function(){
        //Llenamos valores del formulario modal
        document.querySelector(".js_name_edit").value=user.name;
        document.querySelector(".js_lastname_edit").value=user.lastname;
        document.querySelector(".js_cellphone_edit").value=user.cellphone;
        document.querySelector(".js_description_edit").value=user.description;
        document.querySelector(".js_photo_edit").value=user.photo;
        document.querySelector(".js_id_edit").value=user.id;
    };
    //Retornamos el objeto
    return cardUser;
}

function addDom(node,container){
    //busca el contenedor principal donde se va agregar el nuevo elemento
    const app=document.getElementById(container);
    //Agregando el elemento creado
    app.appendChild(node);
}

function principalCrearTarjeta(){
    const agr=document.getElementById("container");
    agr.innerHTML="";
    leer(function(usuarios){
        usuarios.forEach((user)=>{
            addDom(makeCard(user),"container");
        })
    });
}

/* POST */

function registrarUser(){
    const form = document.querySelector("form");
    function obtenerValores(){
        return{
            name:document.querySelector(".js_name").value,
            lastname:document.querySelector(".js_lastname").value,
            cellphone:document.querySelector(".js_cellphone").value,
            description:document.querySelector(".js_description").value,
            photo:document.querySelector(".js_photo").value,
        };
    }
    form.onsubmit = function(event){
        event.preventDefault();
        fetch("https://62995fbc6f8c03a97841e0b2.mockapi.io/users",{
            method: "POST",
            body: JSON.stringify(obtenerValores()),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((respuesta) => respuesta.json())
        .then((respuesta) => {
            console.log(respuesta);
            principalCrearTarjeta();
            form.reset();
        })
        .catch((error)=> console.log("error",error));
    };
}

//Metodo Put
function registrarEventoFormularioEdit(){
    const form = document.querySelector(".js_form_edit");
    const btnClose = document.querySelector(".js_close");
    function obtenerValores(){
        return{
            name:document.querySelector(".js_name_edit").value,
            lastname:document.querySelector(".js_lastname_edit").value,
            cellphone:document.querySelector(".js_cellphone_edit").value,
            description:document.querySelector(".js_description_edit").value,
            photo:document.querySelector(".js_photo_edit").value,
        };
    }
    form.onsubmit = function(event){
        event.preventDefault();
        //Obtenemos el id, para actualizar
        let id = form.querySelector(".js_id_edit").value; 
        fetch(`https://62995fbc6f8c03a97841e0b2.mockapi.io/users/${id}`,{
            method:'PUT',
            body:JSON.stringify(obtenerValores()),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((respuesta)=>respuesta.json())
        .then((respuesta)=>{
            console.log("respuesta",respuesta);
            principalCrearTarjeta();//para que muestre de nuevo los card
            btnClose.click();//Se ejcuta el evento click del boton close
        }).catch(()=> alert("No se puedo actualizar el usuario con id: "+id));
    };
}

principalCrearTarjeta();
registrarUser();
registrarEventoFormularioEdit();