/* ==========================================================================
   Shared components
   Fetches src/components/header.html and footer.html into [data-component]
   mounts. Component links are written relative to src/ and resolved here,
   so the same markup works from the root page and from nested pages.
   ========================================================================== */
(function () {
    "use strict";

    var script = document.currentScript;

    if (!script) {
        script = Array.prototype.filter.call(document.scripts, function (element) {
            return /(^|\/)main\.js(?:\?|$)/.test(element.src);
        }).pop();
    }

    if (!script) return;

    var srcRoot = new URL("./", script.src);
    var page = document.body.getAttribute("data-page");

    function resolveURLs(root) {
        root.querySelectorAll("[href], [src]").forEach(function (element) {
            ["href", "src"].forEach(function (attribute) {
                var value = element.getAttribute(attribute);

                if (!value || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(value)) {
                    return;
                }

                element.setAttribute(attribute, new URL(value, srcRoot).href);
            });
        });
    }

    function markCurrent(root) {
        if (!page) return;

        var link = root.querySelector('[data-nav="' + page + '"]');

        if (link) {
            link.setAttribute("aria-current", "page");
        }
    }

    function loadComponent(mount) {
        var name = mount.getAttribute("data-component");
        var url = new URL("components/" + name + ".html", srcRoot);

        return fetch(url, { credentials: "same-origin" })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Could not load " + url.pathname);
                }

                return response.text();
            })
            .then(function (markup) {
                var template = document.createElement("template");
                template.innerHTML = markup.trim();

                resolveURLs(template.content);
                markCurrent(template.content);
                mount.replaceChildren(template.content);
                mount.setAttribute("data-loaded", "");
            });
    }

    document.querySelectorAll("[data-component]").forEach(function (mount) {
        loadComponent(mount).catch(function (error) {
            console.error(error);
            mount.hidden = true;
        });
    });
})();
