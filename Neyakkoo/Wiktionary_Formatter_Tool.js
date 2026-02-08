// விக்சனரி சொற்களை 'அம்மா' பாணிக்கு மாற்றும் கருவி
(function() {
    if (mw.config.get('wgAction') === 'edit' || mw.config.get('wgAction') === 'submit') {
        var customizeToolbar = function() {
            $( '#wpTextbox1' ).wikiEditor( 'addToToolbar', {
                'section': 'main',
                'group': 'insert',
                'tools': {
                    'wiktFormat': {
                        label: 'விக்சனரி மேம்பாட்டுக் கருவி (அம்மா பாணி)',
                        type: 'button',
                        icon: '//upload.wikimedia.org/wikipedia/commons/2/2a/Button_category_plus.png',
                        action: {
                            type: 'callback',
                            execute: function(context) {
                                formatWiktionaryEntry();
                            }
                        }
                    }
                }
            });
        };

        if ( $.inArray( mw.config.get( 'userGroups' ), [ 'user', 'sysop' ] ) !== -1 ) {
            $.when( mw.loader.using( 'ext.wikiEditor' ), $.ready ).then( customizeToolbar );
        }
    }

    function formatWiktionaryEntry() {
        var textbox = document.getElementById('wpTextbox1');
        var content = textbox.value;
        var pagename = mw.config.get('wgTitle');

        // அடிப்படை வார்ப்புருக்களைச் சேர்த்தல் (அம்மா பாணி)
        var newContent = "== {{மொழி|ta}} ==\n" +
            "{{விக்கிப்பீடியா-மொழி|ta}}\n" +
            "{{ஒலிக்கோப்பு-தமிழ்|இந்தியா}}\n" +
            "{{audio|LL-Q5885 (tam)-Sriveenkat-" + pagename + ".wav|[[File:Flag of India.svg|24px]]}}\n" +
            "{{clear}}\n" +
            "__TOC__\n" +
            "=== பொருள் ===\n" +
            "{{பெயர்ச்சொல்-பகுப்பு|ta}}\n" +
            "{{படம்|File:Replace_this_image.jpg |ta|" + pagename + "|150px}}\n\n" +
            "#[[பொருள்1|பொருளை]] குறிப்பதற்குப் பயன்படும் சொல்.\n" +
            "{{மேற்கோள்-சொல்‎}} '''" + pagename + "'''வைப் பேணு.\n\n" +
            "==={{சாம்பல்நிறமூட்டி|விளக்கம்}}===\n" +
            ":*''பகுபதம்:'' [[]] + [[]]\n\n" +
            "==மொழிபெயர்ப்புகள்==\n" +
            "==={{சாம்பல்நிறமூட்டி|இந்திய மொழிகள்}}===\n" +
            "{{கூட்டுச்சொற்கள்-மேல்| மொழிபெயர்ப்புகளைக் }}\n" +
            "{{பின்புலநிறம்-மஞ்சள்}}\n" +
            "{{சிறு-மொழி|sa}} # [[]]\n" +
            "{{சிறு-மொழி|hi}} # [[]]\n" +
            "{{கூட்டுச்சொற்கள்-நடு| மொழிபெயர்ப்புகளைக் }}\n" +
            "{{பின்புலநிறம்-நிறுத்தம்}}\n" +
            "{{கூட்டுச்சொற்கள்-கீழ்| மொழிபெயர்ப்புகளைக் }}\n\n" +
            "==இலக்கிய மேற்கோள்கள்==\n" +
            "{{மேற்கோள்-நூல்|நூல் பெயர்}} மேற்கோள் வரி '''" + pagename + "'''\n\n" +
            "== ஒத்த சொற்கள் ==\n" +
            "* [[]], [[]]\n\n" +
            "==பிற வடிவங்கள்==\n" +
            "{{விக்கிப்பீடியா|வேற்றுமையுருபு}}\n" +
            "* வேற்றுமையுருபுகளால் மாறக்கூடியன.\n\n" +
            "{{ஆதாரங்கள்-மொழி|ta}}\n\n" +
            "[[பகுப்பு:தமிழ்-படங்களுள்ளவை]]";

        // ஏற்கனவே உள்ள உள்ளடக்கத்துடன் இதை இணைக்க வேண்டுமா அல்லது மாற்ற வேண்டுமா என்பதைப் பயனர் முடிவு செய்ய வேண்டும்.
        // இங்கே முழுமையாக மாற்றுகிறது.
        textbox.value = newContent;
    }
})();
