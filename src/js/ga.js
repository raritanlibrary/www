window.dataLayer = window.dataLayer || [];
const gtag = () => dataLayer.push(arguments);
gtag('js', new Date());
gtag('config', 'UA-130594894-1');
let trackOutboundLink = url => {
    ga('send', 'event', 'outbound', 'click', url, {'transport': 'beacon', 'hitCallback': () => document.location=url})
};