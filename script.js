let p_sch = {
    1855: 2810,
    1871: 16473,
    1881: 84734,
    1891: 99630,
    1901: 97116,
    1911: 118413,
    1921: 158792,
    1931: 204384,
    1957: 278056
};

let s_sch = {
    1855: 281,
    1871: 3070,
    1881: 3906,
    1891: 5134,
    1901: 5416,
    1911: 6442,
    1921: 8816,
    1931: 13581,
    1957: 54170
};

let u = {
    1855: 3,
    1871: 3,
    1881: 3,
    1891: 4,
    1901: 4,
    1911: 4,
    1921: 13,
    1931: 16,
    1941: 16,
    1957: 18
};

let ts = {
    1931: 262068,
    1921: 206016,
    1911: 179322,
    1901: 148966,
    1891: 149794,
    1881: 112632,
    1871: 83052,
    1855: 50998
};
let girl = {
    1855: 0,
    1871: 0,
    1881: 0.35,
    1891: 0.42,
    1901: 0.6,
    1911: 1,
    1921: 1.8,
    1931: 2.9,
    1941: 7.3,
    1957: 8.89
};

let t_pop = {
    1855: 0.054,
    1871: 3.25,
    1881: 4.32,
    1891: 4.62,
    1901: 5.4,
    1911: 5.9,
    1921: 7.2,
    1931: 9.5,
    1941: 16.1,
    1957: 23
};

const placeholders = document.querySelectorAll('.placeholder');
const p_sch_t = document.getElementById('val1');
const s_sch_t = document.getElementById('val2');
const u_t = document.getElementById('val3');
const ts_t = document.getElementById('val5');
const ng_t = document.getElementById('val6');
const h1 = document.getElementById('h1');
const t_pop_t = document.getElementById('val7');
const scrollBar = document.getElementById('scrollBar');
const valueBox = document.getElementById('valueBox');

const circularProgressGirls = document.getElementById('circularProgressGirls');
const circularProgressScholars = document.getElementById('circularProgressScholars');
scrollBar.addEventListener('input', () => {

    const selectedYear = parseInt(scrollBar.value); // Get the selected year

    valueBox.textContent = scrollBar.value;
    if (selectedYear < 1947) {
        valueBox.style.backgroundColor = "red";
        h1.innerText = 'Indian Education: Colonial Era'
        document.documentElement.style.setProperty('--scrollbar-thumb-color', 'red'); // Set the handle color to red
    } else {
        valueBox.style.backgroundColor = "green";
        h1.innerText = 'Indian Education: Post-Colonial Era'
        document.documentElement.style.setProperty('--scrollbar-thumb-color', 'green'); // Set the handle color to green
    }

    p_sch_t.innerText = parseInt(Calculate(selectedYear,p_sch));
    s_sch_t.innerText = parseInt(Calculate(selectedYear,s_sch));
    u_t.innerText = parseInt(Calculate(selectedYear,u));
    ts_t.innerText = parseInt(Calculate(selectedYear,ts));
    placeholders.forEach((placeholder) => {
        placeholder.style.color = selectedYear < 1947 ? "#d9534f" : "#4caf50";
    });
    let girlPercentage = Calculate(selectedYear, girl);
    ng_t.innerText = `${girlPercentage}%`;
    circularProgressGirls.style.background = `conic-gradient(${selectedYear < 1947 ? "red" : "green"} ${girlPercentage * 3.6}deg, #ddd ${girlPercentage * 3.6}deg)`;

    let literacyPercentage = Calculate(selectedYear, t_pop);
    t_pop_t.innerText = `${literacyPercentage}%`;
    circularProgressScholars.style.background = `conic-gradient(${selectedYear < 1947 ? "red" : "green"} ${literacyPercentage * 3.6}deg, #ddd ${literacyPercentage * 3.6}deg)`;
});

function Calculate(year,p_sch) {
    const years = Object.keys(p_sch).map(Number).sort((a, b) => a - b);
    let min = null;
    let max = null;
    for (let i = 0; i < years.length; i++) {
        if (years[i] < year) {
            min = years[i];
        } else {
            max = years[i];
            break;
        }
    }

    // Ensure both bounds are found
    if (min === null) {
        min=years[0];
        max=years[1];
    }
    else if(max===null){
        min=years[years.length-2];
        max=years[years.length-1];
    }
    // Perform linear interpolation
    const slope = (p_sch[max] - p_sch[min]) / (max - min);
    const y = slope * (year - min) + p_sch[min];
    return y.toFixed(2);
}

// Get the canvas element
const ctx = document.getElementById('literacyRateChart').getContext('2d');

// Initialize the chart
const literacyRateChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // X-axis labels (years)
        datasets: [{
            label: 'Literacy Rate (%)',
            data: [], // Y-axis data (literacy rates)
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderColor: '#4caf50',
            borderWidth: 2,
            fill: true,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Year'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Literacy Rate (%)'
                },
                beginAtZero: true
            }
        }
    }
});

// Function to update the chart
function updateChart(selectedYear) {
    const years = Object.keys(t_pop).map(Number).sort((a, b) => a - b);
    const rates = years
        .filter(year => year <= selectedYear) // Only include years <= selected year
        .map(year => t_pop[year]); // Map to literacy rates

    // Determine graph color based on the year
    const isBefore1947 = selectedYear < 1947;
    const chartColor = isBefore1947 ? 'rgba(217, 83, 79, 0.2)' : 'rgba(76, 175, 80, 0.2)';
    const borderColor = isBefore1947 ? '#d9534f' : '#4caf50';

    // Update chart data
    literacyRateChart.data.labels = years.filter(year => year <= selectedYear); // Update X-axis labels
    literacyRateChart.data.datasets[0].data = rates; // Update Y-axis data
    literacyRateChart.data.datasets[0].backgroundColor = chartColor; // Update background color
    literacyRateChart.data.datasets[0].borderColor = borderColor; // Update border color

    literacyRateChart.update(); // Refresh the chart
}


// Attach the chart update to the scroll bar event
scrollBar.addEventListener('input', () => {
    const selectedYear = parseInt(scrollBar.value);
    updateChart(selectedYear);
});

// Initialize chart with the starting year
updateChart(parseInt(scrollBar.value));







let pageloaded;
if(!pageloaded){
    pageloaded = true;

    const selectedYear = parseInt(scrollBar.value); // Get the selected year

    valueBox.textContent = scrollBar.value;
    if (selectedYear < 1947) {
        valueBox.style.backgroundColor = "red";
        h1.innerText = 'Indian Education: Colonial Era'
        document.documentElement.style.setProperty('--scrollbar-thumb-color', 'red'); // Set the handle color to red
    } else {
        valueBox.style.backgroundColor = "green";
        h1.innerText = 'Indian Education: Post-Colonial Era'
        document.documentElement.style.setProperty('--scrollbar-thumb-color', 'green'); // Set the handle color to green
    }

    p_sch_t.innerText = parseInt(Calculate(selectedYear,p_sch));
    s_sch_t.innerText = parseInt(Calculate(selectedYear,s_sch));
    u_t.innerText = parseInt(Calculate(selectedYear,u));
    ts_t.innerText = parseInt(Calculate(selectedYear,ts));
    let percentage = Calculate(selectedYear,girl);
    ng_t.innerText = `${percentage}%`;

    placeholders.forEach((placeholder) => {
        placeholder.style.color = selectedYear < 1947 ? "#d9534f" : "#4caf50";
    });
    let girlPercentage = Calculate(selectedYear, girl);
    ng_t.innerText = `${girlPercentage}%`;
    circularProgressGirls.style.background = `conic-gradient(${selectedYear < 1947 ? "red" : "green"} ${girlPercentage * 3.6}deg, #ddd ${girlPercentage * 3.6}deg)`;

    let literacyPercentage = Calculate(selectedYear, t_pop);
    t_pop_t.innerText = `${literacyPercentage}%`;
    circularProgressScholars.style.background = `conic-gradient(${selectedYear < 1947 ? "red" : "green"} ${literacyPercentage * 3.6}deg, #ddd ${literacyPercentage * 3.6}deg)`;

    t_pop_t.innerText = `${percentage}%`;
}