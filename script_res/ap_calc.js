// input field validation
var bounds = {
    "level":[0,100],
    "base":[1,255],
    "evs":[0,252],
    "ivs":[0,31],
    "dvs":[0,15],
    "move-bp":[0,999]
};
isCrit = false;
center_images = ["image_res/toge_normal.png", "image_res/toge_crit.png"]
function checkCrit(crit) {
    if(crit != isCrit) {
        isCrit = crit;
        $("#toge").attr("src", center_images[+isCrit])
    }
}
for (var bounded in bounds) {
    if (bounds.hasOwnProperty(bounded)) {
        attachValidation(bounded, bounds[bounded][0], bounds[bounded][1]);
    }
}
function attachValidation(clazz, min, max) {
    $("." + clazz).keyup(function() {
        validate($(this), min, max);
    });
}
function validate(obj, min, max) {
    obj.val(Math.max(min, Math.min(max, ~~obj.val())));
}

// auto-calc stats and current HP on change
$(".level").keyup(function() {
    var poke = $(this).closest(".poke-info");
    calcHP(poke);
    calcStats(poke);
});

$(".max").bind("keyup change", function() {
    var poke = $(this).closest(".poke-info");
    calcHP(poke);
    calcStats(poke);
});
$(".tera").bind("keyup change", function () {
    var poke = $(this).closest(".poke-info");
    calcHP(poke);
    calcStats(poke);
});
$(".nature").bind("keyup change", function() {
    calcStats($(this).closest(".poke-info"));
});
$(".hp .base, .hp .evs, .hp .ivs").bind("keyup change", function() {
    calcHP($(this).closest(".poke-info"));
});
$(".at .base, .at .evs, .at .ivs").bind("keyup change", function() {
    calcStat($(this).closest(".poke-info"), 'at');
});
$(".df .base, .df .evs, .df .ivs").bind("keyup change", function() {
    calcStat($(this).closest(".poke-info"), 'df');
});
$(".sa .base, .sa .evs, .sa .ivs").bind("keyup change", function() {
    calcStat($(this).closest(".poke-info"), 'sa');
});
$(".sd .base, .sd .evs, .sd .ivs").bind("keyup change", function() {
    calcStat($(this).closest(".poke-info"), 'sd');
});
$(".sp .base, .sp .evs, .sp .ivs").bind("keyup change", function() {
    calcStat($(this).closest(".poke-info"), 'sp');
});
$(".evs").bind("keyup change", function() {
    calcEvTotal($(this).closest(".poke-info"));
});
$(".sl .base").keyup(function() {
    calcStat($(this).closest(".poke-info"), 'sl');
});
$(".at .dvs").keyup(function() {
    var poke = $(this).closest(".poke-info");
    calcStat(poke, 'at');
    poke.find(".hp .dvs").val(getHPDVs(poke));
    calcHP(poke);
});
$(".df .dvs").keyup(function() {
    var poke = $(this).closest(".poke-info");
    calcStat(poke, 'df');
    poke.find(".hp .dvs").val(getHPDVs(poke));
    calcHP(poke);
});
$(".sa .dvs").keyup(function() {
    var poke = $(this).closest(".poke-info");
    calcStat(poke, 'sa');
    poke.find(".sd .dvs").val($(this).val());
    calcStat(poke, 'sd');
    poke.find(".hp .dvs").val(getHPDVs(poke));
    calcHP(poke);
});
$(".sp .dvs").keyup(function() {
    var poke = $(this).closest(".poke-info");
    calcStat(poke, 'sp');
    poke.find(".hp .dvs").val(getHPDVs(poke));
    calcHP(poke);
});
$(".sl .dvs").keyup(function() {
    var poke = $(this).closest(".poke-info");
    calcStat(poke, 'sl');
    poke.find(".hp .dvs").val(getHPDVs(poke));
    calcHP(poke);
});

function getHPDVs(poke) {
    return (~~poke.find(".at .dvs").val() % 2) * 8 +
            (~~poke.find(".df .dvs").val() % 2) * 4 +
            (~~poke.find(gen === 1 ? ".sl .dvs" : ".sa .dvs").val() % 2) * 2 +
            (~~poke.find(".sp .dvs").val() % 2);
}

function calcStats(poke) {
    for (var i = 0; i < STATS.length; i++) {
        calcStat(poke, STATS[i]);
    }
}

function calcEvTotal(poke) {
    var total = 0;
    poke.find('.evs').each(function (idx, elt) { total += 1*$(elt).val(); });

    var newClass = total > 510 ? 'overLimit' : 'underLimit';

    var left = 510-total;

    var newClassLeft = left < 0 ? 'overLimit' : 'underLimit';

    var evTotal = poke.find('.ev-total');
    evTotal.removeClass('underLimit overLimit').text(total).addClass(newClass);

    var evLeft = poke.find('.ev-left');
    evLeft.removeClass('underLimit overLimit').text(left).addClass(newClassLeft);
}

function calcCurrentHP(poke, max, percent) {
    var current = Math.ceil(percent * max / 100);
    poke.find(".current-hp").val(current);
}
function calcPercentHP(poke, max, current) {
    var percent = Math.floor(100 * current / max);
    poke.find(".percent-hp").val(percent);
}
$(".current-hp").keyup(function() {
    var max = $(this).parent().children(".max-hp").text();
    validate($(this), 0, max);
    var current = $(this).val();
    calcPercentHP($(this).parent(), max, current);
});
$(".percent-hp").keyup(function() {
    var max = $(this).parent().children(".max-hp").text();
    validate($(this), 0, 100);
    var percent = $(this).val();
    calcCurrentHP($(this).parent(), max, percent);
});

var lastAura = [false, false, false]
var manualProtoQuark;
$(".ability").bind("keyup change", function () {

    $(this).closest(".poke-info").find(".move-hits").val($(this).val() === 'Skill Link' ? 5
        : $(this).closest(".poke-info").find("select.item").val() === 'Loaded Dice' ? 4
            : 3);

    if ($(this).val() === "Supreme Overlord")
        $(this).closest(".poke-info").find(".ability-supreme").show();
    else
        $(this).closest(".poke-info").find(".ability-supreme").hide();
    $(this).closest(".poke-info").find(".ability-supreme").val(0);

    var ab = $(this).val();
    var ABILITY_TOGGLE_OFF = ['Flash Fire', 'Plus', 'Minus', 'Trace', 'Stakeout', 'Electromorphosis', 'Wind Power', 'Sand Spit', 'Seed Sower'];
    var ABILITY_TOGGLE_ON = gen === 9 ? ['Intimidate', 'Slow Start', 'Protean', 'Libero', 'Intrepid Sword', 'Dauntless Shield'] : ['Intimidate', 'Slow Start'];
    if (ABILITY_TOGGLE_OFF.indexOf(ab) !== -1) {
        $(this).closest(".poke-info").find(".abilityToggle").show();
        $(this).closest(".poke-info").find(".abilityToggle").prop("checked", false);
    }
    else if (ABILITY_TOGGLE_ON.indexOf(ab) !== -1) {
        $(this).closest(".poke-info").find(".abilityToggle").show();
        $(this).closest(".poke-info").find(".abilityToggle").prop("checked", true);
    }
    else {
        $(this).closest(".poke-info").find(".abilityToggle").hide();
    }
    var STAT_BOOST_VARY = ['Protosynthesis', 'Quark Drive'];
    if (STAT_BOOST_VARY.indexOf(ab) !== -1) {
        $(this).closest(".poke-info").find(".ability-advanced").show();
        $(this).closest(".poke-info").find(".ability-advanced").prop("checked", false);
    }
    else
        $(this).closest(".poke-info").find(".ability-advanced").hide();
    $(this).closest(".poke-info").find(".ability-proto-quark").hide();
    manualProtoQuark = false;
});

var lastHighestStat = [0,0];
$(".ability-advanced").bind("keyup change", function () {
    if ($(this).prop("checked")) {
        $(this).closest(".poke-info").find(".ability-proto-quark").show();
        manualProtoQuark = true;
    }
    else {
        $(this).closest(".poke-info").find(".ability-proto-quark").hide();
        manualProtoQuark = false;
    }
    $("#p1 .ability-proto-quark").val(lastHighestStat[0]);
    $("#p2 .ability-proto-quark").val(lastHighestStat[1]);
});

var lastTerrain = "noterrain";
var lastManualWeather = "";
var lastAutoWeather = ["", ""];
var ruins = [['tablets-of-ruin','Tablets of Ruin'],['vessel-of-ruin','Vessel of Ruin'],['sword-of-ruin','Sword of Ruin'],['beads-of-ruin', 'Beads of Ruin']];
var lastRuins = {'tablets-of-ruin':false,'vessel-of-ruin':false,'sword-of-ruin':false,'beads-of-ruin':false};

function autoSetRuin(ability1, ability2) {
    for (i in ruins) {
        lastRuins[ruins[i][0]] = $("input:checkbox[id='"+ruins[i][0]+"']").prop('checked');
        if (ability1 == ruins[i][1] || ability2 == ruins[i][1])
            $("input:checkbox[id='"+ruins[i][0]+"']").prop("checked", true);

    }
}

function resetRuin() {
    for (i in ruins) {
        $("input:checkbox[id='"+ruins[i][0]+"']").prop("checked", lastRuins[ruins[i][0]])
    }
}

function autoSetType(p, item) {
    var ab = $(p + " select.ability").val();
    
    if (ab == "RKS System") {
        if (item.indexOf("Memory") != -1) {
            $(p + " .type1").val(getMemoryType(item));
        }
        else {
            $(p + " .type1").val('Normal');
        }
    }
    else if (ab == "Multitype") {
        if (item.indexOf("Plate") != -1)
            $(p + " .type1").val(getItemBoostType(item));
        else if (item.indexOf("ium Z") != -1)
            $(p + " .type1").val(getZType(item));
        else
            $(p + " .type1").val('Normal');
    }
}

//$("#p1 .tera").bind("keyup change", function () {
//    autosetStatus("#p1", $(this).val());
//    autoSetTeraType("#p1", $(this).val());
//});
//$("#p2 .tera").bind("keyup change", function () {
//    autosetStatus("#p2", $(this).val());
//    autoSetTeraType("#p2", $(this).val());
//});

//function autoSetTeraType(p, tt) {
//    var tera = $(p).find(".tera").prop("checked");
//    var teratype = $(p + " .tera-type").val();
//    var setName = $(p).find("input.set-selector").val();
//    var pokemonName = setName.substring(0, setName.indexOf(" ("));

//    //if the mon is terastalized then change the pokemon's type to the tera type
//    if (tera) {
//        $(p + " .type1").val(teratype);
//        $(p + " .type2").val('');
//    }
//    else {
//        $(p + " .type1").val(pokedex[pokemonName].t1);
//        $(p + " .type2").val(pokedex[pokemonName].t2);
//    }
//}

//var lastManualStatus = {"#p1":"Healthy", "#p2":"Healthy"};
//var lastAutoStatus = {"#p1":"Healthy", "#p2":"Healthy"};
function autosetStatus(p, item) {
    var currentStatus = $(p + " .status").val();
    if (currentStatus !== lastAutoStatus[p]) {
        lastManualStatus[p] = currentStatus;
    }
    if (item === "Flame Orb") {
        lastAutoStatus[p] = "Burned";
        $(p + " .status").val("Burned");
        $(p + " .status").change();
    } else if (item === "Toxic Orb") {
        lastAutoStatus[p] = "Badly Poisoned";
        $(p + " .status").val("Badly Poisoned");
        $(p + " .status").change();
    } else {
        lastAutoStatus[p] = "Healthy";
        if (currentStatus !== lastManualStatus[p]) {
            $(p + " .status").val(lastManualStatus[p]);
            $(p + " .status").change();
        }
    }
}

$(".status").bind("keyup change", function() {
    if ($(this).val() === 'Badly Poisoned') {
        $(this).parent().children(".toxic-counter").show();
    } else {
        $(this).parent().children(".toxic-counter").hide();
    }
});

//sloppy check for Glaive Rush checkbox
function glaiveRushCheck(divValue) {    //divValue should accept any div class, it's just meant to be a quick way to find which Pokemon it's checking
    pInfo = $(divValue).closest(".poke-info");
    pMoves = [pInfo.find(".move1").children("select.move-selector").val(),
        pInfo.find(".move2").children("select.move-selector").val(),
        pInfo.find(".move3").children("select.move-selector").val(),
        pInfo.find(".move4").children("select.move-selector").val()];

    if (pMoves.indexOf("Glaive Rush") != -1)
        pInfo.find(".glaive-rush").show();
    else {
        pInfo.find(".glaive-rush").hide();
        pInfo.find(".glaive-rush").prop("checked", false);
    }
}

// auto-update move details on select
$(".move-selector").change(function() {
    var moveName = $(this).val();
    var move = moves[moveName] || moves['(No Move)'];
    var moveGroupObj = $(this).parent();
    moveGroupObj.children(".move-bp").val(move.bp);
    moveGroupObj.children(".move-type").val(move.type);
    moveGroupObj.children(".move-cat").val(move.category);
    moveGroupObj.children(".move-crit").prop("checked", move.alwaysCrit === true);

    if (move.isMultiHit) {
        moveGroupObj.children(".move-hits").show();
        moveGroupObj.children(".move-hits").val($(this).closest(".poke-info").find("select.ability").val() === 'Skill Link' ? 5
            : $(this).closest(".poke-info").find("select.item").val() === 'Loaded Dice' ? 4
            : 3);
    } else {
        moveGroupObj.children(".move-hits").hide();
    }

    if (move.isTenMultiHit) {
        moveGroupObj.children(".move-10hits").show();
        moveGroupObj.children(".move-10hits").val(10);
    } else {
        moveGroupObj.children(".move-10hits").hide();
    }

    if (move.canDouble) moveGroupObj.children(".move-double").show();
    else moveGroupObj.children(".move-double").hide();

    if (moveName == "Dragon Darts") moveGroupObj.children(".move-hits2").show();
    else moveGroupObj.children(".move-hits2").hide();

    if (["Last Respects", "Rage Fist"].indexOf(moveName) != -1) moveGroupObj.children(".move-lastRespRageFist").show();
    else moveGroupObj.children(".move-lastRespRageFist").hide();

    if (move.isTripleHit) {
        moveGroupObj.children(".move-hits3").show();
        moveGroupObj.children(".move-hits3").val(3);
    }
    else moveGroupObj.children(".move-hits3").hide();

    if (moveName.includes(" Pledge")) {
        moveGroupObj.children(".move-pledge").show();
        moveGroupObj.children(".move-pledge").val(moveName);
    }
    else moveGroupObj.children(".move-pledge").hide();

    moveGroupObj.children(".move-z").prop("checked", false);

    //SLOPPY WAY OF HANDLING
    glaiveRushCheck(moveGroupObj);
});

// auto-update set details on select
$(".set-selector").change(function() {
    var fullSetName = $(this).val();
    var pokemonName, setName;
    var DOU = !$('#douswitch').is(":checked");
    pokemonName = fullSetName.substring(0, fullSetName.indexOf(" ("));
    setName = fullSetName.substring(fullSetName.indexOf("(") + 1, fullSetName.lastIndexOf(")"));
    var pokemon = pokedex[pokemonName];
    if (pokemon) {
        var pokeObj = $(this).closest(".poke-info");

        pokeObj.find(".type1").val(pokemon.t1);
        pokeObj.find(".type2").val(pokemon.t2);
        pokeObj.find(".hp .base").val(pokemon.bs.hp);
        var i;
        for (i = 0; i < STATS.length; i++) {
            pokeObj.find("." + STATS[i] + " .base").val(pokemon.bs[STATS[i]]);
        }
        pokeObj.find(".weight").val(pokemon.w);
        pokeObj.find(".boost").val(0);
        pokeObj.find(".percent-hp").val(100);
        pokeObj.find(".status").val("Healthy");
        $(".status").change();
        var moveObj;
        var abilityObj = pokeObj.find("select.ability");
        var itemObj = pokeObj.find("select.item");
        if (pokemonName in setdex && setName in setdex[pokemonName]) {
            var set = setdex[pokemonName][setName];
            if (setdexCustom !== [] && pokemonName in setdexCustom && setName in setdexCustom[pokemonName])
                $(this).closest(".poke-info").find(".setCalc").val(setName);
            if(DOU) pokeObj.find(".level").val(100);
            else pokeObj.find(".level").val(set.level);
            pokeObj.find(".hp .evs").val((set.evs && typeof set.evs.hp !== "undefined") ? set.evs.hp : 0);
            pokeObj.find(".hp .ivs").val((set.ivs && typeof set.ivs.hp !== "undefined") ? set.ivs.hp : 31);
            pokeObj.find(".hp .dvs").val((set.dvs && typeof set.dvs.hp !== "undefined") ? set.dvs.hp : 15);
            for (i = 0; i < STATS.length; i++) {
                pokeObj.find("." + STATS[i] + " .evs").val((set.evs && typeof set.evs[STATS[i]] !== "undefined") ? set.evs[STATS[i]] : 0);
                pokeObj.find("." + STATS[i] + " .ivs").val((set.ivs && typeof set.ivs[STATS[i]] !== "undefined") ? set.ivs[STATS[i]] : 31);
                pokeObj.find("." + STATS[i] + " .dvs").val((set.dvs && typeof set.dvs[STATS[i]] !== "undefined") ? set.dvs[STATS[i]] : 15);
            }
            setSelectValueIfValid(pokeObj.find(".nature"), set.nature, "Serious");
            setSelectValueIfValid(abilityObj, set.ability, pokemon.ab ? pokemon.ab : "");   //necessary check; custom sets with abilities different to defaults will have the default ability instead, and custom sets with non-existent abilities won't default to (other)
            setSelectValueIfValid(itemObj, set.item, "");
            for (i = 0; i < 4; i++) {
                moveObj = pokeObj.find(".move" + (i+1) + " select.move-selector");
                setSelectValueIfValid(moveObj, set.moves[i], "(No Move)");
                moveObj.change();
            }
            if (set.tera_type)
                pokeObj.find(".tera-type").val(set.tera_type);
            else
                pokeObj.find(".tera-type").val(pokemon.t1);
        } else {
            if(DOU) pokeObj.find(".level").val(100);
            else pokeObj.find(".level").val(50);
            pokeObj.find(".hp .evs").val(0);
            pokeObj.find(".hp .ivs").val(31);
            pokeObj.find(".hp .dvs").val(15);
            for (i = 0; i < STATS.length; i++) {
                pokeObj.find("." + STATS[i] + " .evs").val(0);
                pokeObj.find("." + STATS[i] + " .ivs").val(31);
                pokeObj.find("." + STATS[i] + " .dvs").val(15);
            }
            pokeObj.find(".nature").val("Serious");
            setSelectValueIfValid(abilityObj, pokemon.ab, "");  //necessary check; blank abilities won't update to their defaults otherwise
            itemObj.val("");
            for (i = 0; i < 4; i++) {
                moveObj = pokeObj.find(".move" + (i+1) + " select.move-selector");
                moveObj.val("(No Move)");
                moveObj.change();
            }
            pokeObj.find(".tera-type").val(pokemon.t1);
        }
        var formeObj = $(this).siblings().find(".forme").parent();
        itemObj.prop("disabled", false);
        if (pokemon.formes) {
            showFormes(formeObj, setName, pokemonName, pokemon);
        } else {
            formeObj.hide();
        }
        pokeObj.find(".max").prop("checked", false);
        pokeObj.find(".tera").prop("checked", false);
        calcHP(pokeObj);
        calcStats(pokeObj);
        calcEvTotal(pokeObj);
        abilityObj.change();
        itemObj.change();
        if (pokeObj[0].id === "p2") {
            if (setName !== "Blank Set" ) document.getElementById("setName").value = setName;
            else document.getElementById("setName").value = "";
        }
    }
});

//Changes Item to Coordinate with forme
$('.forme').change(function(){
    //Check for form-item coordination
    var pokeInfo = $(this).closest('.poke-info');
    var setName = pokeInfo.find("input.set-selector").val();
    var pokemonName;
    var lockItemCheck = LOCK_ITEM_LOOKUP[$(this).val()];
    if (lockItemCheck === "Griseous Orb" && gen >= 9)       //look how they massacred my boy
        //    lockItemCheck = "Griseous Core";              //they should've buffed origin giratina not nerf it
        lockItemCheck = LOCK_ITEM_LOOKUP[''];               //cmon game freak make it a key item before the home update
    if (lockItemCheck !== undefined) {
        pokeInfo.find(".item").val(lockItemCheck);
    }
});

function showFormes(formeObj, setName, pokemonName, pokemon) {
    var defaultForme = 0;
    var gmaxDefaults = ['Venusaur', 'Charizard', 'Blastoise', 'Butterfree', 'Pikachu', 'Meowth', 'Gengar', 'Kingler', 'Lapras', 'Eevee', 'Snorlax', 'Garbodor',
        'Rillaboom', 'Cinderace', 'Inteleon', 'Orbeetle', 'Coalossal', 'Flapple', 'Sandaconda', 'Toxtricity', 'Centiskorch', 'Hatterene', 'Grimmsnarl',
        'Alcremie', 'Copperajah', 'Urshifu-Single Strike', 'Urshifu-Rapid Strike'];

    if (setName !== 'Blank Set') {
        var set = setdex[pokemonName][setName];

        // Repurpose the previous filtering code to provide the "different default" logic
        if (set.item) {
            if ((set.item.indexOf('ite') !== -1 && set.item.indexOf('ite Y') === -1) ||
                (pokemonName === "Groudon" && set.item.indexOf("Red Orb") !== -1) ||
                (pokemonName === "Kyogre" && set.item.indexOf("Blue Orb") !== -1) ||
                (pokemonName === "Meloetta" && set.moves.indexOf("Relic Song") !== -1) ||
                (pokemonName === "Rayquaza" && set.moves.indexOf("Dragon Ascent") !== -1)) {
                defaultForme = 1;
            } else if (set.item.indexOf('ite Y') !== -1) {
                defaultForme = 2;
            }
        }
    }

    if (pokemonName === "Palafin")
        defaultForme = 1;
    else if (gen == 8 && !defaultForme && gmaxDefaults.indexOf(pokemonName) != -1)
        defaultForme = pokedex[pokemonName].formes.indexOf(pokemonName + "-Gmax");

    var formeOptions = getSelectOptions(pokemon.formes, false, defaultForme);
    formeObj.children("select").find("option").remove().end().append(formeOptions).change();
    formeObj.show();
}

function setSelectValueIfValid(select, value, fallback) {
    select.val(select.children('option[value="' + value + '"]').length !== 0 ? value : fallback);
}

$(".forme").change(function() {
    var altForme = pokedex[$(this).val()],
        container = $(this).closest(".info-group").siblings(),
        fullSetName = container.find(".select2-chosen").first().text(),
        pokemonName = fullSetName.substring(0, fullSetName.indexOf(" (")),
        setName = fullSetName.substring(fullSetName.indexOf("(") + 1, fullSetName.lastIndexOf(")"));

    $(this).parent().siblings().find(".type1").val(altForme.t1);
    $(this).parent().siblings().find(".type2").val(typeof altForme.t2 != "undefined" ? altForme.t2 : "");
    $(this).parent().siblings().find(".weight").val(altForme.w);
    //$(this).parent().siblings().find(".canEvolve").val(altForme.canEvolve);
    var STATS_WITH_HP = ["hp", "at", "df","sa","sd","sp"];
    for (var i = 0; i <STATS_WITH_HP.length; i++) {
        var baseStat = container.find("." + STATS_WITH_HP[i]).find(".base");
        baseStat.val(altForme.bs[STATS_WITH_HP[i]]);
        baseStat.keyup();
    }

    if (abilities.indexOf(altForme.ab) > -1) {
        container.find(".ability").val(altForme.ab);
    } else if (setName !== "Blank Set" && abilities.indexOf(setdex[pokemonName][setName].ability) > -1) {
        container.find(".ability").val(setdex[pokemonName][setName].ability);
    } else {
        container.find(".ability").val("");
    }
    container.find(".ability").keyup();
    container.find(".ability").trigger("change.select2");

    if (pokemonName === "Darmanitan") {
        container.find(".percent-hp").val($(this).val() === "Darmanitan-Zen" ? "50" : "100").keyup();
    }
});

/*
function getTerrainEffects() {
    var className = $(this).prop("className");
    className = className.substring(0, className.indexOf(" "));
    switch (className) {
        case "type1":
        case "type2":
        case "ability":
        case "item":
            var id = $(this).closest(".poke-info").prop("id");
            var terrainValue = $("input:checkbox[name='terrain']:checked").val();
            if (terrainValue === "Electric") {
                $("#" + id).find("[value='Asleep']").prop("disabled", isGrounded($("#" + id)));
            } else if (terrainValue === "Misty") {
                $("#" + id).find(".status").prop("disabled", isGrounded($("#" + id)));
            }
            break;
        default:
            $("input:checkbox[name='terrain']").not(this).prop("checked", false);
            if ($(this).prop("checked") && $(this).val() === "Electric") {
                $("#p1").find("[value='Asleep']").prop("disabled", isGrounded($("#p1")));
                $("#p2").find("[value='Asleep']").prop("disabled", isGrounded($("#p2")));
            } else if ($(this).prop("checked") && $(this).val() === "Misty") {
                $("#p1").find(".status").prop("disabled", isGrounded($("#p1")));
                $("#p2").find(".status").prop("disabled", isGrounded($("#p2")));
            } else {
                $("#p1").find("[value='Asleep']").prop("disabled", false);
                $("#p1").find(".status").prop("disabled", false);
                $("#p2").find("[value='Asleep']").prop("disabled", false);
                $("#p2").find(".status").prop("disabled", false);
            }
            break;
    }
}
*/

function isGrounded(pokeInfo) {
    return $("#gravity").prop("checked") || (pokeInfo.find(".type1").val() !== "Flying" && pokeInfo.find(".type2").val() !== "Flying" &&
            pokeInfo.find("select.ability").val() !== "Levitate" && pokeInfo.find("select.item").val() !== "Air Balloon");
}

var resultLocations = [[],[]];
for (var i = 0; i < 4; i++) {
    resultLocations[0].push({
        "move":"#resultMoveL" + (i+1),
        "damage":"#resultDamageL" + (i+1)
    });
    resultLocations[1].push({
        "move":"#resultMoveR" + (i+1),
        "damage":"#resultDamageR" + (i+1)
    });
}

$("#atkdefswitch").change(function() {
    var table = $("#damage-table").DataTable();
    table.draw();
});

function addtotable() {
    var poke = new Pokemon($("#p2"));
    var name;
    var nature = NATURES[poke.nature]
    var gen = document.querySelectorAll('input[name=gen]:checked')[0].value;
    var stats = poke.rawStats;
    
    if (gen > 2){
        var ev_spread = poke.HPEVs;
        stats = poke.evs;
        for(var stat in stats){
            if(nature[0] === stat) ev_spread += '/<font color="red">' + stats[stat] + '+</font>';
            else if (nature[1] === stat) ev_spread += '/<font color="#2b8afd">' + stats[stat] + '-</font>';
            else ev_spread += '/'+stats[stat];
        }
        if (document.getElementById("setName").value !== "") name =  '<p style="text-align: center;white-space: pre;">'+poke.name+"<br>"+document.getElementById("setName").value+"<br>"+ev_spread+"</p>";
        else name = '<p style="text-align: center;white-space: pre;">'+poke.name+"<br>"+ev_spread+"</p>";
    }
    
    var table = $("#damage-table").DataTable();
   
    if (table.rows( function ( idx, aData, node ) {return aData[0] === name;})[0].length == 0){
        for(var i = 0; i < 4; i++) {
            var row = table.row.add([name, "", "",""]).node();
            $(row).attr("data-move", i);
            $(row).attr("data-mode", "atk");
            $(row).attr("data-pokemon", JSON.stringify(poke));
        }
    }
    for(var move in poke.moves) {
        if(poke.moves[move].category !== "Status" && poke.moves[move].name !== "(No Move)"){
            var moveName = poke.moves[move].name;
            if (moveName === "Rage Fist" || moveName === "Last Respects") {
                moveName = moveName + " (" + poke.moves[move].bp*poke.moves[move].timesAffected + " BP)"
            } else if (moveName === "Assurance" && poke.moves[move].isDouble) {
                moveName = moveName + " (" + poke.moves[move].bp*(1+poke.moves[move].isDouble) + " BP)"
            } else if (poke.moves[move].hits > 1) {
                moveName = moveName + " (" + poke.moves[move].hits + " hits)";
            }
            if (table.rows( function ( idx, aData, node ) {return aData[0] === name && aData[1] === moveName;})[0].length == 0){
                var row = table.row.add([name, moveName, "",""]).node();
                $(row).attr("data-move", move);
                $(row).attr("data-mode", "def");
                $(row).attr("data-pokemon", JSON.stringify(poke));
            }
        }
    }

    calculate(); 
    table.draw();
}

$.fn.dataTable.ext.search.push(function(settings, data, dataIndex, rowData, counter) {
        var trNode = settings.aoData[dataIndex].nTr;
        var null_damage = trNode.cells[2].innerHTML === '0 - 0%';
        return ($('#atkdefswitch').is(":checked") === (trNode.getAttribute('data-mode') === 'atk')) && !null_damage;
});

function cleartable() {
    var table = $("#damage-table").DataTable();
    table.clear();
    table.draw();
}

function calculate() {
    var field = new Field();
    var p1 = new Pokemon($("#p1"));
    var p2 = new Pokemon($("#p2"));
    calculateAllMoves(p1, p2, field); 
    var table = $("#damage-table").DataTable();
    var cache = {};
    var damageResults, result, hits, minDamage, maxDamage, minPercent, maxPercent, damageText, koChanceText;
    table.rows().every(function (rowIdx, tableLoop, rowLoop) {
        p1 = new Pokemon($("#p1"));
        var row = this.node();
        var pstr = $(row).attr('data-pokemon');
        p2 = JSON.parse(pstr);
        
        autoSetRuin(p1.ability,p2.ability); 
        var field = new Field();
        
        if(pstr in cache) damageResults = cache[pstr];
        else {
            damageResults = calculateAllMoves(p1, p2, field); 
            cache[pstr] = damageResults;
        }


        var patk,pdef,side;
        var m_num = Number($(row).attr("data-move"))
        if($(row).attr("data-mode") === "atk") {
            result = damageResults[0][m_num];
            patk = p1;
            pdef = p2;
            side = 1;
       }
        else { 
            result = damageResults[1][m_num];
            patk = p2;
            pdef = p1;
            side = 2
        }
        patk.moves[m_num].painMax = (patk.moves[m_num].name === "Pain Split" && patk.isDynamax);
        hits = patk.moves[m_num].hits;
        minDamage = result.damage[0] * hits;
        maxDamage = result.damage[result.damage.length-1] * hits;
        minPercent = Math.floor(minDamage * 1000 / pdef.maxHP) / 10;
        maxPercent = Math.floor(maxDamage * 1000 / pdef.maxHP) / 10;
        damageText =  minPercent + " - " + maxPercent + "%";
        if (minPercent >= 50) damageText = "<strong>"+damageText+"</strong>";
        if (maxPercent >= 100) damageText = '<font color="#d51013">'+damageText+"</font>";
        koChanceText = patk.moves[m_num].bp === 0 && patk.moves[m_num].category !== "Status"? '<a href="https://www.youtube.com/watch?v=NFZjEgXIl1E&t=21s">how</a>'
                  : getKOChanceText(result.damage, patk.moves[m_num], pdef, field.getSide(side), patk.ability === 'Bad Dreams');
        var d = this.data();
        if($(row).attr("data-mode") === "atk")
            d[1] = patk.moves[m_num].name;
        d[2] = damageText;
        d[3] = koChanceText;
        this.data(d);
        resetRuin();
    });
    table.draw(); 
}

$(".result-move").change(function() {
    if (damageResults) {
        var result = findDamageResult($(this));
        if (result) {
            $("#mainResult").html(result.description + ": " + result.damageText + " -- " + result.koChanceText);
            if (result.parentDamage) {
                if (result.child2Damage && result.child2Damage !== -1) {
                    $("#damageValues").text("(First hit: " + result.parentDamage.join(", ") +
                        "; Second hit: " + result.childDamage.join(", ") +
                        "; Third hit: " + result.child2Damage.join(", ") + ")");
                }
                else {
                    $("#damageValues").text("(First hit: " + result.parentDamage.join(", ") +
                        "; Second hit: " + result.childDamage.join(", ") + ")");
                }
            }
            else {
                $("#damageValues").text("(" + result.damage.join(", ") + ")");
            }
            checkCrit(result.crit)
        }
    }
});

// Need to close over "lastClicked", so we'll do it the old-fashioned way to avoid
// needlessly polluting the global namespace.
var stickyMoves = (function () {
    var lastClicked = 'resultMoveL1';
    $(".result-move").click(function () {
        if (this.id === lastClicked) {
            $(this).toggleClass("locked-move");
        } else {
            $('.locked-move').removeClass('locked-move');
        }
        lastClicked = this.id;
    });

    return {
        clearStickyMove: function () {
            lastClicked = null;
            $('.locked-move').removeClass('locked-move');
        },
        setSelectedMove: function (slot) {
            lastClicked = slot;
        },
        getSelectedSide: function () {
            if (lastClicked) {
                if (lastClicked.indexOf('resultMoveL') !== -1) {
                    return 'p1';
                } else if (lastClicked.indexOf('resultMoveR') !== -1) {
                    return 'p2';
                }
            }
            return null;
        }
    };
})();

function findDamageResult(resultMoveObj) {
    var selector = "#" + resultMoveObj.attr("id");
    for (var i = 0; i < resultLocations.length; i++) {
        for (var j = 0; j < resultLocations[i].length; j++) {
            if (resultLocations[i][j].move === selector) {
                return damageResults[i][j];
            }
        }
    }
}

function Pokemon(pokeInfo) {
    var setName = pokeInfo.find("input.set-selector").val();
    if (setName.indexOf("(") === -1) {
        this.name = setName;
    } else {
        var pokemonName = setName.substring(0, setName.indexOf(" ("));
        this.name = (pokedex[pokemonName].formes) ? pokeInfo.find(".forme").val() : pokemonName;
    } 

    //Check for ability to Dynamax
    if (["Zacian", "Zacian-Crowned", "Zamazenta", "Zamazenta-Crowned", "Eternatus"].indexOf(this.name) !== -1) {
        pokeInfo.find(".max").prop("checked", false);
        pokeInfo.find(".max").prop("disabled", true);
    }
    else {
        pokeInfo.find(".max").prop("disabled", false);
    }

    this.type1 = pokeInfo.find(".type1").val();
    this.type2 = pokeInfo.find(".type2").val();
    this.tera_type = pokeInfo.find(".tera-type").val();
    this.level = ~~pokeInfo.find(".level").val();
    this.maxHP = ~~pokeInfo.find(".hp .total").text();
    this.curHP = ~~pokeInfo.find(".current-hp").val();
    this.HPEVs = ~~pokeInfo.find(".hp .evs").val();
    this.isDynamax = pokeInfo.find(".max").prop("checked");
    this.isTerastalize = pokeInfo.find(".tera").prop("checked");
    this.rawStats = {};
    this.boosts = {};
    this.stats = {};
    this.evs = {};
    for (var i = 0; i < STATS.length; i++) {
        this.rawStats[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .total").text();
        this.boosts[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .boost").val();
        this.evs[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .evs").val();
    }
    this.nature = pokeInfo.find(".nature").val();
    this.ability = pokeInfo.find("select.ability").val();
    this.abilityOn = pokeInfo.find(".abilityToggle").prop("checked");
    this.supremeOverlord = ~~pokeInfo.find(".ability-supreme").val();
    this.highestStat = pokeInfo.find(".ability-advanced").prop("checked") ? ~~pokeInfo.find(".ability-proto-quark").val() : -1;
    this.item = pokeInfo.find("select.item").val();
    this.status = pokeInfo.find(".status").val();
    this.toxicCounter = this.status === 'Badly Poisoned' ? ~~pokeInfo.find(".toxic-counter").val() : 0;
    this.moves = [
        getMoveDetails(pokeInfo.find(".move1"), this.isDynamax),
        getMoveDetails(pokeInfo.find(".move2"), this.isDynamax),
        getMoveDetails(pokeInfo.find(".move3"), this.isDynamax),
        getMoveDetails(pokeInfo.find(".move4"), this.isDynamax)
    ];
    this.glaiveRushMod = pokeInfo.find(".glaive-rush").prop("checked");
    this.weight = +pokeInfo.find(".weight").val();
    this.canEvolve = pokedex[pokemonName].canEvolve;

}

function getMoveDetails(moveInfo, maxMon) {
    var moveName = moveInfo.find("select.move-selector").val();
    var defaultDetails = moves[moveName];
    return $.extend({}, defaultDetails, {
        name: moveName,
        bp: ~~moveInfo.find(".move-bp").val(),
        type: moveInfo.find(".move-type").val(),
        category: moveInfo.find(".move-cat").val(),
        isCrit: moveInfo.find(".move-crit").prop("checked"),
        isZ: moveInfo.find(".move-z").prop("checked"),
        hits: (defaultDetails.isMultiHit && !moveInfo.find(".move-z").prop("checked") && !maxMon) ? ~~moveInfo.find(".move-hits").val()
            : (defaultDetails.isTenMultiHit && !moveInfo.find(".move-z").prop("checked") && !maxMon) ? ~~moveInfo.find(".move-10hits").val()
                : (moveName == "Dragon Darts" && !moveInfo.find(".move-z").prop("checked") && !maxMon) ? ~~moveInfo.find(".move-hits2").val()
                    : (defaultDetails.isTwoHit && !moveInfo.find(".move-z").prop("checked") && !maxMon) ? 2
                        : (defaultDetails.isThreeHit && !moveInfo.find(".move-z").prop("checked") && !maxMon) ? 3
                            : (moveName == "Beat Up" && !moveInfo.find(".move-z").prop("checked") && !maxMon) ? 4
                            : 1,
        isDouble: (defaultDetails.canDouble && !moveInfo.find(".move-z").prop("checked") && !maxMon) ? ~~moveInfo.find(".move-double").val() : 0,
        tripleHits: (defaultDetails.isTripleHit && !moveInfo.find(".move-z").prop("checked") && !maxMon) ? ~~moveInfo.find(".move-hits3").val() : 0,
        combinePledge: (moveName.includes(" Pledge") && !moveInfo.find(".move-z").prop("checked") && !maxMon) ? moveInfo.find(".move-pledge").val() : 0,
        timesAffected: (["Last Respects", "Rage Fist"].indexOf(moveName) != -1 && !moveInfo.find(".move-z").prop("checked") && !maxMon) ? ~~moveInfo.find(".move-lastRespRageFist").val() : 0,
    });
}

function Field() {
    var format = $("input:radio[name='format']:checked").val();
    var isGravity = $("#gravity").prop("checked");
    var isSR = [$("#srL").prop("checked"), $("#srR").prop("checked")];
    var isProtect = [$("#protectL").prop("checked"), $("#protectR").prop("checked")];
    var weather;
    var spikes;
    if (gen === 2) {
        spikes = [$("#gscSpikesL").prop("checked") ? 1 : 0, $("#gscSpikesR").prop("checked") ? 1 : 0];
        weather = $("input:radio[name='gscWeather']:checked").val();
    } 
    else {
        weather = $("input:radio[name='weather']:checked").val();
        spikes = [~~$("input:radio[name='spikesL']:checked").val(), ~~$("input:radio[name='spikesR']:checked").val()];
    }
    var terrain = ($("input:radio[name='terrain']:checked").val()) ? $("input:radio[name='terrain']:checked").val() : "";
    var isReflect = [$("#reflectL").prop("checked"), $("#reflectR").prop("checked")];
    var isLightScreen = [$("#lightScreenL").prop("checked"), $("#lightScreenR").prop("checked")];
    var isForesight = [$("#foresightL").prop("checked"), $("#foresightR").prop("checked")];
    var isHelpingHand = [$("#helpingHandR").prop("checked"), $("#helpingHandL").prop("checked")]; // affects attacks against opposite side
    var isGMaxField = [$("#gMaxFieldL").prop("checked"), $("#gMaxFieldR").prop("checked")];
    var isNeutralizingGas = $("#neutralizingGas").prop("checked");
    var isFriendGuard = (!isNeutralizingGas) ? [$("#friendGuardL").prop("checked"), $("#friendGuardR").prop("checked")] : false;
    var isBattery = (!isNeutralizingGas) ? [$("#batteryR").prop("checked"), $("#batteryL").prop("checked")] : false;
    var isPowerSpot = (!isNeutralizingGas) ? [$("#powerSpotR").prop("checked"), $("#powerSpotL").prop("checked")] : false; // affects attacks against opposite side
    var isSteelySpirit = (!isNeutralizingGas) ? [$("#steelySpiritR").prop("checked"), $("#steelySpiritL").prop("checked")] : false; // affects attacks against opposite side
    var isFlowerGiftSpD = (!isNeutralizingGas) ? [$("#flowerGiftL").prop("checked"), $("#flowerGiftR").prop("checked")] : false;
    var isFlowerGiftAtk = (!isNeutralizingGas) ? [$("#flowerGiftR").prop("checked"), $("#flowerGiftL").prop("checked")] : false;
    var isTailwind = [$("#tailwindL").prop("checked"), $("#tailwindR").prop("checked")];
    var isSaltCure = [$("#saltCureL").prop("checked"), $("#saltCureR").prop("checked")];
    var isAuroraVeil = [$("#auroraVeilL").prop("checked"), $("#auroraVeilR").prop("checked")];

    this.getNeutralGas = function () {
        return isNeutralizingGas;
    }
    this.getTailwind = function (i) {
        return isTailwind[i];
    }
    this.getWeather = function() {
        return weather;
    };
    this.getTerrain = function() {
        return terrain;
    };
    this.clearWeather = function() {
        weather = "";
    };
    this.getSide = function (i) {
        return new Side(format, terrain, weather, isGravity, isSR[i], spikes[i], isReflect[i], isLightScreen[i], isForesight[i], isHelpingHand[i], isFriendGuard[i], isBattery[i], isProtect[i], isPowerSpot[i], isSteelySpirit[i], isNeutralizingGas, isGMaxField[i], isFlowerGiftSpD[i], isFlowerGiftAtk[i], isTailwind[i], isSaltCure[i], isAuroraVeil[i]);
    };
}

function Side(format, terrain, weather, isGravity, isSR, spikes, isReflect, isLightScreen, isForesight, isHelpingHand, isFriendGuard, isBattery, isProtect, isPowerSpot, isSteelySpirit, isNeutralizingGas, isGmaxField, isFlowerGiftSpD, isFlowerGiftAtk, isTailwind, isSaltCure, isAuroraVeil) {
    this.format = format;
    this.terrain = terrain;
    this.weather = weather;
    this.isGravity = isGravity;
    this.isSR = isSR;
    this.spikes = spikes;
    this.isReflect = isReflect;
    this.isLightScreen = isLightScreen;
    this.isForesight = isForesight;
    this.isHelpingHand = isHelpingHand;
    this.isFriendGuard = isFriendGuard;
    this.isBattery = isBattery;
    this.isProtect = isProtect;
    this.isPowerSpot = isPowerSpot;
    this.isSteelySpirit = isSteelySpirit;
    this.isNeutralizingGas = isNeutralizingGas;
    this.isGMaxField = isGmaxField;
    this.isFlowerGiftSpD = isFlowerGiftSpD;
    this.isFlowerGiftAtk = isFlowerGiftAtk;
    this.isTailwind = isTailwind;
    this.isSaltCure = isSaltCure;
    this.isAuroraVeil = isAuroraVeil;
}

var gen, pokedex, setdex, setdexCustom, typeChart, moves, abilities, items, STATS, calculateAllMoves, calcHP, calcStat;

$(".gen").change(function () {
    gen = ~~$(this).val();

    loadSVColors(document.getElementById('switchTheme').value);     //
    var table = $("#damage-table").DataTable();
    table.clear();
    table.draw();

    switch (gen) {
        case 1: //Gen 1
            pokedex = POKEDEX_RBY;
            setdex = SETDEX_RBY;
            setdexCustom = [];
            typeChart = TYPE_CHART_RBY;
            moves = MOVES_RBY;
            items = [];
            abilities = [];
            STATS = STATS_RBY;
            calculateAllMoves = CALCULATE_ALL_MOVES_RBY;
            calcHP = CALC_HP_RBY;
            calcStat = CALC_STAT_RBY;
            break;
        case 2: //Gen 2
            pokedex = POKEDEX_GSC;
            setdex = SETDEX_GSC;
            setdexCustom = [];
            typeChart = TYPE_CHART_GSC;
            moves = MOVES_GSC;
            items = ITEMS_GSC;
            abilities = [];
            STATS = STATS_GSC;
            calculateAllMoves = CALCULATE_ALL_MOVES_GSC;
            calcHP = CALC_HP_RBY;
            calcStat = CALC_STAT_RBY;
            break;
        case 3: //Gen 3
            pokedex = POKEDEX_ADV;
            setdex = SETDEX_ADV;
            setdexCustom = [];
            typeChart = TYPE_CHART_GSC;
            moves = MOVES_ADV;
            items = ITEMS_ADV;
            abilities = ABILITIES_ADV;
            STATS = STATS_GSC;
            calculateAllMoves = CALCULATE_ALL_MOVES_ADV;
            calcHP = CALC_HP_ADV;
            calcStat = CALC_STAT_ADV;
            break;
        case 4: //Gen 4
            pokedex = POKEDEX_DPP;
            setdex = SETDEX_DPP;
            setdexCustom = [];
            typeChart = TYPE_CHART_GSC;
            moves = MOVES_DPP;
            items = ITEMS_DPP;
            abilities = ABILITIES_DPP;
            STATS = STATS_GSC;
            calculateAllMoves = CALCULATE_ALL_MOVES_DPP;
            calcHP = CALC_HP_ADV;
            calcStat = CALC_STAT_ADV;
            break;
        case 5: //Gen 5
            pokedex = POKEDEX_BW;
            setdex = SETDEX_BW;
            setdexCustom = SETDEX_CUSTOM_BW;
            typeChart = TYPE_CHART_GSC;
            moves = MOVES_BW;
            items = ITEMS_BW;
            abilities = ABILITIES_BW;
            STATS = STATS_GSC;
            calculateAllMoves = CALCULATE_ALL_MOVES_BW;
            calcHP = CALC_HP_ADV;
            calcStat = CALC_STAT_ADV;
            break;
        case 6: //Gen 6
            pokedex = POKEDEX_XY;
            setdex = SETDEX_XY;
            setdexCustom = SETDEX_CUSTOM_XY;
            typeChart = TYPE_CHART_XY;
            moves = MOVES_XY;
            items = ITEMS_XY;
            abilities = ABILITIES_XY;
            STATS = STATS_GSC;
            calculateAllMoves = CALCULATE_ALL_MOVES_XY;
            calcHP = CALC_HP_ADV;
            calcStat = CALC_STAT_ADV;
            break;
        case 7: //Gen 7
            pokedex = POKEDEX_SM;
            setdex = SETDEX_SM;
            setdexCustom = SETDEX_CUSTOM_SM;
            typeChart = TYPE_CHART_XY;
            moves = MOVES_SM;
            items = ITEMS_SM;
            abilities = ABILITIES_SM;
            STATS = STATS_GSC;
            calculateAllMoves = CALCULATE_ALL_MOVES_SV;
            calcHP = CALC_HP_ADV;
            calcStat = CALC_STAT_ADV;
            break;
        case 8: //Gen 8 SwSh+BDSP
            pokedex = (localStorage.getItem("dex") == "natdex") ? POKEDEX_SS_NATDEX : POKEDEX_SS;
            setdex = SETDEX_SS;
            setdexCustom = SETDEX_CUSTOM_SS;
            typeChart = TYPE_CHART_XY;
            moves = (localStorage.getItem("dex") == "natdex") ? MOVES_SS_NATDEX : MOVES_SS;
            items = (localStorage.getItem("dex") == "natdex") ? ITEMS_SS_NATDEX : ITEMS_SS;
            abilities = ABILITIES_SS;
            STATS = STATS_GSC;
            calculateAllMoves = CALCULATE_ALL_MOVES_SV;
            calcHP = CALC_HP_ADV;
            calcStat = CALC_STAT_ADV;
            break;
        case 9: //Gen 9 SV
            pokedex = (localStorage.getItem("dex") == "natdex") ? POKEDEX_SV_NATDEX :  POKEDEX_SV;
            setdex = SETDEX_SV;
            setdexCustom = SETDEX_CUSTOM_SV;
            typeChart = TYPE_CHART_XY;
            moves = (localStorage.getItem("dex") == "natdex") ? MOVES_SV_NATDEX : MOVES_SV;
            items = (localStorage.getItem("dex") == "natdex") ? ITEMS_SV_NATDEX : ITEMS_SV;
            abilities = ABILITIES_SV;
            STATS = STATS_GSC;
            calculateAllMoves = CALCULATE_ALL_MOVES_SV;
            calcHP = CALC_HP_ADV;
            calcStat = CALC_STAT_ADV;
            break;
    }
    clearField();
    $(".gen-specific.g" + gen).show();
    $(".gen-specific").not(".g" + gen).hide();
    if (gen >= 8) {
        if (localStorage.getItem("dex") == "natdex") {
            for (i = 1; i <= 4; i++) {
                $('label[for="zL' + i + '"]').show();
                $('label[for="zR' + i + '"]').show();
            }
        }
        else {
            for (i = 1; i <= 4; i++) {
                $('label[for="zL' + i + '"]').hide();
                $('label[for="zR' + i + '"]').hide();
            }
        }
    }
    var typeOptions = getSelectOptions(Object.keys(typeChart));
    $("select.type1, select.move-type, select.tera-type").find("option").remove().end().append(typeOptions);
    $("select.type2").find("option").remove().end().append("<option value=\"\">(none)</option>" + typeOptions);
    var moveOptions = getSelectOptions(Object.keys(moves), true);
    $("select.move-selector").find("option").remove().end().append(moveOptions);
    var abilityOptions = getSelectOptions(abilities, true);
    $("select.ability").find("option").remove().end().append("<option value=\"\">(other)</option>" + abilityOptions);
    var itemOptions = getSelectOptions(items, true);
    $("select.item").find("option").remove().end().append("<option value=\"\">(none)</option>" + itemOptions);

    $(".set-selector").val(getSetOptions()[gen > 3 ? 1 : gen === 1 ? 5 : 3].id);
    $(".set-selector").change();
    //document.getElementById('stats-name').innerHTML = gen > 2? "EV Spread" : "Stat Spread";
});

function clearField() {
    $("#doubles").prop("checked", true);
    $("#clear").prop("checked", true);
    $("#gscClear").prop("checked", true);
    $("#gravity").prop("checked", false);
    $("#srL").prop("checked", false);
    $("#srR").prop("checked", false);
    $("#spikesL0").prop("checked", true);
    $("#spikesR0").prop("checked", true);
    $("#gscSpikesL").prop("checked", false);
    $("#gscSpikesR").prop("checked", false);
    $("#reflectL").prop("checked", false);
    $("#reflectR").prop("checked", false);
    $("#lightScreenL").prop("checked", false);
    $("#lightScreenR").prop("checked", false);
    $("#foresightL").prop("checked", false);
    $("#foresightR").prop("checked", false);
    $("#helpingHandL").prop("checked", false);
    $("#helpingHandR").prop("checked", false);
    $("#friendGuardL").prop("checked", false);
    $("#friendGuardR").prop("checked", false);
    $("#neutralizingGas").prop("checked", false);
    $("#steelySpiritL").prop("checked", false);
    $("#steelySpiritR").prop("checked", false);
    $("#gMaxHazardL").prop("checked", false);
    $("#gMaxHazardR").prop("checked", false);
    $("#flowerGiftL").prop("checked", false);
    $("#flowerGiftR").prop("checked", false);
    $("#tailwindL").prop("checked", false);
    $("#tailwindR").prop("checked", false);
    $("#evoL").prop("checked", false);
    $("#evoR").prop("checked", false);
    $("#clangL").prop("checked", false);
    $("#clangR").prop("checked", false);
    $("#weakL").prop("checked", false);
    $("#weakR").prop("checked", false);
    $("#tatsuL").prop("checked", false);
    $("#tatsuR").prop("checked", false);
    $("#powerSpotL").prop("checked", false);
    $("#powerSpotR").prop("checked", false);
    $("#batteryL").prop("checked", false);
    $("#batteryR").prop("checked", false);
    $("#saltCureL").prop("checked", false);
    $("#saltCureR").prop("checked", false);
    $("#auroraVeilL").prop("checked", false);
    $("#auroraVeilR").prop("checked", false);
}

function getSetOptions() {
    var pokeNames, index;
    pokeNames = Object.keys(pokedex);
    index = pokeNames.length;
    while (index--) {
        try {
            if (pokedex[pokeNames[index]].isAlternateForme) {
                pokeNames.splice(index, 1);
            }
        }
        catch {
            console.log(pokeNames[index]);
        }
    }
    pokeNames.sort();
    var setOptions = [];
    var idNum = 0;
    for (var i = 0; i < pokeNames.length; i++) {
        var pokeName = pokeNames[i];
        setOptions.push({
            pokemon: pokeName,
            text: pokeName
        });
        if (pokeName in setdex) {
            var setNames = Object.keys(setdex[pokeName]);
            for (var j = 0; j < setNames.length; j++) {
                var setName = setNames[j];
                setOptions.push({
                    pokemon: pokeName,
                    set: setName,
                    text: pokeName + " (" + setName + ")",
                    id: pokeName + " (" + setName + ")"
                });
            }
        }
        setOptions.push({
            pokemon: pokeName,
            set: "Blank Set",
            text: pokeName + " (Blank Set)",
            id: pokeName + " (Blank Set)"
        });
    }
    return setOptions;
}

function getSelectOptions(arr, sort, defaultIdx) {
    if (sort) {
        arr.sort();
    }
    var r = '';
    // Zero is of course falsy too, but this is mostly to coerce undefined.
    if (!defaultIdx) {
        defaultIdx = 0;
    }
    for (var i = 0; i < arr.length; i++) {
        if (i === defaultIdx) {
            r += '<option value="' + arr[i] + '" selected="selected">' + arr[i] + '</option>';
        } else {
            r += '<option value="' + arr[i] + '">' + arr[i] + '</option>';
        }
    }
    return r;
}

$(document).ready(function() {
    var table = $('#damage-table').DataTable({
                    'rowsGroup':[0,4,1], //there is no reason to have column 1 in rowsGroup, but it stops a bug where the table swaps row order after every draw update 
                    paging: false, searching: true, info:false,dom: 'Bfrtip', buttons: ['copy', 'csv', 'excel'],
                    'columnDefs': [{'targets':3, 'width' : "1em"},
                                    {'targets' : 4, 'data': 'a',  'className': "dt-center editor-delete", 'defaultContent': '<img src="image_res/298889_x_icon.png" width="20px" />'} ],
                    "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                        var filteredRows = table.rows({'filter': 'applied'});
                                        var pokes = Array.from(new Set(filteredRows.data().toArray().map(x => x[0])));
                                        var index = Array.prototype.indexOf.call(pokes,aData[0]);
                                        var color;
                                        if (index % 2 === 0) {
                                            if ($('#atkdefswitch').is(":checked")){
                                                 color = ($('#switchTheme').val()==="dark")? "#ffe6e6": "#361b1b"; //Lighter red
                                            } else{
                                                 color = ($('#switchTheme').val()==="dark")? "#e9e6ff": "#202049"; //Lighter blue
                                            }
                                        }
                                        else {
                                            if ($('#atkdefswitch').is(":checked")){
                                                 color = ($('#switchTheme').val()==="dark")? "#f2d5d5": "#211111"; //Darker red
                                            } else{
                                                 color = ($('#switchTheme').val()==="dark")? "#dad6f3": "#131330"; //Darker blue
                                            }
                                        }
                                        $('td', nRow).css("background-color", color);

    }});
    $('#damage-table').on('click', 'td', function () {
        if (table.cell(this).node().classList.contains('editor-delete')) {
            var data = table.row(this).data();
            if (data) table.rows( function ( idx, aData, node ) {return aData[0] === data[0];} ).remove().draw();
        } else {
            var field = new Field();
            p1 = new Pokemon($("#p1"));
            var row = table.row(this).node();
            var pstr = $(row).attr('data-pokemon');
            p2 = JSON.parse(pstr);
            damageResults = calculateAllMoves(p1, p2, field); 
            var move = table.row(this).data();
            for (var i = 0; i < 4; i++) {
                var p = 1-$('#atkdefswitch').is(":checked");
                if (damageResults[p][i].description.indexOf(move[1]) > 0) {
                    navigator.clipboard.writeText(damageResults[p][i].description+": "+damageResults[p][i].damage[0]+"-"+damageResults[p][i].damage[damageResults[p][i].damage.length-1]+" ("+move[2].replace(/<[^>]*>/g, '')+ ") -- " + move[3]);
                }
            }
        }
    });
    table.columns.adjust().draw();
    $("#gen9").prop("checked", true);
    $("#gen9").change();
    //$(".terrain-trigger").bind("change keyup", getTerrainEffects); 
    $(".calc-trigger").bind("change keyup", calculate);
    $(".set-selector").select2({
        formatResult: function(object) {
            return object.set ? ("&nbsp;&nbsp;&nbsp;" + object.set) : ("<b>" + object.text + "</b>");
        },
        query: function(query) {
            var setOptions = getSetOptions();
            var pageSize = 30;
            var results = [];
            for (var i = 0; i < setOptions.length; i++) {
                var pokeName = setOptions[i].pokemon.toUpperCase();
                //if (!query.term || pokeName.indexOf(query.term.toUpperCase()) === 0) {
                //    results.push(setOptions[i]);
                //}
                if (!query.term || query.term.toUpperCase().split(" ").every(function (term) {
                    return pokeName.indexOf(term) === 0 || pokeName.indexOf("-" + term) >= 0 || pokeName.indexOf(" " + term) >= 0;
                }))
                    results.push(setOptions[i]);
            }
            query.callback({
                results: results.slice((query.page - 1) * pageSize, query.page * pageSize),
                more: results.length >= query.page * pageSize
            });
        },
        initSelection: function(element, callback) {
            var data = getSetOptions()[gen > 3 ? 1 : gen === 1 ? 5 : 3];
            callback(data);
        }
    });
    $(".move-selector").select2({
        dropdownAutoWidth:true,
        matcher: function(term, text) {
            // 2nd condition is for Hidden Power
            return text.toUpperCase().indexOf(term.toUpperCase()) === 0 || text.toUpperCase().indexOf(" " + term.toUpperCase()) >= 0;
        }
    });
    //SELECT2 CODE NEEDS TO BE CHANGED SO IT UPDATES WHEN CHANGED
    $(".ability").select2({
        dropdownAutoWidth: true,
        matcher: function (term, text) {
            // 2nd condition is just in case
            return text.toUpperCase().indexOf(term.toUpperCase()) === 0 || text.toUpperCase().indexOf(" " + term.toUpperCase()) >= 0;
        }
    });
    $(".item").select2({
        dropdownAutoWidth: true,
        matcher: function (term, text) {
            // 2nd condition is for shorthands like Choice items
            return text.toUpperCase().indexOf(term.toUpperCase()) === 0 || text.toUpperCase().indexOf(" " + term.toUpperCase()) >= 0;
        }
    });
    $(".set-selector").val(getSetOptions()[gen > 3 ? 1 : gen === 1 ? 5 : 3].id);
    $(".set-selector").change();
});
