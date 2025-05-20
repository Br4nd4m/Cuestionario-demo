document.getElementById("cuestionario").addEventListener("submit", function (event) {
  event.preventDefault();

  const respuestasCorrectas = {
    p1: { correcta: "c", texto: "París", justificacion: "París es la capital de Francia." },
    p2: { correcta: "b", texto: "4", justificacion: "2 + 2 es igual a 4." },
    p3: { correcta: "a", texto: "Marte", justificacion: "Marte es conocido como el planeta rojo por su color característico." },
  };

  let puntaje = 0;
  let total = Object.keys(respuestasCorrectas).length;

  for (let pregunta in respuestasCorrectas) {
    let respuesta = document.querySelector(`input[name="${pregunta}"]:checked`);
    let feedback = document.getElementById(`feedback${pregunta.substring(1)}`);

    if (respuesta) {
      if (respuesta.value === respuestasCorrectas[pregunta].correcta) {
        puntaje++;
        feedback.innerHTML = "<span class='correcto'>¡Correcto!</span>";
      } else {
        feedback.innerHTML = `<span class='incorrecto'>Incorrecto.</span> Respuesta correcta: <strong>${respuestasCorrectas[pregunta].texto}</strong>. ${respuestasCorrectas[pregunta].justificacion}`;
      }
    } else {
      feedback.innerHTML = "<span class='incorrecto'>No se seleccionó una respuesta.</span>";
    }
  }

  document.getElementById("resultado").innerText = `Obtuviste ${puntaje} de ${total} puntos.`;
});
