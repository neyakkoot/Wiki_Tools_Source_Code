/**
 * ஆங்கில விக்கியில் இருந்து தகவற்பெட்டியை எடுத்து தமிழ் விக்கிக்கு மாற்றும் கருவி
 * பயன்பாடு: இடது பக்க பட்டியில் உள்ள 'EN2TA Infobox' பொத்தானை அழுத்தவும்.
 */

(function () {
    // 1. கருவிப்பட்டியில் பொத்தானைச் சேர்த்தல்
    var link = mw.util.addPortletLink('p-tb', '#', 'EN2TA Infobox', 't-en2ta-infobox', 'ஆங்கில விக்கியில் இருந்து தகவற்பெட்டியைப் பிரதி எடு');

    $(link).click(function (e) {
        e.preventDefault();

        // பயனர் உள்ளீடுகளைப் பெறுதல்
        var enTitle = prompt("ஆங்கிலக் கட்டுரையின் தலைப்பு:", "");
        if (!enTitle) return;

        var taTitle = prompt("தமிழ் கட்டுரையின் தலைப்பு:", enTitle);
        if (!taTitle) return;

        var categoryName = prompt("பகுப்பின் பெயர்:", "ஆங்கிலத் திரைப்படங்கள்");
        var talkTemplate = "{{100விக்கிநாட்கள்2026}}";

        // ஆங்கில விக்கி API-ஐ அழைத்தல்
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

            // 2. தகவற்பெட்டியைத் தேடுதல் (Regex)
            // இங்கு Infobox தொடங்கி அதன் அடைப்புக்குறிகள் முடியும் வரை எடுக்கும்
            var infoboxMatch = fullText.match(/\{\{Infobox[\s\S]*?\n\}\}/i);

            if (infoboxMatch) {
                var infoboxData = infoboxMatch[0];
                saveToTamilWiki(taTitle, enTitle, infoboxData, categoryName, talkTemplate);
            } else {
                alert("தகவற்பெட்டி ஆங்கிலக் கட்டுரையில் கண்டறியப்படவில்லை.");
            }
        });
    });

    // 3. தமிழ் விக்கியில் சேமிக்கும் செயல்பாடு
    function saveToTamilWiki(taTitle, enTitle, infobox, category, talkTemplate) {
        var taApi = new mw.Api();
        
        // கட்டுரைக்கான உள்ளடக்கம்
        var articleText = "{{தொகுக்கப்படுகிறது}}\n" + 
                          infobox + "\n\n" + 
                          "'''Info-farmer/EN2TA Infobox.js''' (''" + enTitle + "'')\n\n\n" + 
                          "== மேற்கோள்கள் ==\n{{Reflist}}\n\n" + 
                          "[[பகுப்பு:" + category + "]]";

        var editSummary = "[[:en:" + enTitle + "]] என்பதன் தகவற்பெட்டி மட்டும் படியிடப்பட்டது. + மேற்கோள்வார்ப்புரு & பகுப்பு";

        // முதன்மைப் பக்கத்தைச் சேமித்தல்
        taApi.postWithEditToken({
            action: 'edit',
            title: taTitle,
            text: articleText,
            summary: editSummary,
            format: 'json'
        }).done(function (result) {
            mw.notify('கட்டுரை வெற்றிகரமாக உருவாக்கப்பட்டது/புதுப்பிக்கப்பட்டது.');

            // 4. பேச்சுப் பக்கத்தில் வார்ப்புரு இடுதல்
            var talkTitle = 'பேச்சு:' + taTitle;
            taApi.get({
                action: 'query',
                prop: 'revisions',
                titles: talkTitle,
                rvprop: 'content',
                formatversion: 2
            }).done(function (tData) {
                var existingTalk = "";
                if (tData.query.pages[0].revisions) {
                    existingTalk = tData.query.pages[0].revisions[0].content;
                }
                
                var newTalkContent = talkTemplate + "\n\n" + existingTalk;

                taApi.postWithEditToken({
                    action: 'edit',
                    title: talkTitle,
                    text: newTalkContent,
                    summary: "+ " + talkTemplate,
                    format: 'json'
                }).done(function () {
                    mw.notify('பேச்சுப் பக்கத்தில் வார்ப்புரு சேர்க்கப்பட்டது.');
                    // முடிந்ததும் கட்டுரையைத் திறக்க
                    window.location.href = mw.util.getUrl(taTitle);
                });
            });

        }).fail(function (code, obj) {
            alert("பிழை: " + code);
        });
    }
})();
