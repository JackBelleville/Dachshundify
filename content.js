const dachshund = chrome.runtime.getURL("icon.png");

function replaceImage(img) {
    // Prevent infinite loop by checking if source is already set
    if (img.src !== dachshund) {
        img.src = dachshund;
        // Remove srcset to prevent the browser from using alternative images
        if (img.hasAttribute('srcset')) {
            img.removeAttribute('srcset');
        }
    }
}

// Function to handle mutations
function handleMutations(mutations) {
    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if the added node itself is an image
                    if (node.tagName === 'IMG') {
                        replaceImage(node);
                    }
                    // Check for images inside the added node
                    const imgs = node.getElementsByTagName('img');
                    for (const img of imgs) {
                        replaceImage(img);
                    }
                }
            });
        } else if (mutation.type === 'attributes' && mutation.target.tagName === 'IMG') {
            // Handle attribute changes (src or srcset)
            replaceImage(mutation.target);
        }
    }
}

// Create and start the observer
const observer = new MutationObserver(handleMutations);
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'srcset']
});

// Initial run to replace images present on load
const initialImgs = document.getElementsByTagName("img");
for (const img of initialImgs) {
    replaceImage(img);
}