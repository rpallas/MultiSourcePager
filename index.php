<?php

$serverUrl = $_SERVER['HTTP_HOST'];

$secure = empty($_SERVER["HTTPS"]) ? '' : ($_SERVER["HTTPS"] == "on") ? "s" : "";
$url = 'http' . $secure . '://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

$indexPosition = stripos($url, 'index.php');
if(false !== $indexPosition)
{
    $url = substr($url, 0, $indexPosition);
}

$url = rtrim($url, '/') . '/';

$output = array(
    'products' => array(
        array(
            'name' => 'TechTest',
            'link' => $url . 'server1.php',
        ),
        array(
            'name' => 'TechTest',
            'link' => $url . 'server2.php',
        ),
    )
);

header('Content-type:application/json');

echo json_encode($output);