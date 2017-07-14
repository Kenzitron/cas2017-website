HTMLImports.whenReady(function () {
    menu.appendChild(document.getElementById('link-menu').import.childNodes[0]);
    footer.appendChild(document.getElementById('link-footer').import.childNodes[0]);

    var i18n = window.domI18n({
        selector: '[data-translatable]',
        separator: ' // ',
        languages: ['es', 'en'],
        currentLanguage: 'es',
        defaultLanguage: 'es'
    });

    var links = document.getElementsByClassName('change-language');
    var language = 'es';
    for (var i = 0; i < links.length; i++) {
        var changeLanguage = links[i];
        changeLanguage.onclick = (e) => {
            language = language === 'es' ? 'en' : 'es';
            var links = document.getElementsByClassName('change-language');
            for (var i = 0; i < links.length; i++) {
                links[i].textContent = language === 'es' ? 'EN' : 'ES';
            }
            i18n.changeLanguage(language);
            window.location.hash = '#' + language;
            e.preventDefault();
        };
    }

    if (window.location.hash.indexOf('en') !== -1 && language === 'es') {
        language = 'en';
        i18n.changeLanguage(language);
        for (var i = 0; i < links.length; i++) {
            var changeLanguage = links[i];
            changeLanguage.textContent = language === 'es' ? 'EN' : 'ES';
        }
    }

    var nodes = document.querySelectorAll('[hasheable]');

    for (var i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        node.onclick = function () {
            window.location.assign(node.href + '#' + language);
            return false;
        }
    }
});

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-100345104-1', 'auto');
ga('send', 'pageview');