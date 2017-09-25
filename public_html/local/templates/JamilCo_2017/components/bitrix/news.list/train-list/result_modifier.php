<?
foreach($arResult["ITEMS"] as $index =>&$arItem):
    if($arItem["DATE_ACTIVE_FROM"]) {
        $arItem["DATE_FROM"] = ConvertDateTime($arItem["DATE_ACTIVE_FROM"], "YYYYMMDDHHMI", "ru");
        $arItem["DATE_FROM_SHORT"] = ConvertDateTime($arItem["DATE_ACTIVE_FROM"], "YYYYMMDD", "ru");
    }
    if($arItem["DATE_ACTIVE_TO"]) {
        $arItem["DATE_TO"] = ConvertDateTime($arItem["DATE_ACTIVE_TO"], "YYYYMMDDHHMI", "ru");
        $arItem["DATE_TO_SHORT"] = ConvertDateTime($arItem["DATE_ACTIVE_TO"], "YYYYMMDD", "ru");
    }

    $cityTO = $arItem["DISPLAY_PROPERTIES"]["CITY_TO"]["VALUE"];
    $cityFROM = $arItem["DISPLAY_PROPERTIES"]["CITY_FROM"]["VALUE"];
    $arItem["CITY_TO"] = $arItem["DISPLAY_PROPERTIES"]["CITY_TO"]["LINK_ELEMENT_VALUE"][$cityTO];
    $arItem["CITY_FROM"] = $arItem["DISPLAY_PROPERTIES"]["CITY_FROM"]["LINK_ELEMENT_VALUE"][$cityFROM];
endforeach;
unset($arItem);