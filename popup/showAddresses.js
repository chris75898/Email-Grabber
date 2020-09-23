window.onload = function()
{
	chrome.tabs.query({active:true,currentWindow:true},function(tabArray){
	chrome.runtime.sendMessage({"request_getAddresses":1, activeTab: tabArray[0].id}, loadAddresses);
	});
}
function loadAddresses(e)
{
	var p = document.getElementById("emailList");
	p.innerHTML = "";

	for (var i=0; i<e.reply.length; i++)
	{
		var currentItem = document.createElement("li");
		currentItem.innerText = e.reply[i];
		p.appendChild(currentItem);
	}
}
