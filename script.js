// --- Lógica para los 4 botones de dispositivos ---
document.querySelectorAll('.device-btn').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
    });
});

// --- Lógica para el manómetro de temperatura ---
const width = 300,
      height = 200,
      radius = Math.min(width, height) / 2;

const svg = d3.select("#gauge")
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height})`);

const arc = d3.arc()
    .innerRadius(radius * 0.7)
    .outerRadius(radius)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2);

const background = svg.append("path")
    .datum({endAngle: Math.PI / 2})
    .attr("d", arc)
    .style("fill", "#e0e0e0");

const foreground = svg.append("path")
    .datum({endAngle: -Math.PI / 2})
    .attr("d", arc)
    .style("fill", "steelblue");

let temperature = 25;
const tempValueLabel = document.getElementById("temp-value");
const minTemp = 0, maxTemp = 100;

function updateGauge(temp) {
    const angle = (temp - minTemp) / (maxTemp - minTemp) * Math.PI - Math.PI / 2;
    foreground.transition().duration(500).attrTween("d", arcTween(angle));
    tempValueLabel.textContent = temp;

    let gaugeColor;
    if (temp <= 10) {
        gaugeColor = "blue";
    } else if (temp >= 11 && temp <= 29) {
        gaugeColor = "green";
    } else {
        gaugeColor = "red";
    }
    foreground.style("fill", gaugeColor);
}

function arcTween(newAngle) {
    return function(d) {
        const i = d3.interpolate(d.endAngle, newAngle);
        return function(t) {
            d.endAngle = i(t);
            return arc(d);
        };
    };
}

// --- Eventos de los botones de temperatura ---
document.getElementById("btn-temp-up").addEventListener("click", () => {
    if (temperature < 100) {
        temperature += 1;
        updateGauge(temperature);
    }
});

document.getElementById("btn-temp-down").addEventListener("click", () => {
    if (temperature > 0) {
        temperature -= 1;
        updateGauge(temperature);
    }
});

// Inicializar el manómetro al cargar la página
updateGauge(temperature);