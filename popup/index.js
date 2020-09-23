window.onload = function()
{
	sendMessage("request_getAddressCount", putSummary);
	sendMessage("");
	document.getElementById("sendGmail").addEventListener("click", function() {sendMessage("request_sendGmail", null);});
	document.getElementById("copyClipboard").addEventListener("click", function() {sendMessage("request_copyClipboard", null);});
	document.getElementById("preparePrint").addEventListener("click", function() {sendMessage("request_preparePrint", null);});
}
function sendMessage(requestName, destination)
{
	chrome.tabs.query({active:true,currentWindow:true},function(tabArray){
	var sendObject = {};
	sendObject[requestName] = 1;
	sendObject["activeTab"] = tabArray[0].id;
    chrome.runtime.sendMessage(sendObject, destination);
	});
}
function putSummary(e)
{
	document.getElementById("summaryCount").innerText = e.reply;
	if (e.reply > 0)
		document.getElementById("statusView_showMore").style.display = "inline-block";
	else
		document.getElementById("statusView_showMore").style.display = "none";
	document.getElementById("email").innerText = e.email.charAt(0).toUpperCase() + e.email.slice(1);
}