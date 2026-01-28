/* தொகுப்புப் பகுதியில் {{படம்||en}} வார்ப்புருவைச் சேர்க்கும் பொத்தான் */
$(function() {
    var addPictureButton = function() {
        $( '#wpTextbox1' ).wikiEditor( 'addToToolbar', {
            'section': 'main',
            'group': 'insert',
            'tools': {
                'addEnPicture': {
                    label: 'படம் (en) வார்ப்புருவைச் சேர்',
                    type: 'button',
                    icon: '//upload.wikimedia.org/wikipedia/commons/1/12/Button_gallery.png', 
                    action: {
                        type: 'encapsulate',
                        options: {
                            pre: "{{படம்|",
                            post: "|en}}"
                        }
                    }
                }
            }
        });
    };

    /* விக்கி எடிட்டர் தயாரானதும் பொத்தானைச் சேர்க்கவும் */
    if ( $.inArray( mw.user.options.get( 'usebetatoolbar' ), [ 1, '1', true ] ) !== -1 ) {
        $.when( mw.loader.using( 'ext.wikiEditor' ), $.ready ).then( addPictureButton );
    }
});
