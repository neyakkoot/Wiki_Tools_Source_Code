(function() {
    function addCropLink() {
        // பக்க பெயர்வெளியில் (Page Namespace) மட்டும் இயங்குவதை உறுதி செய்தல்
        if (mw.config.get('wgNamespaceNumber') === 104) {
            var pageTitle = mw.config.get('wgPageName');
            var cropUrl = 'https://croptool.toolforge.org/?title=' + encodeURIComponent(pageTitle);

            // டெஸ்க்டாப் மற்றும் மொபைல் இரண்டிற்கும் பொதுவான மெனுவில் சேர்த்தல்
            var link = mw.util.addPortletLink(
                document.getElementById('p-cactions') ? 'p-cactions' : 'p-tb', 
                cropUrl, 
                'Crop Image', 
                'ca-crop', 
                'Crop this image using CropTool'
            );

            // மொபைல் திரையில் பொத்தான் சரியாகத் தெரிய சில ஸ்டைல்கள்
            if (link) {
                link.style.fontWeight = 'bold';
                link.style.color = '#36c';
            }
        }
    }

    // மேலோட்டமாக நிரலை ஏற்றுதல்
    mw.loader.using(['mediawiki.util'], function() {
        $(addCropLink);
    });
})();
