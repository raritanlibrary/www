<?php
if (isset($_POST['submit'])) {
    $file = fopen("docs/winnoc.txt", "w");
    $token = date("Y-m-d") . " " . $_POST['winnoc'] . "\n";
    fwrite($file, $token);
    fclose($file);
}
?>