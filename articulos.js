const orientacionpantalla = screen.orientation
let clases = ['motos','cascos','indumentaria','accesorios']
let totalcarrito= 0
//---------------HEADER
const header = document.getElementById('header')
//----------------------------------------------------------------
const divlogoheader = document.createElement('div')
divlogoheader.setAttribute('class', 'col-4 col-lg-1 d-flex justify-content-center')
divlogoheader.setAttribute('id', 'divlogoheader')  //-------------------------------------Logo de inicio
divlogoheader.innerHTML = `
<img class="col-10" src="./assets/logos/logo_motos_punta_favicon.png" alt="Motos Punta">
`
//------------------------------------------------------------------
const divbotonesportrait = document.createElement('div')
divbotonesportrait.setAttribute('class', 'col-5 d-flex justify-content-around pt-3')
divbotonesportrait.setAttribute('id', 'divbotonesportrait')  //---------------------------Opciones vertical
divbotonesportrait.innerHTML = `
    <i class="bi bi-search botonportr" id="botonsearch"></i>
    <i class="bi bi-list botonportr" id="botonlista"></i>
    `
//-------------------------------------------------------------------
const divopcioneslandscape = document.createElement('div')
divopcioneslandscape.setAttribute('class', 'col-6 d-flex justify-content-around align-items-center')

clases.forEach(element => {
    const opcionclase = document.createElement('a')         //---------------------------Opciones horizontal
    opcionclase.setAttribute('href', `./${element}.html`)
    opcionclase.setAttribute('class','opcionclase')
    opcionclase.innerText = element.toUpperCase()
    divopcioneslandscape.append(opcionclase)
});
//-------------------------------------------------------------------

if(orientacionpantalla.type === "portrait-primary" || orientacionpantalla.type === "portrait-secondary"){
    header.appendChild(divlogoheader)
    header.append(divbotonesportrait)
} else if(orientacionpantalla.type === "landscape-primary" || orientacionpantalla.type === "landscape-secondary"){
    header.append(divopcioneslandscape)
    header.appendChild(divlogoheader)
}
//-------------------------------------------------------------------
//-------------------------------------------------------------------
const sectionarticulos = document.getElementById('sectionarticulos')
const body = document.querySelector('body')
let productos
let carrito = []
let productoswallpaper = []
let carritototal = []
let carouselInner_diapoindex = document.getElementById('carouselInner_diapoindex')
const modalbody = document.getElementById('modalbody')
let titulodelmodal = document.getElementById('staticBackdropLabel')
document.addEventListener('DOMContentLoaded', async () => {
const respuesta = await fetch('/json/productos.json')
productos = await respuesta.json()
productos.forEach(element => {
    if (element.clase===body.id) {
    if (element.wallpaper===true) {
        productoswallpaper.push(element)
    }

    const cardarticulo = document.createElement('div')            //---------------------------card del producto
    cardarticulo.setAttribute('class', 'card col-5 col-lg-2 m-1 cardarticulo d-flex flex-column align-items-center')
    cardarticulo.innerHTML = `                                   
    <img src="./assets/productos/${element.abreviado}.png" class="col-10" alt="${element.nombre}">
    <div class="card-body">
      <h5 class="card-title">${element.nombre}</h5>
      <p class="card-text">USD ${element.precio}</p>
    </div>
    `
    const botonagregarcarrito = document.createElement('button')
    botonagregarcarrito.setAttribute('class', 'botonagregarcarrito col-8 m-2')
    botonagregarcarrito.innerText = 'Agregar al carrito'
    botonagregarcarrito.onclick = () => {
        Toastify({

            text: `Agregaste ${element.nombre} al carrito`,
            
            duration: 3000
            
            }).showToast();
        totalcarrito= totalcarrito + element.precio
        element.cantidad = element.cantidad+1                                //---------------------------boton agregar al carrito
        if (carrito.includes(element)===false){
        carrito.push(element)
        localStorage.setItem('carrito', JSON.stringify(carrito))
        }else{

            let cantidad = document.getElementById(`cantidad${element.abreviado}`)
            if (cantidad) {
                cantidad.innerText=`Cantidad: ${element.cantidad}`                
            }
            localStorage.setItem('carrito', JSON.stringify(carrito))

        };

    }
    cardarticulo.append(botonagregarcarrito)
    sectionarticulos.append(cardarticulo)
}
});

productoswallpaper.forEach(element => {
    const itemcarousel = document.createElement('div')
    itemcarousel.setAttribute('class', 'carousel-item')
    itemcarousel.innerHTML= `
    <img src="./assets/wallpapers/${element.abreviado}.png" class="d-block w-100" alt="${element.nombre}">
    <div class="carousel-caption d-none d-md-block">
      <h5 class="overfy-hidden">${element.nombre}</h5>
      <p>Some representative placeholder content for the first slide.</p>
    </div>
    `
    if (productoswallpaper.indexOf(element)===0) {
        itemcarousel.setAttribute('class', 'carousel-item active')
    }
    carouselInner_diapoindex.append(itemcarousel)
});

const limpiarcarrito = document.getElementById('limpiarcarrito')
limpiarcarrito.onclick = () => {
    carrito=[]
    modalbody.innerHTML= ''
    totalcarrito=0
    titulodelmodal.innerText= `Total del carrito:       ${totalcarrito}`
    localStorage.clear()
    productos.forEach(element => {
        element.cantidad= 0
    });
}

})
const botonabrircarrito = document.getElementById('botonabrircarrito')
botonabrircarrito.onclick = () => {
    modalbody.innerHTML= ''
    carrito.forEach(element => {
    const divencarrito = document.createElement('div')
    divencarrito.setAttribute('class','d-flex justify-content-between')
    divencarrito.setAttribute('id',`divencarrito${element.nombre}`)
    divencarrito.innerHTML=`
    <img src="./assets/productos/${element.abreviado}.png" alt="${element.nombre}" class="col-3">
    <div class="divtextoencarrito col-7">
        <h4 class="overfy-hidden">${element.nombre}</h4>
        <p>U$S ${element.precio}</p>
        <p id="cantidad${element.abreviado}">Cantidad: ${element.cantidad}</p>                
    </div>                                     
    `                                                //---------------------------div en carrito
    const divdecantidades = document.createElement('div')
    divdecantidades.setAttribute('class','col-1')
    const botonsumarcantidad = document.createElement('button')
    botonsumarcantidad.setAttribute('class', 'col-12')
    botonsumarcantidad.innerText="+"
    botonsumarcantidad.onclick= () => {
        totalcarrito = totalcarrito + element.precio
        element.cantidad = element.cantidad+1
        let cantidad = document.getElementById(`cantidad${element.abreviado}`)
        cantidad.innerText=`Cantidad: ${element.cantidad}`
        titulodelmodal.innerText= `Total del carrito:       ${totalcarrito}`
    }
    divdecantidades.append(botonsumarcantidad)

    const botonsrestarcantidad = document.createElement('button')
    botonsrestarcantidad.innerText="-"
    botonsrestarcantidad.setAttribute('class', 'col-12')
    botonsrestarcantidad.onclick= () => {
        totalcarrito = totalcarrito - element.precio
        element.cantidad = element.cantidad-1
        if(element.cantidad===0){
            carrito.splice(carrito.indexOf(element))
            modalbody.remove(divencarrito)
        } else {
            let cantidad = document.getElementById(`cantidad${element.abreviado}`)
            cantidad.innerText=`Cantidad: ${element.cantidad}`   
            titulodelmodal.innerText= `Total del carrito:       ${totalcarrito}`
            
    
        }
    }
    divdecantidades.append(botonsrestarcantidad)
    divencarrito.append(divdecantidades)
    modalbody.append(divencarrito)
    titulodelmodal.innerText= `Total del carrito:       ${totalcarrito}`
    });
}
//-----------------------------------------------------------------

const carritoback = JSON.parse(localStorage.getItem('carrito'))
carritoback.forEach(element => {
    carrito.push(element)
    totalcarrito = totalcarrito + element.precio*element.cantidad
});



