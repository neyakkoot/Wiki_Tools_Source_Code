/**
 * விக்சனரி மேம்பாட்டுக் கருவி (அம்மா பாணி)
 * பழைய தரவுகளை மாற்றாமல் புதிய கட்டமைப்பை மட்டும் சேர்க்கும்.
 */
(function() {
    // தொகுத்தல் பக்கத்தில் மட்டும் செயல்படும்
    if (mw.config.get('wgAction') === 'edit' || mw.config.get('wgAction') === 'submit') {
        
        var addFormatterButton = function() {
            $( '#wpTextbox1' ).wikiEditor( 'addToToolbar', {
                'section': 'main',
                'group': 'insert',
                'tools': {
                    'wiktFormat': {
                        label: 'விக்சனரி மேம்பாட்டுக் கருவி (பழைய தரவு பாதுகாப்பு முறை)',
                        type: 'button',
                        icon: '//upload.wikimedia.org/wikipedia/commons/4/41/Button_morph_struct.png',
                        action: {
                            type: 'callback',
                            execute: function(context) {
                                runSmartFormatter();
                            }
                        }
                    }
                }
            });
        };

        // விக்கி எடிட்டர் தயாரானதும் பொத்தானைச் சேர்
        if ( $.inArray( mw.config.get( 'userGroups' ), [ 'user', 'sysop' ] ) !== -1 ) {
            $.when( mw.loader.using( 'ext.wikiEditor' ), $.ready ).then( addFormatterButton );
        }
    }

    function runSmartFormatter() {
        var textbox = document.getElementById('wpTextbox1');
        var content = textbox.value;
        var pagename = mw.config.get('wgTitle');

        // 1. மொழித் தலைப்பு மற்றும் அடிப்படை வார்ப்புருக்கள்
        if (!content.match(/==\s*\{\{மொழி\|ta\}\}\s*==/)) {
            var header = "== {{மொழி|ta}} ==\n{{விக்கிப்பீடியா-மொழி|ta}}\n{{was wotd|2011|பெப்ரவரி|26}}\n{{ஒலிக்கோப்பு-தமிழ்|இந்தியா}}\n{{audio|LL-Q5885 (tam)-Sriveenkat-" + pagename + ".wav|[[File:Flag of India.svg|24px]]}}\n{{clear}}\n__TOC__\n";
            content = header + content;
        }

        // 2. பொருள் பகுதி (படம் மற்றும் பெயர்ச்சொல் வார்ப்புருவுடன்)
        if (!content.includes('=== பொருள் ===')) {
            var meaning = "\n=== பொருள் ===\n{{பெயர்ச்சொல்-பகுப்பு|ta}}\n{{படம்|File:Replace_this_image.jpg |ta|" + pagename + "|150px}}\n\n#[[பொருள்]]\n{{மேற்கோள்-சொல்‎}} '''" + pagename + "'''\n";
            content = content.replace(/(==\s*\{\{மொழி\|ta\}\}\s*==\n(?:.*?\n)*?)/, "$1" + meaning);
        }

        // 3. விளக்கம் (பகுபதம்)
        if (!content.includes('{{சாம்பல்நிறமூட்டி|விளக்கம்}}')) {
            content += "\n\n==={{சாம்பல்நிறமூட்டி|விளக்கம்}}===\n:*''பகுபதம்:'' [[ ]] + [[ ]]";
        }

        // 4. இந்திய மொழிகள் மொழிபெயர்ப்பு
        if (!content.includes('{{சாம்பல்நிறமூட்டி|இந்திய மொழிகள்}}')) {
            var indLangs = "\n\n==மொழிபெயர்ப்புகள்==\n==={{சாம்பல்நிறமூட்டி|இந்திய மொழிகள்}}===\n{{கூட்டுச்சொற்கள்-மேல்| மொழிபெயர்ப்புகளைக் }}\n{{பின்புலநிறம்-மஞ்சள்}}\n{{சிறு-மொழி|sa}} # [[]]\n{{சிறு-மொழி|hi}} # [[]]\n{{சிறு-மொழி|te}} # [[]]\n{{சிறு-மொழி|kn}} # [[]]\n{{சிறு-மொழி|ml}} # [[]]\n{{கூட்டுச்சொற்கள்-நடு| மொழிபெயர்ப்புகளைக் }}\n{{பின்புலநிறம்-நிறுத்தம்}}\n{{கூட்டுச்சொற்கள்-கீழ்| மொழிபெயர்ப்புகளைக் }}";
            content += indLangs;
        }

        // 5. உலக மொழிகள் மொழிபெயர்ப்பு
        if (!content.includes('{{சாம்பல்நிறமூட்டி|உலக மொழிகள்}}')) {
            var worldLangs = "\n\n==={{சாம்பல்நிறமூட்டி|உலக மொழிகள்}}===\n{{கூட்டுச்சொற்கள்-மேல்| மொழிபெயர்ப்புகளைக் }}\n{{பின்புலநிறம்-மஞ்சள்}}\n{{சிறு-மொழி|en}} # [[]]\n{{சிறு-மொழி|fr}} # [[]]\n{{கூட்டுச்சொற்கள்-நடு|உலக மொழிபெயர்ப்புகள்}}\n{{பின்புலநிறம்-நிறுத்தம்}}\n{{கூட்டுச்சொற்கள்-கீழ்|உலக மொழிபெயர்ப்புகள்}}";
            content += worldLangs;
        }

        // 6. இலக்கிய மேற்கோள்கள்
        if (!content.includes('==இலக்கிய மேற்கோள்கள்==')) {
            content += "\n\n==இலக்கிய மேற்கோள்கள்==\n{{மேற்கோள்-நூல்|நூல் பெயர்}} வரி '''" + pagename + "'''";
        }

        // 7. ஒத்த சொற்கள் மற்றும் பிற வடிவங்கள்
        if (!content.includes('== ஒத்த சொற்கள் ==')) {
            content += "\n\n== ஒத்த சொற்கள் ==\n* [[ ]], [[ ]]";
        }
        
        if (!content.includes('==பிற வடிவங்கள்==')) {
            content += "\n\n==பிற வடிவங்கள்==\n{{விக்கிப்பீடியா|வேற்றுமையுருபு}}\n* வேற்றுமையுருபுகளால் மாறக்கூடியன.";
        }

        // 8. சொல்வளம் பகுதி
        if (!content.includes('{{கூட்டுச்சொற்கள்-மேல்|சொல்வளம்}}')) {
            content += "\n\n==[[சொல் வளப்பகுதி|சொல்வளம்]] ==\n{{கூட்டுச்சொற்கள்-மேல்|சொல்வளம்}}\n:*[[ ]]\n{{கூட்டுச்சொற்கள்-கீழ்}}";
        }

        // 9. ஆதாரங்கள் மற்றும் பகுப்புகள்
        if (!content.includes('{{ஆதாரங்கள்-மொழி|ta}}')) {
            content += "\n\n{{ஆதாரங்கள்-மொழி|ta}} {{indowordnet}}";
        }
        
        if (!content.includes('[[பகுப்பு:தமிழ்-படங்களுள்ளவை]]')) {
            content += "\n\n[[பகுப்பு:தமிழ்-படங்களுள்ளவை]]\n[[பகுப்பு:உறவுச் சொற்கள்]]";
        }

        // மாற்றியமைக்கப்பட்ட உள்ளடக்கத்தை பெட்டியில் இடுதல்
        textbox.value = content;
    }
})();
