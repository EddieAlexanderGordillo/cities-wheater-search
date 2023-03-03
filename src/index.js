const main = document.querySelector('.main');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
  formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
  e.preventDefault();
  // validar
  const ciudad = document.querySelector('#ciudad').value;
  const pais = document.querySelector('#pais').value;
  if (ciudad === '' || pais === '') {
    // Hubo un errror
    mostrarError('Ambos campos son obligatorios');
    return;
  }
  console.log(ciudad);
  //   consultar la api
  consultarApi(ciudad, pais);
}

function mostrarError(mensaje) {
  // verificar si ya hay un alerta
  const alerta = document.querySelector('.alerta');
  if (!alerta) {
    // crear alerta
    const alerta = document.createElement('div');
    alerta.classList.add('alerta');
    alerta.innerHTML = ` 
        <strong>Error!</strong>
        <span>${mensaje}</span>
        `;
    main.appendChild(alerta);
    // eliminar alerta despues de 3sg
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}
function consultarApi(ciudad, pais) {
  const appId = '87ebb2abf0a3d50d777ea1fb2f078cf0';
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
  Spinner(); //muestar el spinner

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      limpiarHtml(); //limpiar el html previo
      if (datos.cod === '404') {
        mostrarError('Ciudad no encontrada');
        return;
      }
      //   imprime la respuesta en el html
      mostrarClima(datos);
    });
}

function mostrarClima(datos) {
  const {
    name,
    main: { temp, temp_max, temp_min },
  } = datos;
  const nombreCiudad = document.createElement('p');
  nombreCiudad.textContent = `Cima en ${name}`;
  nombreCiudad.classList.add('texto-ciudad');

  const temperatura = kelvinACentigrados(temp);
  const maxima = kelvinACentigrados(temp_max);
  const minima = kelvinACentigrados(temp_min);

  const actual = document.createElement('p');
  actual.innerHTML = `${temperatura} &#8451;`;
  actual.classList.add('texto-temperatura-actual');

  const tempMaxima = document.createElement('p');
  tempMaxima.innerHTML = `Max: ${maxima}&#8451;`;
  tempMaxima.classList.add('texto-temperaturas');

  const tempMinima = document.createElement('p');
  tempMinima.innerHTML = `Min: ${minima}&#8451;`;
  tempMinima.classList.add('texto-temperaturas');
  const resultadoDiv = document.createElement('div');
  resultadoDiv.classList.add('contenedor__datos-clima');

  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(actual);
  resultadoDiv.appendChild(tempMaxima);
  resultadoDiv.appendChild(tempMinima);
  resultado.appendChild(resultadoDiv);
  setTimeout(() => {
    formulario.reset();
  }, 1000);
}
function kelvinACentigrados(grados) {
  return parseInt(grados - 273.15);
}
function limpiarHtml() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}
function Spinner() {
  limpiarHtml();
  const divSpinner = document.createElement('div');
  divSpinner.classList.add('sk-chase');
  divSpinner.innerHTML = `
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>`;
  resultado.appendChild(divSpinner);
}
