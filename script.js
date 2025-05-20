document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("quiz-container");

  fetch("./Preguntas_prueba.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudo cargar el archivo JSON.");
      }
      return response.json();
    })
    .then(data => {
      const preguntas = data["OPS II"];
      contenedor.innerHTML = ""; // Limpiar "Cargando..."

      preguntas.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "question";
        div.innerHTML = `<p><strong>${index + 1}.</strong> ${item.pregunta}</p>`;

        const opcionesDiv = document.createElement("div");
        opcionesDiv.className = "options";

        for (const [key, texto] of Object.entries(item.opciones)) {
          const btn = document.createElement("button");
          btn.textContent = `${key}) ${texto}`;
          btn.addEventListener("click", () => {
            if (key === item.correcta) {
              btn.classList.add("correct");
              alert("✔️ Correcto. " + item.justificacion);
            } else {
              btn.classList.add("incorrect");
              alert("❌ Incorrecto. " + item.justificacion);
            }
          });
          opcionesDiv.appendChild(btn);
        }

        div.appendChild(opcionesDiv);
        contenedor.appendChild(div);
      });
    })
    .catch(error => {
      contenedor.innerHTML = `<p style="color:red;">Error al cargar las preguntas: ${error.message}</p>`;
    });
});
