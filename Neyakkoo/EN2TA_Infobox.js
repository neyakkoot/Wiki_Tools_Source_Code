/**
 * EN2TA Infobox Importer (Vector 2022 Optimized)
 */
(function () {
    'use strict';

    function initEN2TA() {
        var action = mw.config.get('wgAction');
        if (action === 'edit' || action === 'submit') {
            
            // Vector 2022-இல் 'p-cactions' மெனுவிற்கு பதிலாக நேரடியாகத் தெரிய 'p-views' பயன்படுத்துகிறோம்
            var link = mw.util.addPortletLink(
                'p-views', 
                '#',
                '🚀 EN2TA',
                'ca-en2ta-infobox',
                'ஆங்கில விக்கியில் இருந்து தகவற்பெட்டியைப் பெறு'
            );

            if (link) {
                $(link).click(function (e) {
                    e.preventDefault();
                    runTool();
                });
            }
        }
    }

    function runTool() {
        var enTitle = prompt("📦 ஆங்கிலக் கட்டுரையின் தலைப்பு (English Article Title):", "");
        if (!enTitle) return;

        var enApi = new mw.ForeignApi('https://en.wikipedia.org/w/api.php');
        mw.notify('ஆங்கிலத் தரவுகள் பெறப்படுகின்றன...', { type: 'info' });

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
                alert("❌ பிழை: ஆங்கிலத்தில் இப்படி ஒரு கட்டுரை இல்லை!");
                return;
            }

            var fullText = page.revisions[0].slots.main.content;
            var infoboxMatch = fullText.match(/\{\{Infobox[\s\S]*?\n\}\}/i);

            if (infoboxMatch) {
                var $textBox = $('#wpTextbox1');
                $textBox.val(infoboxMatch[0] + "\n\n" + $textBox.val());
                mw.notify('✅ தகவற்பெட்டி இணைக்கப்பட்டது!', { type: 'success' });
            } else {
                alert("⚠️ தகவல்: இந்தக் கட்டுரையில் 'Infobox' கண்டறியப்படவில்லை.");
            }
        });
    }

    mw.loader.using(['mediawiki.util', 'mediawiki.ForeignApi', 'mediawiki.api', 'mediawiki.notification']).done(initEN2TA);
})();
