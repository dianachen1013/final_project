import React from "react";
import { groupByCity } from "./utils";
import { forceSimulation, forceX, forceY, forceCollide, scaleLinear, min, max } from "d3";


function AirportBubble(props){
    const {width, height, countries, routes, selectedAirline} = props;
    // console.log(groupByCity(routes));
    if(selectedAirline){
        let selectedRoutes = routes.filter(a => a.AirlineID === selectedAirline);
        let cities;
        let raidus;
        //TODO: when the selectedAirline is not null,
        //1.Obtain an array of cities from the selectedRoutes by groupByCity
        //2.Sort the cities ascendingly by the d.Count (i.e., the number of routes from/to the city)
        // This avoids the text on the largest bubbles being covered by small bubbles.
        //3.Define a scale for the radius of bubbles. You should use scaleLinear; 
        //  the range is [2, width*0.15], and the domain is the minimum and maximum of the values of Count.  
        //4.Run the force simulation: You should use the "forceSimulation" of d3 to obtain
        //  the x and y coordinates of the circles. The velocityDecay is set to 0.2; 
        //  you need to add `forceX` (with position `width/2`, and `strength(0.02)`) 
        //  and `forceY` (with position `height/2`, and `strength(0.02)`). 
        //  Also, you need to add `forceCollide` and specify the radius of each circle. 
        //  Please set `.tick(200)`. 
        //5.Return the circles: All circles (except the top 5 hubs) 
        //  are filled by `#2a5599`; please set `stroke={"black"}` and `strokeWidth={"2"}`;
        //6.Since we have sorted the array of cities, the last 5 cities are the top 5 hubs. 
        //  You need to highlight them by filling them with `#ADD8E6` and attach the names 
        //  of the cities to the bubbles. You can use `<text>` tag to add the names. 
        //  Hint: when using .map() the callback function can have two arguments: (d, idx) => {};
        //  the idx is the index of the object d. You can use it to 
        //  Please using the following style setting in the text:
        //  style={{textAnchor:"middle", stroke:"pink", strokeWidth:"0.5em", 
        //     fill:"#992a2a", fontSize:16, fontFamily:"cursive", 
        //     paintOrder:"stroke", strokeLinejoin:"round"}}
        //Note: for each <circle />, please set the key={idx} to avoid the warnings.
        return <g>
            
        </g>
    } else {
        //TODO: when the selectedAirline is null,
        //1.Obtain an array of cities from the routes by groupByCity;
        //2.Plot the bubble chart; highlight the top 5 hub cities worldwide,
        //  using the same settings as the case when the selectedAirline is not null;
        return <g>

        </g>
    }
}

export { AirportBubble }