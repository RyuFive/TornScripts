// ==UserScript==
// @name         Chat Img
// @author RyuFive
// @match      https://www.torn.com/*
// @namespace    https://github.com/RyuFive/Chat-Img/raw/main/Chat_Img.user.js
// @version      0.2
// @description  try to take over the world!
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license MIT
// ==/UserScript==

var MutationObserver = window.MutationObserver;
var myObserver = new MutationObserver(mutationHandler);
var obsConfig = {
  childList: true,
  attributes: true,
  subtree: true,
  attributeFilter: ['class, style']
};

myObserver.observe(document.querySelector('#chatRoot'), obsConfig);

function mutationHandler(mutationRecords) {

  mutationRecords.forEach(function (mutation) {
      if (mutation.type == "childList") {
          var section = mutation.addedNodes[0]
          // Catch Valid links
          if (section && section.tagName && section.tagName == 'A') {
              // Hide Image Links
              var href = section.href
              if (section.className != 'Ryu' && ( href.includes('imgur') || href.includes('gyazo') || href.includes('png') || href.includes('jpg'))) {
                  section.hidden = true
              }
          }
          // When chat box opened
          if (section && section.className && section.className.includes('chat-box-content')) {
              var spans = section.getElementsByTagName("span")
              for (var i = 0; i < spans.length; i++){
                  var span = spans[i]
                  // Only select messages
                  if (span.title != ''){
                      doImages(span)
                  }
              }
              moveDown(spans[0])

          }
          // Catch message
          if (section && section.className && section.className.includes('message')) {
              // Goto span
              var message = section.getElementsByTagName('span')[0]
              doImages(message)
              moveDown(message, 1000)
          }
      }
  });
}

window.addEventListener('load', function() {
    // Get to spans
    var root = document.getElementById("chatRoot")
    var spans = root.getElementsByTagName("span")
    var singleMessage = ''
    for (var i = 0; i < spans.length; i++){
        var span = spans[i]
        // Only select messages
        if (span.title != ''){
            singleMessage = span
            doImages(span)
        }
    }
    moveDown(singleMessage)
}, false);

function doImages(span) {
// Loop through Span's children
    for (var j = 0; j < span.children.length; j++){
        var child = span.children[j]
        // If not A Tag go Next
        if (child.tagName != 'A') continue
        // Simplify link
        var link = child.href
        // Catch image links
        if (link.includes('imgur') || link.includes('gyazo') || link.includes('png') || link.includes('jpg')) {
            // Clean and format image links
            if (!link.includes('png') && !link.includes('jpg')) {
                var splice = link.split('//')
                splice.splice(1, 0, "//i.")
                splice.splice(4, 0, ".png")
                link = splice.join('')
            }
            // Create image element
            var x = document.createElement('div')
            var s = '<a href='+link+' class="Ryu" target="_blank"><img src="'+link+'" style="width: -webkit-fill-available;"/></a>';
            x.innerHTML = s
            span.appendChild(x)
            child.hidden = true
        }
    }
}

function moveDown(span, delay=500) {
    var view = span.parentElement.parentElement.parentElement
    setTimeout(function () { view.scrollTop = view.scrollHeight }, delay);
}
