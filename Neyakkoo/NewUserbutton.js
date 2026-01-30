mw.loader.using('user.options', function () {
    if (mw.user.options.get('usebetatoolbar')) {
        mw.loader.using('ext.wikiEditor', function () {
            $(document).ready(function () {
                $('#wpTextbox1').wikiEditor('addToToolbar', {
                    'section': 'main',
                    'group': 'insert',
                    'tools': {
                        'newuser': {
                            label: 'புதுப்பயனர் வரவேற்பு',
                            type: 'button',
                            icon: '//upload.wikimedia.org/wikipedia/commons/2/23/Icons-mini-user_add.png',
                            action: {
                                type: 'encapsulate',
                                options: {
                                    pre: "{{subst:புதுப்பயனர்}} ~~~~"
                                }
                            }
                        }
                    }
                });
            });
        });
    }
});
