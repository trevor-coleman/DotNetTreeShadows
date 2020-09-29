import React from "react";
var ColorCode;
(function (ColorCode) {
    ColorCode["RedSun"] = "#EA1600";
    ColorCode["RedShade"] = "#9F0F00";
    ColorCode["OrangeSun"] = "#FF6C27";
    ColorCode["OrangeShade"] = "#943B11";
    ColorCode["YellowSun"] = "#FFC61B";
    ColorCode["YellowShade"] = "#7F6105";
    ColorCode["BlueSun"] = "#06AED5";
    ColorCode["BlueShade"] = "#006997";
})(ColorCode || (ColorCode = {}));
const colorDict = {
    red__sun: ColorCode.RedSun,
    red__shade: ColorCode.RedShade,
    orange__sun: ColorCode.OrangeSun,
    orange__shade: ColorCode.OrangeShade,
    yellow__sun: ColorCode.YellowSun,
    yellow__shade: ColorCode.YellowShade,
    blue__sun: ColorCode.BlueSun,
    blue__shade: ColorCode.BlueShade,
};
const SVGSeed = (props) => {
    let pieceColor = colorDict[props.playerColor + "__" + (props.shaded ? "shade" : "sun")];
    return (React.createElement("g", { id: "Page-1", stroke: "none", "stroke-width": "1", fill: "none", "fill-rule": "evenodd" },
        React.createElement("g", { id: "seed", transform: "translate(1.000000, 1.000000)", stroke: "#979797" },
            React.createElement("g", { id: "Tile" },
                React.createElement("g", { id: "Background-Sun", fill: "#1A7D28" },
                    React.createElement("rect", { id: "Background", x: "0", y: "0", width: "200", height: "200" })),
                React.createElement("g", { id: "tree/seed", fill: "#EA1600", transform: "translate(35.000000, 0.500000)" },
                    React.createElement("g", { id: "z_elements/seed", fill: "none", transform: "translate(157.500000, 192.500000)" },
                        React.createElement("circle", { id: "Oval", fill: "#EA1600", cx: "5", cy: "5", r: "2" })))))));
};
export default SVGSeed;
