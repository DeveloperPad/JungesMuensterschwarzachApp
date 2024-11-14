tinymce.init({
    language: 'de',
    selector: '.wysiwyg-editor',
    init_instance_callback: function (editor) {
        var freeTiny = document.querySelector('.tox .tox-notification--in');
        freeTiny.style.display = 'none';
    },
    setup: function(editor) {
        editor.on('change', function() {
            editor.save();
        });
        editor.on('blur', function() {
            $(editor.getElement()).trigger('change');
        });
    },
    plugins: 'preview importcss searchreplace autolink autoresize autosave save code visualblocks visualchars fullscreen image link media table charmap nonbreaking anchor insertdatetime advlist lists help charmap quickbars emoticons',
    imagetools_cors_hosts: ['picsum.photos'],
    menubar: 'edit view insert format tools table help',
    toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | preview save print | insertfile image media link anchor',
    toolbar_sticky: true,
    autosave_ask_before_unload: true,
    autosave_interval: "30s",
    autosave_prefix: "{path}{query}-{id}-",
    autosave_restore_when_empty: false,
    autosave_retention: "2m",
    relative_urls: false,
    remove_script_host : false,
    image_advtab: true,
    // content_css: '//www.tiny.cloud/css/codepen.min.css',
    // importcss_append: true,
    image_caption: true,
    paste_data_images: true,
    quickbars_selection_toolbar: 'bold italic | quicklink blockquote quickimage quicktable',
    noneditable_noneditable_class: "mceNonEditable",
    toolbar_mode: 'sliding',
    contextmenu: "undo redo | cut copy paste | link image imagetools table",
});