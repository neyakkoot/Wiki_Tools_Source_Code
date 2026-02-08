/**
 * EN2TA Infobox Importer (Dynamic Parameter Detection & Cleaning)
 */
(function () {
    'use strict';

    // 1. தேவையற்ற குறியீடுகளை நீக்கும் சார்பு (unexpectedsymbolremove.js லாஜிக்)
    function cleanSymbols(text) {
        if (!text) return "";
        return text
            .replace(/<ref[\s\S]*?(\/ref>|>)/g, "") // மேற்கோள்களை நீக்க
            .replace(/\[\[(Category|വർഗ്ഗം|பகுப்பு):.*?\]\]/gi, "") // பகுப்புகளை நீக்க
            .replace(/&nbsp;/g, " ")
            .replace(/[\u200B-\u200D\uFEFF]/g, "") // மறைந்திருக்கும் குறியீடுகள் (Zero-width spaces)
            .replace(/<br\s*\/?>/gi, "\n") // HTML பிரேக் குறியீடுகளை நீக்க
            .trim();
    }

    // 2. ஆங்கிலப் பெயர்களைத் தமிழாக்க முயற்சிக்கும் எளிய மேப்பிங்
    // (இது ஒரு தொடக்கப்புள்ளி மட்டுமே, நீங்கள் இதை விரிவுபடுத்தலாம்)
    const labelTranslation = {
        "name": "பெயர்",
        "birth_date": "பிறந்த தேதி",
        "birth_place": "பிறந்த இடம்",
        "death_date": "இறந்த தேதி",
        "death_place": "இறந்த இடம்",
        "occupation": "தொழில்",
        "nationality": "தேசிய இனம்",
        "image": "படம்",
        "caption": "விளக்கம்",
        "website": "இணையதளம்",
        "education": "கல்வி"
    };

    function initEN2TA() {
        if (['edit', 'submit'].indexOf(mw.config.get('wgAction')) !== -1) {
            var link = mw.util.addPortletLink(
                'p-views', 
                '#',
                '🚀 EN2TA Smart',
                'ca-en2ta-infobox',
                'தகவற்பெட்டியைத் தானாகக் கண்டறிந்து மொழிபெயர்க்க'
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
        mw.notify('ஆங்கிலத் தகவல்கள் பகுப்பாய்வு செய்யப்படுகின்றன...', { type: 'info' });

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
                alert("❌ பிழை: ஆங்கிலத்தில் இந்தக் கட்டுரை இல்லை!");
                return;
            }

            var fullText = page.revisions[0].slots.main.content;
            // தகவற்பெட்டியை மட்டும் பிரித்தெடுத்தல்
            var infoboxMatch = fullText.match(/\{\{Infobox[\s\S]*?\n\}\}/i);

            if (infoboxMatch) {
                var rawInfobox = infoboxMatch[0];
                
                // பாராமீட்டர்களைத் தானாகப் பிரித்து தமிழாக்கம் செய்தல்
                var lines = rawInfobox.split('\n');
                var translatedLines = lines.map(function(line) {
                    // '| key = value' என்ற அமைப்பைத் தேடுகிறது
                    var partMatch = line.match(/^\s*\|\s*([^=]+?)\s*=\s*(.*)$/);
                    if (partMatch) {
                        var key = partMatch[1].trim();
                        var value = partMatch[2].trim();

                        // அகராதியில் இருந்தால் பெயர் மாற்றம் செய், இல்லையென்றால் பழைய பெயரையே வை
                        var translatedKey = labelTranslation[key] || key;
                        
                        // மதிப்பில் உள்ள குறியீடுகளைச் சுத்தம் செய்
                        var cleanedValue = cleanSymbols(value);
                        
                        return "| " + translatedKey + " = " + cleanedValue;
                    }
                    return line;
                });

                var finalInfobox = translatedLines.join('\n');
                var $textBox = $('#wpTextbox1');
                
                // பெட்டியின் மேலே சேர்த்தல்
                $textBox.val(finalInfobox + "\n\n" + $textBox.val());
                mw.notify('✅ தகவற்பெட்டி வெற்றிகரமாக இணைக்கப்பட்டது!', { type: 'success' });
            } else {
                alert("⚠️ தகவல்: Infobox எதுவும் கிடைக்கவில்லை.");
            }
        });
    }

    mw.loader.using(['mediawiki.util', 'mediawiki.ForeignApi', 'mediawiki.api', 'mediawiki.notification']).done(initEN2TA);
})();
