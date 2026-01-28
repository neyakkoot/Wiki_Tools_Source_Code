/**
 * ஆங்கில விக்கியில் இருந்து தகவற்பெட்டியை எடுத்து தமிழ் விக்கிக்கு மாற்றும் கருவி
 */
(function () {
    function initEN2TA() {
        // கருவிப்பட்டியில் (Tools menu) பொத்தானைச் சேர்த்தல்
        var link = mw.util.addPortletLink(
            'p-tb', 
            '#', 
            'EN2TA Infobox', 
            't-en2ta-infobox', 
            'ஆங்கில விக்கியில் இருந்து தகவற்பெட்டியைப் பிரதி எடு'
        );

        if (link) {
            $(link).click(function (e) {
                e.preventDefault();
                runTool();
            });
        }
    }

    function runTool() {
        var enTitle = prompt("ஆங்கிலக் கட்டுரையின் தலைப்பு:", "");
        if (!enTitle) return;

        var taTitle = prompt("தமிழ் கட்டுரையின் தலைப்பு:", enTitle);
        if (!taTitle) return;

        var categoryName = prompt("பகுப்பின் பெயர்:", "ஆங்கிலத் திரைப்படங்கள்");
        var talkTemplate = "{{100விக்கிநாட்கள்2026}}";

        var enApi = new mw.ForeignApi('https://en.wikipedia.org/w/api.php');

        enApi.get({
            action: 'query',
            prop: 'revisions',
            titles: enTitle,
            rvprop: 'content',
            rvslots: 'main',
            formatversion: 2
        }).done(function (data) {
            var page = data.query.pages[0];
            if (page.missing) {
                alert("ஆங்கிலத்தில் இப்படி ஒரு கட்டுரை இல்லை!");
                return;
            }

            var fullText = page.revisions[0].slots.main.content;
            var infoboxMatch = fullText.match(/\{\{Infobox[\s\S]*?\n\}\}/i);

            if (infoboxMatch) {
                saveToTamilWiki(taTitle, enTitle, infoboxMatch[0], categoryName, talkTemplate);
            } else {
                alert("தகவற்பெட்டி ஆங்கிலக் கட்டுரையில் கண்டறியப்படவில்லை.");
            }
        });
    }

    function saveToTamilWiki(taTitle, enTitle, infobox, category, talkTemplate) {
        var taApi = new mw.Api();
        var articleText = "{{தொகுக்கப்படுகிறது}}\n" + infobox + "\n\n" + 
                          "== மேற்கோள்கள் ==\n{{Reflist}}\n\n" + 
                          "[[பகுப்பு:" + category + "]]";

        taApi.postWithEditToken({
            action: 'edit',
            title: taTitle,
            text: articleText,
            summary: "[[:en:" + enTitle + "]] தகவற்பெட்டி நகலெடுக்கப்பட்டது",
            format: 'json'
        }).done(function () {
            mw.notify('கட்டுரை உருவாக்கப்பட்டது.');
            window.location.href = mw.util.getUrl(taTitle);
        });
    }

    // மீடியாவிக்கி தொகுதிகள் தயாரானதும் இயக்கவும்
    $(document).ready(function() {
        mw.loader.using(['mediawiki.util', 'mediawiki.ForeignApi', 'mediawiki.api']).done(initEN2TA);
    });
})();
