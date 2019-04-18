/**
 * @app			EnDATA Scientific Calculator
 * 
 * @file		engine.js
 * 
 * @author		Nima Bavari <nima.bavari@gmail.com>
 * 				https://github.com/NimaBavari
 * 
 * @desc		This is the engine of the Scientific
 *				Calculator.
 *
 *				(c) EnDATA Ltd., 2017. All rights reserved.
 */

var currentMode = 'deg';
var screen = document.getElementById("screen");

/**
 * Auxiliary functions
 */

function isNumeric(val) {
	return !isNaN(parseFloat(val)) && isFinite(val);
}

function sine(val) {
	if(currentMode === 'deg') {
		return Math.sin(Math.PI * val / 180);
	}
	return Math.sin(val);
}

function cos(val) {
	if(currentMode === 'deg') {
		return Math.cos(Math.PI * val / 180);
	}
	return Math.cos(val);
}

function tan(val) {
	if(currentMode === 'deg') {
		return Math.tan(Math.PI * val / 180);
	}
	return Math.tan(val);
}

function ln(val) {
	return Math.log(val);
}

function getFactorial(num) {
	if(Number.isInteger(num)) {
		if(num === 0)
			return 1;
		else if(num > 0)
			return num * getFactorial(num - 1);
		else
			return 'ERROR: Illegal factorial';
	} else {
		return 'ERROR: Non-integer factorial';
	}
}

function checkElem() {
	if(isNumeric(screen.value)) {
		if(screen.value !== '0') {
			screen.value += '*';
		} else {
			screen.value = '';
		}
	}
}

/**
 * Calculator functions
 */

function addSpecial(val) {
	var lastChar = screen.value.slice(-1);
	var operations = ['+', '-', '*', '/', '^'];

	if(screen.value === '0') {
		if(!isNaN(val) || val==="(") {
			screen.value = val;
		} else if(val === '.' || operations.indexOf(val) >= 0) {
			screen.value += val;
		}
	} else if((lastChar === '.' || operations.indexOf(lastChar) >= 0) && (val !== '.' && val !== '=' && operations.indexOf(val) < 0)) {
		screen.value += val;
	} else if(val !== '=') {
		if(val === ".") {
			var numbersWithDot = screen.value.match(/[0-9\.]+/g);
			if(numbersWithDot !== null && numbersWithDot[numbersWithDot.length - 1].indexOf(".") === -1) {
				screen.value += val;
			} else if(isNaN(lastChar) && lastChar !== ".") {
				screen.value += "0."
			}
		} else {
			screen.value += val;
		}
	} else if(val === "=") {
		if(operations.indexOf(lastChar) >= 0) {
			screen.value = 'SYNTAX ERROR:';
		} else if((screen.value.indexOf('(') !== -1 || screen.value.indexOf(')') !== -1) && (screen.value.split('(').length !== screen.value.split(')').length)) {
			screen.value = 'ERROR: Open or close parantheses!';
		} else if(screen.value.indexOf('^') !== -1) {
			try {
				var parts = screen.value.split('^');
				var allParts = [];
				var xprs = [];
				var separator = ['\\\+', '-', '\\*', '/', '\\^'].join('|');
				for(var i = 0; i < parts.length; ++i) {
					var smallParts;
					if(parts[i].indexOf('(') === -1) {
						smallParts = parts[i].split(new RegExp(separator, 'g'));
					} else {
						var p = parts[i].lastIndexOf(')') + 1;
						smallParts = [];
						smallParts.push(parts[i].slice(0, p));
						var restSmallParts = parts[i].slice(p).split(new RegExp(separator, 'g'));
						for(var j = 0; j < restSmallParts.length; ++j) {
							smallParts.push(restSmallParts[j]);
						}
					}

					allParts.push(smallParts);
				}

				for(var i = 0; i < allParts.length - 1; ++i) {
					var sides = [];
					var len = allParts[i].length;
					var leftSide = allParts[i][len - 1];
					var rightSide = allParts[i + 1][0];
					sides.push(leftSide);
					sides.push(rightSide);
					xprs.push(sides);
				}

				var newStr = screen.value;
				for(var i = 0; i < xprs.length; ++i) {
					var powExp = xprs[i][0] + '^' + xprs[i][1];
					var newPowExp = 'Math.pow(' + xprs[i][0] + ', ' + xprs[i][1] + ')';
					newStr = newStr.replace(powExp, newPowExp);
				}

				if(newStr.indexOf('!') !== -1) {
					var pieces = newStr.split('!');
					pieces.pop();
					for(var i = 0; i < pieces.length; ++i) {
						var piece = pieces[i];
						if(piece.slice(-1) === ')') {
							var r = piece.slice(piece.indexOf('('));
							newStr = newStr.replace(r + '!', 'getFactorial' + r);
						} else {
							if(piece.indexOf('+') !== -1 || piece.indexOf('-') !== -1 || piece.indexOf('*') !== -1 || piece.indexOf('/') !== -1) {
								var plusPos = piece.lastIndexOf('+');
								var minusPos = piece.lastIndexOf('-');
								var timesPos = piece.lastIndexOf('*');
								var divPos = piece.lastIndexOf('/');
								var separatorPos = Math.max(plusPos, minusPos, timesPos, divPos);
								var r = piece.slice(separatorPos + 1);
							} else
								var r = piece;

							newStr = newStr.replace(r + '!', 'getFactorial(' + r + ')');
						}
					}
				}

				screen.value = eval(newStr);
			} catch(err) {
				screen.value = err.message;
			}
		} else if(screen.value.indexOf('!') !== -1) {
			try {
				var newStr = screen.value;
				var pieces = newStr.split('!');
				pieces.pop();
				for(var i = 0; i < pieces.length; ++i) {
					var piece = pieces[i];
					if(piece.slice(-1) === ')') {
						var r = piece.slice(piece.indexOf('('));
						newStr = newStr.replace(r + '!', 'getFactorial' + r);
					} else {
						if(piece.indexOf('+') !== -1 || piece.indexOf('-') !== -1 || piece.indexOf('*') !== -1 || piece.indexOf('/') !== -1) {
							var plusPos = piece.lastIndexOf('+');
							var minusPos = piece.lastIndexOf('-');
							var timesPos = piece.lastIndexOf('*');
							var divPos = piece.lastIndexOf('/');
							var separatorPos = Math.max(plusPos, minusPos, timesPos, divPos);
							var r = piece.slice(separatorPos + 1);
						} else
							var r = piece;

						newStr = newStr.replace(r + '!', 'getFactorial(' + r + ')');
					}
				}

				screen.value = eval(newStr);
			} catch(err) {
				screen.value = err.message;
			}
		} else {
			try {
				screen.value = eval(screen.value);
			} catch(err) {
				screen.value = err.message;
			}
		}

	}
}

function addFactorial() {
	try {
		screen.value += '!';
	} catch(err) {
		screen.value = err.message;
	}
}

function setAngleMode(newMode) {
	if(newMode === 'rad') {
		if(currentMode === 'deg') {
			currentMode = 'rad';
			screen.value *= Math.PI / 180;
		}
	} else {
		if(currentMode === 'rad') {
			currentMode = 'deg';
			screen.value *= 180 / Math.PI;
		}
	}
}

function addSymbol(val) {
	switch(val) {
		case 'pi':
			screen.value = Math.PI;
			break;
		case 'e':
			screen.value = Math.E;
			break;
		default:
			screen.value = 'ERROR: Undefined symbol';
	}
}

function clearScreen() {
	screen.value = '0';
}

function clearLast() {
	if(screen.value.length > 1) {
		screen.value = screen.value.slice(0, -1);
	} else {
		screen.value = '0';
	}
}

function inverseVal() {
	try {
		screen.value = 1 / parseFloat(eval(screen.value));
	} catch(err) {
		screen.value = err.message;
	}
}

function addSquare() {
	var lastChar = screen.value.slice(-1);
	if(isNumeric(lastChar) || lastChar === ')') {
		screen.value += '^2';
	}
}

function addPower() {
	var lastChar = screen.value.slice(-1);
	if(isNumeric(lastChar) || lastChar === ')') {
		screen.value += '^';
	}
}

function addSquareroot() {
	var lastChar = screen.value.slice(-1);
	if(isNumeric(lastChar) || lastChar === ')') {
		screen.value += '^(1/2)';
	}
}

function addRoot() {
	var lastChar = screen.value.slice(-1);
	if(isNumeric(lastChar) || lastChar === ')') {
		screen.value += '^(1/';
	}
}

function addExp() {
	var lastChar = screen.value.slice(-1);
	checkElem();
	if(isNumeric(lastChar) || lastChar === ')') {
		screen.value += 'Math.E^';
	}
}

function addSin() {
	var lastChar = screen.value.slice(-1);
	checkElem();

	if(isNumeric(lastChar) || lastChar === ')') {
		screen.value += 'sine(';
	}
}

function addCos() {
	var lastChar = screen.value.slice(-1);
	checkElem();

	if(isNumeric(lastChar) || lastChar === ')') {
		screen.value += 'cos(';
	}
}

function addTan() {
	var lastChar = screen.value.slice(-1);
	checkElem();

	if(isNumeric(lastChar) || lastChar === ')') {
		screen.value += 'tan(';
	}
}

function addLn() {
	var lastChar = screen.value.slice(-1);
	checkElem();

	if(isNumeric(lastChar) || lastChar === ')') {
		screen.value += 'ln(';
	}
}