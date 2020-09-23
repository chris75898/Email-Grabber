window.addEventListener("load", firstLoad);

function firstLoad()
{
	//set event listeners
	//columnselector
	var columsSelector = document.getElementById("columsSelector");
	columsSelector.addEventListener("change", function(e){
		loadEmailsInTable(this.options[this.selectedIndex].text);
	});
	//table alignment
	alignTableLeft = document.getElementById("alignTableLeft");
	alignTableCenter = document.getElementById("alignTableCenter");
	alignTableRight = document.getElementById("alignTableRight");
	
	alignTableLeft.addEventListener("click", alignTable);
	alignTableCenter.addEventListener("click", alignTable);
	alignTableRight.addEventListener("click", alignTable);

	//text alignment
	alignTextLeft = document.getElementById("alignTextLeft");
	alignTextCenter = document.getElementById("alignTextCenter");
	alignTextRight = document.getElementById("alignTextRight");

	alignTextLeft.addEventListener("click", alignText);
	alignTextCenter.addEventListener("click", alignText);
	alignTextRight.addEventListener("click", alignText);

	//columnSpacing
	var columnSpacingSelector = document.getElementById("columnSpacingSelector");
	columnSpacingSelector.addEventListener("change", function(e){
		var currentTable = document.getElementById("emailTable");
		var currentValue = this.options[this.selectedIndex].text;
		currentTable.style.borderSpacing = (parseInt(currentValue) * 20).toString() + "px 0px";
	});

	//print button
	var printButton = document.getElementById("printButton");
	printButton.addEventListener("click", function() {window.print();});
	loadEmailsInTable(1);
}
function test(e)
{

}
function alignText(e)
{
	alignTextLeft.className = alignTextLeft.className.replace(" selected", "");
	alignTextCenter.className = alignTextCenter.className.replace(" selected", "");
	alignTextRight.className = alignTextRight.className.replace(" selected", "");

	e.currentTarget.className += " selected";

	var currentTable = document.getElementById("emailTable");

	if (e.currentTarget.innerHTML == "Left")
		currentTable.style.textAlign = "left";
	else if (e.currentTarget.innerHTML == "Center")
		currentTable.style.textAlign = "center";
	else if (e.currentTarget.innerHTML == "Right")
		currentTable.style.textAlign = "right";

}
function alignTable(e)
{
	alignTableLeft.className = alignTableLeft.className.replace(" selected", "");
	alignTableCenter.className = alignTableCenter.className.replace(" selected", "");
	alignTableRight.className = alignTableRight.className.replace(" selected", "");
	
	e.currentTarget.className += " selected";

	var currentTable = document.getElementById("emailTable");

	if (e.currentTarget.innerHTML == "Left")
	{
		currentTable.style.float = "left";
		currentTable.style.margin = "0px";
	}
	else if (e.currentTarget.innerHTML == "Center")
	{
		currentTable.style.margin = "0 auto";
		currentTable.style.float = "none";
	}
	else if (e.currentTarget.innerHTML == "Right")
	{
		currentTable.style.float = "right";
		currentTable.style.margin = "0px";
	}
}
function loadEmailsInTable(numberOfColumns)
{

				if (isNaN(numberOfColumns))
					numberOfColumns = 1;
				else if (parseInt(numberOfColumns) <= 0 || parseInt(numberOfColumns) > 10)
					numberOfColumns = 1;
				numberOfColumns = parseInt(numberOfColumns);

				var parameters = getParameterByName("to");
				var parsedParameters = parameters.split(";");
				var table = document.getElementById("emailTable");
				table.innerHTML = "";

				var currentRow = document.createElement("tr");

				for (var i=0; i<parsedParameters.length; i++)
				{
					if (currentRow.children.length >= numberOfColumns)
					{
						table.appendChild(currentRow);
						currentRow = document.createElement("tr");
					}

					var currentCell = document.createElement("td");
					currentCell.innerHTML = parsedParameters[i];
					currentRow.appendChild(currentCell);
				}
				if (currentRow.children.length > 0)
					table.appendChild(currentRow);

				
}
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
