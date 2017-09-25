<?function r($arr)
{
    if ($GLOBALS["USER"]->GetLogin() == 'admin') {
        echo '<pre>' . print_r($arr, true) . '</pre>';
    }
}

function rr($arr)
{
    echo '<pre>' . print_r($arr, true) . '</pre>';
}
?>