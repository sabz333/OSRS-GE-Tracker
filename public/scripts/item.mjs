// Initialize variables
const timeScaleSelection = document.getElementById("scaleSelectors");
const percentChangeDOM = document.getElementById("mainPercentChange");
const priceChangeDOM = document.getElementById("mainPriceChange");
var mainChart;

// on first load functions
loadChart("1D", "5m", itemId);

// event listener for chart time range updating
timeScaleSelection.addEventListener("click", (event) => {
  const previousActive = document.querySelector(".selected");
  const selectedId = event.target.firstElementChild.id;
  const selectedTimeScale = event.target.firstElementChild.innerText;
  previousActive.classList.remove("selected");
  event.target.firstElementChild.classList.add("selected");

  if (previousActive.innerText !== selectedTimeScale) {
    loadChart(selectedTimeScale, selectedId, itemId);
  }
});

// function for generating chart on canvas element
async function loadChart(chartTimescale, dataTimescale, id) {
  const data = await loadData(dataTimescale, id, chartTimescale);

  // updating price change & percent change
  const priceChangeNumeric = data.price.at(-1) - data.price[0];
  const percentChange = (priceChangeNumeric / data.price[0]) * 100;
  var timeScaleText;

  if (priceChangeNumeric < 0) {
    if(!percentChangeDOM.classList.contains("negative")) {
      percentChangeDOM.classList.add("negative");
    }
    if(percentChangeDOM.classList.contains("positive")) {
      percentChangeDOM.classList.remove("positive");
    }
    if (!priceChangeDOM.classList.contains("negative")) {
      priceChangeDOM.classList.add("negative");
    }
    if (priceChangeDOM.classList.contains("positive")) {
      priceChangeDOM.classList.remove("positive");
    }

    // change arrow
    percentChangeDOM.children[0].children[0].innerHTML = "arrow_downward";

  } else if (priceChangeNumeric > 0) {
    if(!percentChangeDOM.classList.contains("positive")) {
      percentChangeDOM.classList.add("positive");
    }
    if(percentChangeDOM.classList.contains("negative")) {
      percentChangeDOM.classList.remove("negative");
    }
    if (!priceChangeDOM.classList.contains("positive")) {
      priceChangeDOM.classList.add("positive");
    }
    if (priceChangeDOM.classList.contains("negative")) {
      priceChangeDOM.classList.remove("negative");
    }

    // change arrow
    percentChangeDOM.children[0].children[0].innerHTML = "arrow_upward";
  } else {
    if(percentChangeDOM.classList.contains("negative")) {
      percentChangeDOM.classList.remove("negative");
    }
    if (priceChangeDOM.classList.contains("positive")) {
      priceChangeDOM.classList.remove("positive");
    }

    // change arrow
    percentChangeDOM.children[0].children[0].innerHTML = "trending_flat";
  }
  // change percent
  percentChangeDOM.children[0].children[1].innerHTML = percentChange.toFixed(2) + " %";
  
  // change price
  if (chartTimescale === "1D") {
    timeScaleText = "Today";
  } else {
    timeScaleText = chartTimescale;
  }
  priceChangeDOM.innerHTML = data.priceChange + " " + timeScaleText;

  // begin chart customizations
  const labelTimeStep = Math.floor(data.price.length/5);
  let labelCount = 0;
  var gradient = document.getElementById("mainPlot").getContext('2d').createLinearGradient(0,0,0,356);
  var gradientColorStart;
  var gradientColorEnd;
  var borderColor;

  // set color gradient based on incoming price data
  if(data.price[0] < data.price.at(-1)) {
    gradientColorStart = "rgba(52, 168, 83, 0.7)";
    gradientColorEnd = "rgba(52, 168, 83, 0)";
    borderColor = "rgb(52, 168, 83)";
  } else {
    gradientColorStart = "rgba(245, 174, 172, 1)";
    gradientColorEnd = "rgba(245, 174, 172, 0)";
    borderColor = "rgb(197, 65, 63)";

  }

  gradient.addColorStop(0, gradientColorStart);
  gradient.addColorStop(1, gradientColorEnd);

  // custom tooltip positioner to keep tooltip above or below data
  Chart.Tooltip.positioners.top = function(elements, position) {

    if(!elements.length) {
      return false;
    }
    var yPosition;
    var yAlignment;
    const chart = this.chart;

    if(elements[0].element.y < (chart.chartArea.top + 60)) {
      yPosition = chart.chartArea.bottom - 70;
      yAlignment = "top";
    } else {
      yPosition = chart.chartArea.top;
      yAlignment = "bottom";
    }

    return {
      x: position.x,
      y: yPosition,
      yAlign: yAlignment
    };
  };

  // destroy chart when updating based on timeline selection
  if (mainChart != undefined) {
    mainChart.destroy();
  }

  // actual chart generation and settings
  mainChart = new Chart(document.getElementById("mainPlot"), {
    type: "line",
    data: {
      labels: data.toolTip,
      datasets: [
        {
          label: "Price",
          data: data.price,
          tension: 0.3,
          borderColor: borderColor,
          backgroundColor: gradient,
          fill: true,
          borderWidth: 2,
        },
        {
          label: "Volume",
          data: data.volume,
          showLine: false,
          pointStyle: false,
          yAxisID: 'y2',
        },
      ],
    },
    options: {
      elements: {
        point: {
          radius: 0,
          hitRadius: 3,
        },
      },
      scales: {
        x: {
          border: {
            color: 'rgb(129,129,129)',
          },
          grid: {
            display: true,
            drawOnChartArea: false,
            tickWidth: 3,
            color: 'rgb(129,129,129)',
          },
          ticks: {
            callback: function (val, index) {
              if (index % labelTimeStep === 0 && index !== 0 && labelCount < 4) {
                labelCount++;
                return data.time[index];
              }
            },
            autoSkip: false,
          },
        },
        y: {
          border: {
            display: false,
          },
          ticks: {
            callback: function (val) {
              if (Number.isInteger(val)) {
                return val;
              }
            }
          },
          offset: true,
        },
        y2: {
          display: false,
        }
      },
      interaction: {
        intersect: false,
        mode: "nearest",
        axis: "x",
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          displayColors: false,
          yAlign: "bottom",
          position: "top",
        }
      },
    },
  });
}

// function to pull chart data from server
async function loadData(time, id, timeScale) {
  try {
    const response = await axios.request({
      url: "/graph",
      params: {
        id: id,
        timestep: time,
        timeScale: timeScale,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}
