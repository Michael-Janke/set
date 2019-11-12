"use strict";
exports.__esModule = true;
var Shape;
(function (Shape) {
    Shape[Shape["Square"] = 0] = "Square";
    Shape[Shape["Round"] = 1] = "Round";
    Shape[Shape["Wave"] = 2] = "Wave";
})(Shape || (Shape = {}));
var Fill;
(function (Fill) {
    Fill[Fill["None"] = 0] = "None";
    Fill[Fill["Dotted"] = 1] = "Dotted";
    Fill[Fill["Filled"] = 2] = "Filled";
})(Fill || (Fill = {}));
var Number;
(function (Number) {
    Number[Number["One"] = 0] = "One";
    Number[Number["Two"] = 1] = "Two";
    Number[Number["Three"] = 2] = "Three";
})(Number || (Number = {}));
var Color;
(function (Color) {
    Color[Color["Green"] = 0] = "Green";
    Color[Color["Red"] = 1] = "Red";
    Color[Color["Purple"] = 2] = "Purple";
})(Color || (Color = {}));
var Card = /** @class */ (function () {
    function Card(_a) {
        var shape = _a.shape, fill = _a.fill, number = _a.number, color = _a.color;
        this.shape = shape;
        this.fill = fill;
        this.number = number;
        this.color = color;
    }
    return Card;
}());
exports["default"] = Card;
exports.isSet = function (card1, card2, card3) {
    var setNumbers = [false, true, true, false, true, false, false, true]; //1,2,4,7
    var shape = (1 << card1.shape) | (1 << card2.shape) | (1 << card3.shape);
    var fill = (1 << card1.fill) | (1 << card2.fill) | (1 << card3.fill);
    var number = (1 << card1.number) | (1 << card2.number) | (1 << card3.number);
    var color = (1 << card1.color) | (1 << card2.color) | (1 << card3.color);
    return (setNumbers[shape] &&
        setNumbers[fill] &&
        setNumbers[number] &&
        setNumbers[color]);
};
