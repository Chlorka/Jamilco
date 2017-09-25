<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
/** @var array $arParams */
/** @var array $arResult */
/** @global CMain $APPLICATION */
/** @global CUser $USER */
/** @global CDatabase $DB */
/** @var CBitrixComponentTemplate $this */
/** @var string $templateName */
/** @var string $templateFile */
/** @var string $templateFolder */
/** @var string $componentPath */
/** @var CBitrixComponent $component */
$this->setFrameMode(true);
?>
<?=bitrix_sessid_post();?>
<table id="trainTable" width="100%" cellspacing="0">
    <thead>
    <tr>
        <th></th>
        <th class="numTrain"><a>Поезд <i></i></a></th>
        <th class="wayTrain">№ пути</th>
        <th class="timeFromTrain"><a>Отправление<i></i></a></th>
        <th class="timeToTrain"><a>Прибытие<i></i></a></th>
        <th class="freePlaceTrain">Свободные места</th>
        <th class="byeTicketTrain"></th>
    </tr>
    </thead>
    <tbody>

    <?foreach($arResult["ITEMS"] as $index =>$arItem):?>
	<?
	$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
	$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
	?>
	<tr class="itemTrain close" data-id="<?=$arItem["ID"];?>" id="<?=$this->GetEditAreaId($arItem['ID']);?>">
        <td><?echo $arItem["NAME"]?></td>
        <td><a class="nameTrain"
                <?if($arItem["CITY_FROM"]["CODE"]){
                    echo 'data-from="'.$arItem["CITY_FROM"]["CODE"].'"';
                }
                if($arItem["CITY_TO"]["CODE"]){
                    echo 'data-to="'.$arItem["CITY_TO"]["CODE"].'"';
                }
                if($arItem["DATE_FROM_SHORT"]){
                    echo 'data-time="'.$arItem["DATE_FROM_SHORT"].'"';
                }?>
            ><?=$arItem["CITY_FROM"]["NAME"]."-".$arItem["CITY_TO"]["NAME"]?></a>
            <?if($arParams["DISPLAY_PREVIEW_TEXT"]!="N" && $arItem["PREVIEW_TEXT"]):?>
                <p><?echo $arItem["PREVIEW_TEXT"];?></p>
            <?endif;?>
        </td>
        <td><?=($arItem["DISPLAY_PROPERTIES"]["WAY_TRAINS"]["VALUE"])? $arItem["DISPLAY_PROPERTIES"]["WAY_TRAINS"]["VALUE"]: '';?></td>
        <td>
            <span>
             <?if($arItem["DATE_FROM"]) echo $arItem["DATE_FROM"];?>
            </span>
        </td>
        <td>
            <span>
                <?if($arItem["DATE_TO"]) echo $arItem["DATE_TO"];?>
            </span>
        </td>
        <td><?=(40 - count($arItem["DISPLAY_PROPERTIES"]["BUY_TICKETS"]["VALUE"])).'мест';?></td>
        <td><a class="btn-blue">Купить билет</a></td>
    </tr>
    <tr id="<?=$this->GetEditAreaId($arItem['ID']);?>-map"  class="trainMap">
        <td colspan="7" class="p0">
            <div class="containerTrain">
                <div class="areaTrain">
                    <div class="mapTrain">
                        <div class="cupeList">
                            <div class="cupe">
                            <?for($cupe = 0; $cupe < 40; $cupe++){?>
                                <?if($cupe != 0
                                    && $cupe%4 == 0):?>
                                    </div><div class="cupe">
                                <?endif;?>
                                <?if (in_array($cupe+1, $arItem["DISPLAY_PROPERTIES"]["BUY_TICKETS"]["VALUE"])) {?>
                                    <i class="desabled"></i>
                                <?} else {?>
                                    <i></i>
                                <?}?>
                            <?}?>
                            </div>
                        </div>
                    </div>
                    <div class="selectPlace">
                        <div>Выберите места в вагоне</div>
                        <div class="numPlace"></div>
                    </div>
                </div>
                <div class="formTicket">
                </div>
            </div>
        </td>
    </tr>
    <?endforeach;?>
    </tbody>
    <tfoot>
    </tfoot>
</table>
