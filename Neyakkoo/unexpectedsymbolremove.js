/* தொகுப்புப் பகுதியில் தேர்ந்தெடுக்கப்பட்ட உரையில் உள்ள [[ மற்றும் ]] குறிகளை நீக்க */
$(function() {
    var addCustomButton = function() {
        $( '#wpTextbox1' ).wikiEditor( 'addToToolbar', {
            'section': 'main',
            'group': 'insert',
            'tools': {
                'removeBrackets': {
                    label: 'விக்கி இணைப்புக் குறிகளை நீக்கு',
                    type: 'button',
                    icon: '//upload.wikimedia.org/wikipedia/commons/2/20/Button_subst.png', 
                    action: {
                        type: 'callback',
                        execute: function(context) {
                            var selText = $( '#wpTextbox1' ).textSelection('getSelection');
                            if (selText) {
                                var cleanText = selText.replace(/\[\[/g, '').replace(/\]\]/g, '');
                                $( '#wpTextbox1' ).textSelection('encapsulateSelection', {
                                    replace: true,
                                    peri: cleanText
                                });
                            } else {
                                alert('தயவுசெய்து உரையைத் தேர்ந்தெடுக்கவும் (Select the text first)!');
                            }
                        }
                    }
                }
            }
        });
    };

    /* விக்கி எடிட்டர் தயாரானதும் பொத்தானைச் சேர்க்கவும் */
    if ( $.inArray( mw.user.options.get( 'usebetatoolbar' ), [ 1, '1', true ] ) !== -1 ) {
        $.when( mw.loader.using( 'ext.wikiEditor' ), $.ready ).then( addCustomButton );
    }
});
