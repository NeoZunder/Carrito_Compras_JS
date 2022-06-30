const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content; //GUARDAR EL <TEMPLATE> COMO UN DOCUMENTFRAGMENT.
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
//.content => es un propiedad que se les aplica a los etiquetas template para transformarlas en un documentFragment.
//console.log(templateCard);
let carrito = { //Un objeto carrito para agregar los productos

}

document.addEventListener('DOMContentLoaded', ()=>{ //Se va a pedir los datos de la api cuando se cargue la pagina completamente.
    fetchData();
})

cards.addEventListener('click', (e)=>{ //EVENTO AÑADIR A CARRITO
    addCarrito(e)
 });

 items.addEventListener('click', e => {
    btnAccion(e);
 })


const fetchData = async () => {
    try{
        const res = await fetch('api.json'); //Espera los datos en formato json
        const data = await res.json(); //Transforma los datos en formato json a un array
        //console.log(data);
        pintarCards(data); //Muestra los productos en la pantalla
    }
    catch (error){
        console.log(error);
    }
}

const pintarCards = data => {
     data.forEach(producto => { //Para cada elemento del array de productos.
        templateCard.querySelector('h5').textContent = producto.title; //Cambio cada h5 por el titulo de cada producto
        templateCard.querySelector('p').textContent = producto.precio;  //Cambio cada p por el precio de cada producto
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl); //Modificamos el atributo source
        templateCard.querySelector('button').dataset.id = producto.id; //Los atributos data-*  permiten almacenar información adicional sobre un elemento HTML 

        const clone = templateCard.cloneNode(true); //hago una copia del template con su respectivo producto
        fragment.appendChild(clone); //Añadimos la copia al Fragment
     });
     cards.appendChild(fragment); //Añadimos el Fragment completo a la lista de cards del HTML. 
}

const addCarrito = (e)=>{
    //e.target.classList.contains('dark-btn');
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement) //ParentElement: 
    }
    e.stopPropagation();
}

const setCarrito = (objeto) => {
    
    const producto = {
        id : objeto.querySelector('.btn-dark').dataset.id,
        title : objeto.querySelector('h5').textContent,
        precio : objeto.querySelector('p').textContent,
        cantidad : 1
    }
    
    if(carrito.hasOwnProperty(producto.id)){ //Pregunto si el producto se encuentra dentro de carrito
        producto.cantidad = carrito[producto.id].cantidad + 1; //si existe el producto dentro de carrito, aumento la cantidad en 1

    }

    carrito[producto.id] = {...producto}; //Estoy creando o aumentando la cantidad del producto en el Carrito.
    pintarCarrito();
}

const pintarCarrito = ()=>{
 console.log(carrito);
 items.innerHTML = '';

 Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector('th').textContent = producto.id;
    templateCarrito.querySelectorAll('td')[0].textContent = producto.title;
    templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad //querySelectorAll toma todos los elementos con etiqueta td, [0] seria el primer td, [1] tomaria el segundo td asi sucesivamente.
    templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
    templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
    templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;

    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
 })
 items.appendChild(fragment);

 pintarFooter();
}

const pintarFooter = () => {
    footer.innerHTML = '';
    if (Object.keys(carrito).length === 0){
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0); //REVISAR ESTA FUNCION
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0
    ); //REVISAR ESTA FUNCION

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);

    footer.appendChild(fragment);

    const btnVaciar = document.getElementById('vaciar-carrito');
    btnVaciar.addEventListener('click', ()=>{
        carrito = {};
        pintarCarrito();
    })
}

const btnAccion = e => {
    //Accion de aumentar cantidad de productos
    if(e.target.classList.contains('btn-info')){
       const producto = carrito[e.target.dataset.id];
       producto.cantidad = carrito[e.target.dataset.id].cantidad + 1;
       carrito[e.target.dataset.id] = {...producto}
       pintarCarrito();
    }

    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad = carrito[e.target.dataset.id].cantidad -1 ;
        carrito[e.target.dataset.id] = {...producto}
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito();
    }

    e.stopPropagation();
}


