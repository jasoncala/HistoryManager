let $ = document.getElementById.bind(document);

//Button opens html that allows user to enter blacklisted words
document.getElementById('blacklist').onclick = function () {
    window.open('options.html');
}

//Goes through search data and deletes urls
function checkHistory(historyItems) {
    for (let item of historyItems) {
        chrome.history.deleteUrl({
            url: item.url
        });
    }
}

//Clears history based on blacklisted words
$('clearHisButt').onclick = function () {
	chrome.storage.sync.get({
			list: []
		},
		function (data) {
			for (i = 0; i < data.list.length; i++) {
				let searchString = data.list[i].toString();
				chrome.history.search({
					text: searchString,
					startTime: 0,
					maxResults: 0
				}, checkHistory)
			}
		});
}

