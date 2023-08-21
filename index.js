// Load the JSON data
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then(data => {
    const dataset = data.data;

    // Set up chart dimensions
    const width = 800;
    const height = 400;
    const padding = 60;

    // Create SVG element
    const svg = d3.select("#chart")
        .attr("width", width)
        .attr("height", height);

    // Create scales
    const xScale = d3.scaleTime()
        .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
        .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d[1])])
        .range([height - padding, padding]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(xAxis);

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis);

    // Create bars
    svg.selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .attr("x", (d, i) => xScale(new Date(d[0])))
        .attr("y", d => yScale(d[1]))
        .attr("width", width / dataset.length)
        .attr("height", d => height - padding - yScale(d[1]))
        .on("mouseover", (event, d) => {
            // Show tooltip
            const tooltip = d3.select("#tooltip");
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(`${d[0]}<br>${d[1]}`)
                .attr("data-date", d[0])
                .style("left", event.pageX + "px")
                .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", () => {
            // Hide tooltip
            d3.select("#tooltip").transition().duration(500).style("opacity", 0);
        });
});
