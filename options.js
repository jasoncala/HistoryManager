let $ = document.getElementById.bind(document);
let listDiv = document.getElementById('listDiv');
let itemCount = 0;
let updateValue;
let i;

//Deleting history data
function checkHistory(historyItems) {
	for (let item of historyItems) {
		chrome.history.deleteUrl({
			url: item.url
		});
	}
}

//Gets data from chrome storage and visualizes it
function visualizeList() {
    chrome.storage.sync.get({
        list: []
    }, function (data) {
        makeList(data.list)
    });
}

//Updates list when new word is blacklisted
function update(arr, updateVal) {
    arr.push(updateVal);
    arr.sort();
    chrome.storage.sync.set({
        list: arr
    }, function() {
        console.log("added to list with new values");
    });
    window.location.reload();
    visualizeList();
}

//Makes list using template
function makeList(listItems){
    let template = $('listTemplate');
	for (i = 0; i < listItems.length; i++) {
		let itemName = template.content.querySelector('.labelClass')
		itemName.id = "item-" + i;
		itemName.value = "'" + listItems[i] + "'";
		itemName.title = "'" + listItems[i] + "'";
		itemCount++;
		var clone = document.importNode(template.content, true);
		listDiv.appendChild(clone);
		console.log("Loaded item " + i);
	}
}

//Checking if input string (blacklist word) is empty
function emptyStr(string) {
    for (i = 0; i < string.length; i++){
        if (string[i] != ' '){
            return (false);
        }
    }
    return (true);
}

visualizeList();

//Repeated previous code so it also runs on startup
chrome.runtime.onStartup.addListener(function () {
    chrome.storage.sync.get({
            list: []
        },
        function (data) {
            for (i = 0; i < data.list.length; i++) {
                let searchStr = data.list[i].toString();
                chrome.history.search({
                    text: searchStr,
                    startTime: 0,
                    maxResults: 0
                }, checkHistory)
            }
        });
});

//When add is clicked
$('addSubmit').onclick = function () {
    let addQuery = document.getElementById('addElement').value
    chrome.storage.sync.get({
        list: []
    },
    function (data){
        if (data.list.includes(addQuery) == true) {
            alert ("ERROR: word already in list");
        }
        else if (addQuery.length >= 400) {
            alert("ERROR: please enter a smaller keyword")
        }
        else if (emptyStr(addQuery) == true) {
            //do nothing
        }
        else {
            update(data.list, addQuery);
        }
    });
}

//When clear list is clicked (clearing storage)
$('clearList').onclick = function () {
    chrome.storage.sync.clear();
    window.location.reload();
}
