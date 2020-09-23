//create contect menu
var emailMenuItemParent = chrome.contextMenus.create({"title": "Email Grabber", "onclick": emailSelection, "contexts": ["selection"]});
emailContextMenu = chrome.contextMenus.create({"parentId": emailMenuItemParent, "title": "Send to Email", "onclick": function(selection) {emailSelection(parseText(selection['selectionText']));}, "contexts": ["selection"]});
chrome.contextMenus.create({"parentId": emailMenuItemParent, "title": "Copy to Clipboard", "onclick": function(selection) {copyToClipboard(parseText(selection['selectionText']));}, "contexts": ["selection"]});
chrome.contextMenus.create({"parentId": emailMenuItemParent, "title": "Prepare to Print", "onclick": function(selection) {printSelection(parseText(selection['selectionText']));}, "contexts": ["selection"]});

//variables
tabItems = {};
tabItems_Code = {};
tabItems_Visible = {};

//listeners
chrome.runtime.onMessage.addListener(processInbox);

var email = "gmail";
var search = "visible";
chrome.storage.local.get(["email", "search"], function(result) {
	if ("email" in result)
		updateEmail(result['email']);
	if ("search" in result)
		search = result['search'];
});
//create listener
function processInbox(request, sender, sendResponse)
{
	if ("tab" in sender && "id" in sender.tab && (!(sender.tab.id in tabItems_Visible)))
		tabItems_Visible[sender.tab.id] = [];
	if ("tab" in sender && "id" in sender.tab && (!(sender.tab.id in tabItems_Code)))
		tabItems_Code[sender.tab.id] = [];
	if ("activeTab" in request && (!(request.activeTab in tabItems_Visible)))
		tabItems_Visible[request.activeTab] = [];
	if ("activeTab" in request && (!(request.activeTab in tabItems_Code)))
		tabItems_Code[request.activeTab] = [];

	//update from tab
	if ("request_tabUpdate" in request)
	{
		if (request["visible"])
			tabItems_Visible[sender.tab.id] = request["visible"];
		if (request["code"])
			tabItems_Code[sender.tab.id] = request["code"];

		if (search == "visible")
			chrome.browserAction.setBadgeText({"text": tabItems_Visible[sender.tab.id].length.toString(), "tabId": sender.tab.id});
		else
			chrome.browserAction.setBadgeText({"text": tabItems_Code[sender.tab.id].length.toString(), "tabId": sender.tab.id});
	}
	else if ("request_sendGmail" in request)
		emailSelection(pullEmails(request.activeTab));
	else if ("request_copyClipboard" in request)
		copyToClipboard(pullEmails(request.activeTab));
	else if ("request_preparePrint" in request)
		printSelection(pullEmails(request.activeTab));

	else if ("request_getAddressCount" in request)
		sendResponse({reply:pullEmails(request.activeTab).length, "email":email});
	else if ("request_getAddresses" in request)
		sendResponse({reply:pullEmails(request.activeTab)});

	else if ("request_getStorage" in request)
		sendResponse({email:email, search:search});
	else if ("request_saveStorage" in request)
	{
		if (request["fieldName"] == "email")
		{
			chrome.storage.local.set({email: request["fieldValue"]});
			updateEmail(request["fieldValue"]);
		}
		else if (request["fieldName"] == "search")
		{
			chrome.storage.local.set({search: request["fieldValue"]});
			search = request["fieldValue"];
		}
	}
}
function updateEmail(newEmail)
{
	if (newEmail == "aol")
		email = "aol";
	else if (newEmail == "yahoo")
		email = "yahoo";
	else if (newEmail == "hotmail")
		email = "hotmail";
	else if (newEmail == "gmail")
		email = "gmail";
}
function pullEmails(tabId)
{
	return (search == "visible") ? tabItems_Visible[tabId] : tabItems_Code[tabId];
}

function printSelection(arrayOfEmails)
{
	chrome.tabs.create({"url":chrome.extension.getURL("print.html?to=" + arrayOfEmails.join(";"))});
}
function emailSelection(arrayOfEmails)
{
	encodedEmails = [];
	for (var i=0; i<arrayOfEmails.length; i++)
		encodedEmails.push(encodeURIComponent(arrayOfEmails[i]));
	
	if (email == "yahoo")
		window.open("https://compose.mail.yahoo.com/?to=" + encodedEmails.join(","));
	else if (email == "hotmail")
		window.open("http://mail.live.com/mail/EditMessageLight.aspx?n=&to=" + encodedEmails.join(";"));
	else if (email == "aol")
		window.open("http://webmail.aol.com/Mail/ComposeMessage.aspx?to=" + encodedEmails.join(","));
	else
		window.open("https://mail.google.com/mail?view=cm&tf=0&to=" + encodedEmails.join(";"));
}

function copyToClipboard(arrayOfEmails){
				var text="";
				for (var i=0; i<arrayOfEmails.length; i++)
				{
					text += arrayOfEmails[i] + "<br />";
				}
                var copyDiv = document.createElement('div');
                copyDiv.contentEditable = true;
                document.body.appendChild(copyDiv);
                copyDiv.innerHTML = text;
                copyDiv.unselectable = "off";
                copyDiv.focus();
                document.execCommand('SelectAll');
                document.execCommand("Copy", false, null);
                document.body.removeChild(copyDiv);
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