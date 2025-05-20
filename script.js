const URL_JSON = "https://raw.githubusercontent.com/Br4nd4m/Cuestionario-demo/refs/heads/main/Preguntas_prueba.json";

function mostrarMateria(materia) {
  document.getElementById("materias-container").style.display = "none";
  document.getElementById("cuestionario-container").style.display = "block";
  document.getElementById("materia-titulo").innerText = materia;

  fetch(URL_JSON)
    .then(res => {
      if (!res.ok) throw new Error("Error cargando preguntas");
      return res.json();
    })
    .then(data => {
      if (!data[materia]) {
        alert("No hay preguntas para esta materia.");
        volverAlMenu();
        return;
      }
      crearFormularioPreguntas(data[materia]);
    })
    .catch(err => {
      alert("No se pudieron cargar las preguntas: " + err.message);
      volverAlMenu();
    });
}

function crearFormularioPreguntas(preguntas) {
  const form = document.getElementById("cuestionario");
  form.innerHTML = ""; // vaciar el formulario

  preguntas.forEach(({id, pregunta, opciones}) => {
    const div = document.createElement("div");
    div.classList.add("pregunta");
    div.id = id;

    const p = document.createElement("p");
    p.textContent = pregunta;
    div.appendChild(p);

    for (const [key, texto] of Object.entries(opciones)) {
      const label = document.createElement("label");
      label.innerHTML = `<input type="radio" name="${id}" value="${key}"/> ${texto}`;
      div.appendChild(label);
      div.appendChild(document.createElement("br"));
    }

    const feedback = document.createElement("div");
    feedback.classList.add("feedback");
    feedback.id = `feedback${id.substring(1)}`; // asumiendo id tipo p1, p2, ...
    div.appendChild(feedback);

    form.appendChild(div);
  });

  // Agregar botón enviar al final (si no está)
  if (!document.querySelector("#cuestionario button[type='submit']")) {
    const btn = document.createElement("button");
    btn.type = "submit";
    btn.textContent = "Enviar respuestas";
    form.appendChild(btn);
  }

  // Guardar las respuestas correctas para evaluación (global)
  window.respuestasCorrectas = {};
  preguntas.forEach(({id, correcta, justificacion, opciones}) => {
    window.respuestasCorrectas[id] = {correcta, justificacion, texto: opciones[correcta]};
  });

  document.getElementById("resultado").innerText = "";
}

function resetCuestionario() {
  const form = document.getElementById("cuestionario");
  form.reset();
  document.getElementById("resultado").innerText = "";
  const feedbacks = document.querySelectorAll(".feedback");
  feedbacks.forEach(fb => (fb.innerHTML = ""));
}

function volverAlMenu() {
  document.getElementById("materias-container").style.display = "block";
  document.getElementById("cuestionario-container").style.display = "none";
  resetCuestionario();
}

document.getElementById("cuestionario").addEventListener("submit", function(event) {
  event.preventDefault();
  if (!window.respuestasCorrectas) return;

  let puntaje = 0;
  const total = Object.keys(window.respuestasCorrectas).length;

  for (const pregunta in window.respuestasCorrectas) {
    const respuesta = document.querySelector(`input[name="${pregunta}"]:checked`);
    const feedback = document.getElementById(`feedback${pregunta.substring(1)}`);

    if (respuesta) {
      if (respuesta.value === window.respuestasCorrectas[pregunta].correcta) {
        puntaje++;
        feedback.innerHTML = "<span class='correcto'>¡Correcto!</span>";
      } else {
        feedback.innerHTML = `<span class='incorrecto'>Incorrecto.</span> Respuesta correcta: <strong>${window.respuestasCorrectas[pregunta].texto}</strong>. ${window.respuestasCorrectas[pregunta].justificacion}`;
      }
    } else {
      feedback.innerHTML = "<span class='incorrecto'>No se seleccionó una respuesta.</span>";
    }
  }

  document.getElementById("resultado").innerText = `Obtuviste ${puntaje} de ${total} puntos.`;
});
