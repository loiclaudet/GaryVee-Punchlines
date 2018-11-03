chrome.webRequest.onCompleted.addListener(onWebRequestCompleted, {
    urls: ['*://*.facebook.com/*'],
});

function onWebRequestCompleted({ url }) {
    // We exclude groups, events and of course GaryVee page
    const excludedURLsPattern = /^[^:]*:(?:\/\/)?(?:[^\/]*\.)?facebook.com\/(groups|events|gary\/)/;
    if (excludedURLsPattern.test(url)) return;
    // match only xhr for news feed
    if (/pagelet/.test(url)) {
        const clientStoriesCountMatcher = decodeURIComponent(url).match(
            /client_stories_count":(\d+)/,
        );
        if (!clientStoriesCountMatcher) return;
        sendMessageOnNewsFeedXHR(clientStoriesCountMatcher[1]);
    }
}

function sendMessageOnNewsFeedXHR(messageCount) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
            xhr: 'newsfeed',
            messageCount: Number(messageCount),
        });
    });
}
