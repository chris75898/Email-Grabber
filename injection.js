//variables
hasFocus = false;
visibleArray = [];
codeArray = [];
sendOnce = false;

window.addEventListener("focus", function() {if (hasFocus) return; hasFocus = true; verifyPage(); });
window.addEventListener("blur", function() {if (!hasFocus) return; hasFocus = false; verifyPage(); });
window.addEventListener("load", function(){getEmails(2000, 3);});

getEmails(2000, 3);

function sendMessage(visibleObject, codeObject)
{
	var sendVisibleObjects = null;
	var sendCodeObjects = null;

	//check to see if arrays are equal
	if (!arraysEqual(visibleArray, visibleObject) || !sendOnce)
	{
		sendVisibleObjects = visibleObject;
		visibleArray = visibleObject;
	}
	if (!arraysEqual(codeArray, codeObject) || !sendOnce)
	{
		sendCodeObjects = codeObject;
		codeArray = codeObject;
	}
	
	if (!sendOnce)
		sendOnce = true;

	chrome.runtime.sendMessage({"request_tabUpdate":1, "visible":sendVisibleObjects,"code":sendCodeObjects});
}
function arraysEqual(array1, array2)
{
	if (array1.length != array2.length)
		return false;

	for (var i=0; i<array1.length; i++)
	{
		var matchFound = false;

		for (var j=0; j<array2.length; j++)
		{
			if (array1[i] == array2[j])
			{
				matchFound = true;
				break;
			}
		}

		if (!matchFound)
			return false;
	}

	return true;
}
function getEmails(timeInterval, remainingTimes)
{
	if (document.body)
	{
		var visible = parseText(document.body.innerText);
		var code = parseText(document.body.innerHTML);
		sendMessage(visible, code);

		if (remainingTimes && remainingTimes > 0)
		{
			remainingTimes--;
			setTimeout(function(){getEmails(timeInterval, remainingTimes);}, timeInterval);
		}
	}
	else
		setTimeout(function(){getEmails(timeInterval, remainingTimes);}, 10);
}

function verifyPage()
{
	if (!hasFocus)
		return;

	getEmails();
	setTimeout(verifyPage, 2000);
}

function parseText(inputText)
{
	//get all '@' positions
	var currentLocation = -1;
	var keyLocations = [];

	while (currentLocation < inputText.length)
	{
		var currentFind = inputText.indexOf('@', currentLocation + 1);

		if (currentFind == -1)
			break;
		
		keyLocations.push(currentFind);
		currentLocation = currentFind;
	}

	//get full possible string
	var goldenLocations = [];
	for (var i=0; i<keyLocations.length; i++)
	{
		//left side of string
		var currentPositionLeft = keyLocations[i] - 1;

		while (currentPositionLeft >= 0)
		{
			if (!isValidCharacter(inputText.charAt(currentPositionLeft)))
				break;
			currentPositionLeft--;
		}
		if (currentPositionLeft == keyLocations[i] - 1)
			continue;

		//right side of string
		var currentPositionRight = keyLocations[i] + 1;

		while (currentPositionRight <= inputText.length)
		{
			if (!isValidCharacter(inputText.charAt(currentPositionRight)))
				break;
			currentPositionRight++;
		}
		if (currentPositionRight == keyLocations[i] + 1)
			continue;

		goldenLocations.push(inputText.substr(currentPositionLeft + 1, (keyLocations[i] - currentPositionLeft) + (currentPositionRight - keyLocations[i]) - 1));
	}

	var goodAddresses = [];
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	for (var i=0; i<goldenLocations.length; i++)
	{
		if (re.test(goldenLocations[i]))
			goodAddresses.push(goldenLocations[i]);
	}

	return removeDuplicates(goodAddresses);
}
function removeDuplicates(inputArray)
{
	returnObject = {};
	for (var i=0; i<inputArray.length; i++)
		returnObject[inputArray[i]] = "";

	return Object.keys(returnObject);
}
function isValidCharacter(inputCharacter)
{
	var characters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ".", "!", "&", "+", "-", "?", "_"];
	//var separators = [',', ';', '\u0009', '\u000B', '\u000C', '\u0020', '\u000A', '\u000D', '\u000D', '\u0022', '\u0027', '<', '>'];
	//var re = /^[a-z0-9]+$/i;

	for (var i=0; i<characters.length; i++)
	if (characters[i] == inputCharacter.toLowerCase())
		return true;

	return false;
}
