<?php

function doTechTest(array $bigData)
{
    header("Content-Type: application/json");

    $offset = 0;
    $limit = 25;

    if(array_key_exists('offset', $_GET))
    {
        $offset = intval($_GET['offset']);
    }

    if(array_key_exists('limit', $_GET))
    {
        $userLimit = intval($_GET['limit']);

        if(0 != $userLimit)
        {
            $limit = $userLimit;
        }
    }

    $dataChunks = array_chunk($bigData, $limit, true);

    if(!array_key_exists($offset, $dataChunks))
    {
        header("HTTP/1.1 500 Internal Server Error");
        echo json_encode(array('message' => 'Could not find your offset within the data chunks. Given your limit is '
        . $limit . ' the maximum offset you can request is ' . max(array_keys($dataChunks))));
        exit;
    }

    $data = $dataChunks[$offset];

    $output = array(
        'total' => count($bigData),
        'offset' => $offset,
        'limit' => $limit,
        'data' => $data,
    );

    echo json_encode($output);
}