window.onload = function()
{
	var loadTogglesvar = loadToggle;
	chrome.tabs.query({active:true,currentWindow:true},function(tabArray){
	var tabId = tabArray[0];
	tabId = tabId.id;
    chrome.runtime.sendMessage({"request_getStorage": 1, activeTab: tabId}, loadTogglesvar);
	});
	//chrome.tabs.query({active:true,currentWindow:true},function(tabArray){
	//chrome.runtime.sendMessage({command: "getStorage", activeTab: tabArray[0].id}, loadToggle);
	//});
	//chrome.runtime.sendMessage({command: "name", activeTab: "tabArray[0].id"}, loadToggle);
	document.getElementById("visible").addEventListener("click", function(e) {toggle(e); save("search", "visible")});
	document.getElementById("code").addEventListener("click", function(e) {toggle(e); save("search", "code")});

	document.getElementById("aol").addEventListener("click", function(e) {toggle(e); save("email", "aol")});
	document.getElementById("gmail").addEventListener("click", function(e) {toggle(e); save("email", "gmail")});
	document.getElementById("hotmail").addEventListener("click", function(e) {toggle(e); save("email", "hotmail")});
	document.getElementById("yahoo").addEventListener("click", function(e) {toggle(e); save("email", "yahoo")});
}
function loadToggle(e)
{
	var searchVisible = document.getElementById("visible");
	var searchCode = document.getElementById("code");
	var selectedSearch;
	if (e["search"] == "code")
		selectedSearch = searchCode;
	else
		selectedSearch = searchVisible;

	searchVisible.classList.remove("selected");
	searchCode.classList.remove("selected");
	selectedSearch.classList.add("selected");

	var emailAol = document.getElementById("aol");
	var emailHotmail = document.getElementById("hotmail");
	var emailYahoo = document.getElementById("yahoo");
	var emailGmail = document.getElementById("gmail");
	var selectedEmail;

	if (e["email"] == "aol")
		selectedEmail = emailAol;
	else if (e["email"] == "hotmail")
		selectedEmail = emailHotmail;
	else if (e["email"] == "yahoo")
		selectedEmail = emailYahoo;
	else
		selectedEmail = emailGmail;

	emailAol.classList.remove("selected");
	emailHotmail.classList.remove("selected");
	emailYahoo.classList.remove("selected");
	emailGmail.classList.remove("selected");
	selectedEmail.classList.add("selected");
}
function toggle(element)
{
	var children = element.currentTarget.parentElement.children;

	for (var i=0; i<children.length; i++)
		children[i].classList.remove("selected");
	element.currentTarget.classList.add("selected");
}
function save(field, value)
{
	chrome.runtime.sendMessage({"request_saveStorage": 1, fieldName: field, fieldValue: value});
}