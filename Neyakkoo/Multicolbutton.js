(function() {
    // 1. பத்திகளைப் பிரிக்கும் செயல்பாடு
    function applyMulticol() {
        var wpTextbox1 = document.getElementById('wpTextbox1');
        if (!wpTextbox1) return;

        var text = wpTextbox1.value;
        if (text.includes('{{Multicol')) {
            alert("ஏற்கனவே Multicol வார்ப்புருக்கள் உள்ளன!");
            return;
        }

        // 2 அல்லது அதற்கு மேற்பட்ட காலியான வரிகளை (Blank lines) கண்டறிதல்
        var breakPattern = /\n\s*\n\s*\n/g; 
        var updatedText = text.trim().replace(breakPattern, '\n\n{{Multicol-break}}\n\n');

        var finalText = "{{Multicol|line=1px solid black}}\n\n" + updatedText + "\n\n{{Multicol-end}}";
        wpTextbox1.value = finalText;
    }

    // 2. கருவிப்பட்டியில் பொத்தானைச் சேர்த்தல்
    var addCustomButton = function() {
        $( '#wpTextbox1' ).wikiEditor( 'addToToolbar', {
            'section': 'main',
            'group': 'insert',
            'tools': {
                'multicol_btn': {
                    label: 'இரு பத்திகளாகப் பிரி (Multicol)',
                    type: 'button',
                    // வண்ணமயமான சிவப்பு நிற ஐகான்
                    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/VisualEditor_-_Icon_-_Layout.svg/24px-VisualEditor_-_Icon_-_Layout.svg.png', 
                    action: {
                        type: 'callback',
                        execute: function(context) {
                            applyMulticol();
                        }
                    }
                }
            }
        });
    };

    // விக்கி எடிட்டர் தயாரானதும் பொத்தானை இயக்கு
    if ( $.inArray( mw.config.get( 'wgAction' ), [ 'edit', 'submit' ] ) !== -1 ) {
        mw.loader.using( 'ext.wikiEditor', function() {
            $( document ).ready( addCustomButton );
        });
    }
})();
