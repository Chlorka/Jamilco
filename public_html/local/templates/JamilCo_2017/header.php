<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();?>
<html class="no-js" lang="ru">
<head>
    <meta charset="<?=SITE_CHARSET?>">
    <!--[if IE]>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <![endif]-->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?$APPLICATION->ShowTitle()?></title>
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">

    <title><?$APPLICATION->ShowTitle()?></title>
    <link rel="stylesheet" href="<?=SITE_TEMPLATE_PATH?>/css/lib/jquery-ui.css">
    <script src="<?=SITE_TEMPLATE_PATH?>/js/jquery-3.2.1.min.js"></script>

    <?$APPLICATION->ShowHead()?>
</head>
<body>
    <?$APPLICATION->ShowPanel();?>
    <div class="container">
        <header>
            <a href="/" class="logo"></a>
            <div id="searchForm">
                <form>
                    <div class="border-grey" id="inputFrom">
                        <label class="from"><span>Пункт отправления:</span><i></i></label>
                        <ul class="selectForm">
                        </ul>
                    </div>
                    <div class="border-grey" id="inputTo">
                        <label class="to"><span>Пункт прибытия:</span><i></i></label>
                        <ul class="selectForm">
                        </ul>
                    </div>
                    <div class="border-grey divInput inputDate">
                        <input class="date" type="text" id="datepicker" value="" size="30">
                        <input type="hidden" id="datepickerAlt" value="">
                    </div>
                    <div class="border-grey inputSubmit">
                        <input type="submit" class="btn-pink" value="Найти">
                    </div>
                    <a class="clearFilter hide">очистить</a>
                </form>
            </div>
        </header>
        <section id="trainList">
