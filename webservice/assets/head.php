<!-- Bootstrap-->
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="<?php echo(ROOT_PUBLIC);?>/css/bootstrap.min.css">
<script src="<?php echo(ROOT_PUBLIC);?>/js/jquery.min.js"></script>
<script src="<?php echo(ROOT_PUBLIC);?>/js/popper.min.js"></script>
<script src="<?php echo(ROOT_PUBLIC);?>/js/bootstrap.min.js"></script>
<!-- Moment -->
<script src="<?php echo(ROOT_PUBLIC);?>/js/moment.js"></script>
<!-- Date time picker -->
<link rel="stylesheet" href="<?php echo(ROOT_PUBLIC);?>/css/jquery.datetimepicker.css">
<script src="<?php echo(ROOT_PUBLIC);?>/js/jquery.datetimepicker.js"></script>
<script src="<?php echo(ROOT_PUBLIC);?>/js/date_time_picker.js"></script>
<!-- Font Awesome -->
<link rel="stylesheet" href="<?php echo(ROOT_PUBLIC);?>/css/fontawesome-all.css">
<!-- TinyMCE -->
<script src="https://cdn.tiny.cloud/1/5oubppvg07odr9hbh5n0okb17j4nhutqxlj59soxxgxiqm8p/tinymce/5/tinymce.min.js" referrerpolicy="origin"></script>
<script src="<?php echo(ROOT_PUBLIC);?>/js/tinymce.js"></script>
<!-- Mapbox -->
<script src='https://api.mapbox.com/mapbox-gl-js/v1.4.1/mapbox-gl.js'></script>
<link href='https://api.mapbox.com/mapbox-gl-js/v1.4.1/mapbox-gl.css' rel='stylesheet' />
<!-- CSP for XSS Prevention -->
<meta http-equiv="Content-Security-Policy"
    content="
      default-src 'self' localhost localhost:3000 luckev.info www.luckev.info app.jugendarbeit-muensterschwarzach.de app.junges-muensterschwarzach.de; 
      script-src  'self' 'unsafe-inline' blob: localhost localhost:3000 luckev.info www.luckev.info app.jugendarbeit-muensterschwarzach.de app.junges-muensterschwarzach.de *.tinymce.com *.tiny.cloud *.mapbox.com; 
      connect-src 'self' blob: localhost localhost:3000 luckev.info www.luckev.info app.jugendarbeit-muensterschwarzach.de app.junges-muensterschwarzach.de *.tinymce.com *.tiny.cloud *.mapbox.com; 
      img-src     'self' blob: data: localhost localhost:3000 luckev.info www.luckev.info app.jugendarbeit-muensterschwarzach.de app.junges-muensterschwarzach.de *.tinymce.com *.tiny.cloud *.ytimg.com *.tenor.com *.mapbox.com; 
      frame-src   'self' localhost localhost:3000 luckev.info www.luckev.info app.jugendarbeit-muensterschwarzach.de app.junges-muensterschwarzach.de *.youtube.com;
      media-src   'self' localhost localhost:3000 luckev.info www.luckev.info app.jugendarbeit-muensterschwarzach.de app.junges-muensterschwarzach.de *.youtube.com; 
      style-src   'self' 'unsafe-inline' localhost localhost:3000 luckev.info www.luckev.info app.jugendarbeit-muensterschwarzach.de app.junges-muensterschwarzach.de *.tinymce.com *.tiny.cloud fonts.googleapis.com *.mapbox.com; 
      font-src    'self' localhost localhost:3000 luckev.info www.luckev.info app.jugendarbeit-muensterschwarzach.de app.junges-muensterschwarzach.de *.tinymce.com *.tiny.cloud fonts.gstatic.com;"
/>
<!-- JMA -->
<title><?php echo($GLOBALS["dict"]["general_web_title"]);?></title>
<meta name="author" content="Pad">
<meta charset="utf-8">
<link rel="icon" href="<?php echo(ROOT_PUBLIC);?>/assets/icons/favicon.png">
<link rel="stylesheet" href="<?php echo(ROOT_PUBLIC);?>/css/stylesheet.css">
<script src="<?php echo(ROOT_PUBLIC);?>/js/dict.js"></script>
<script src="<?php echo(ROOT_PUBLIC);?>/js/session.js"></script>