# Interactive Exploration of U.S. County Health and Demographic Data

## Description

This project is a data visualization application that uses D3.js and TopoJSON to create interactive charts and maps. The data used in this project is stored in [counties-10m.json](data/counties-10m.json) and [national_health_data.csv](data/national_health_data.csv).

## Key Files

- [index.html](index.html): This is the main HTML file that includes the SVG elements for the charts and the script tags for the JavaScript files.

- [style.css](css/style.css): This CSS file contains the styles for the charts and maps.

- [main.js](js/main.js): This is the main JavaScript file that initializes the charts and maps and handles the user interactions.

- [choroplethMap.js](js/choroplethMap.js): This file contains the code for creating and updating the choropleth map.

- [histogram.js](js/histogram.js): This file contains the code for creating and updating the histogram.

- [scatter.js](js/scatter.js): This file contains the code for creating and updating the scatter plot.

## Data

- [counties-10m.json](data/counties-10m.json): This JSON file contains the TopoJSON data for the counties in the United States.

- [national_health_data.csv](data/national_health_data.csv): This CSV file contains the health data for each county.

## Usage

To view the visualization, you can run this demo with VScode's live server extension or any other server. Open [index.html](index.html) in a web browser. The user can interact with the charts and maps by selecting different options from the dropdown menus. The charts and maps will update automatically based on the user's selections.

## Motivation

This project is a data visualization application designed to display demographic and health data of us counties. This data constists of multiple columns of data and this vis provides an easy way to geographically compare data as well as see distributions and relationships of the data as well.

## Visualization Components

This application includes the following visualization components:

- **Choropleth Map**: This is a map that has county data colored by the intensity of the data relative to the scale of the selected column.
- **Histogram**: Each of the two histograms explain the frequency distribution of the data.
- **Scatter Plot**: The scatter plot explains the relationship of the data between the two variables and what trends may be discovered.

The user can interact with the application by changing either of the two dropdown boxes and changing what variable to view. Each chart also has its own tooltips on demand for more information about that specific piece of data.

## Discoveries

Using this application, you can discover geographic discoveries about different demographic data. Using the on-demand features you can also see the data of the county for that variable. There are also histograms to see the distributions of the data as well as seeing the relationship of the data as well between the two variables.

You will be able to interpret the colors of the graphs as the histogram and scatter plot remain consistent, but the chloropleth map gets darker as the value of the data gets closer to the end of the range and lighter at the start of the range of the column of data.

## Process

This project was built using D3.js. The code is structured in a modular way, with separate JavaScript files for each visualization component. 

## Future Works

I got really busy with a hackathon over the weekend (We won first though by building a chrome extension!) and was not able to add more interaction such as brushing and deeper data understanding such as legends. Those would be the two things I would add.

## Challenges

I had a few challenges with adding event handlers for the dropdowns for all the graphs. There were conflicts between all the graphs and only the last event handler was listening and the other graphs were non responsive. I was able to resolve it by only having one event handler in main.js that ran all the updates for all the relevant graphs instead of each having their own. I also had an issue with my color gradients as javascript wasn't interpreting the columns as integers or something strange, but I was able to fix it.

## Demo Video

[Watch the demo video](screen-capture.webm)

This 2-3 minute demo video shows the application in action. It includes a voiceover that explains the application and its components.
