var _ = GameUI.CustomUIConfig()._;
var DOTA_TEAM_SPECTATOR = 1;
var PlayerTables = GameUI.CustomUIConfig().PlayerTables;
var RegisterKeyBind = GameUI.CustomUIConfig().RegisterKeyBind;

function GetGold(pID){
	return CustomNetTables.GetTableValue('PlayerData', 'Player_' + (pID || GetPlayerID())).Gold || 0
}

function GetPrototypeUnitBuilding(iIndex){
	let name = Entities.GetUnitName(Number(iIndex))
	let dataServer = CustomNetTables.GetTableValue("CardInfoUnits", name)
	if (!dataServer) {
		$.Msg(`[Error] tower by name ${name} not found!`)
		return 
	}
	return dataServer.prototype_model
}

function GetChildrenFor(panel,fn){
	let data = []

	_.each(panel.GetChildren(),function(child){
		if (fn && fn(child))
			data.push(child)
	})
	return data
}

function IsCreepBuilding(iIndex){
	let name = Entities.GetUnitName(Number(iIndex))
	let dataServer = CustomNetTables.GetTableValue("CardInfoUnits", name)
	if (!dataServer) return false
	return dataServer.type == 'uncommon'
}

function StrFormattingCountSymbol(str,count){
	var c = str.length
	str = str.substr(0,count)
	var c = str.length
	while (str.length < count){
		str += "0";
	}
	return str;
	/*while (count != c){
		if (c < count){
			str[c] = '';
		}
		c = str.length;
	} */
} 
// Watcher Of Samsara
function Lerp(percent, a, b) {
	return a + percent * (b - a);
}
function Clamp(num, min, max) {
	return num <= min ? min : (num >= max ? max : num);
}
function RemapValClamped(num, a, b, c, d) {
	if (a == b)
		return c;

	var percent = (num - a) / (b - a);
	percent = Clamp(percent, 0.0, 1.0);

	return Lerp(percent, c, d);
}

function IsCardExist(CardSlot,pID){
	return GetDataCard(pID).CardSlots[CardSlot] && GetDataCard(pID).CardSlots[CardSlot].unitName !== -1
}

function IsEmptySlotInventory(){
	var tables = CustomNetTables.GetTableValue("PlayerData", "player_" + GetPlayerID())
	var maxslot = CustomNetTables.GetTableValue("PlayerData", "GLOBAL_SETTING").MAX_SLOTS
	for (i=1;i <= maxslot;++i)
		if (!tables.CardSlots[String(i)] || tables.CardSlots[String(i)].unitName == -1 )
			return true
	return false
}

function GetDataCard(pID){  
	pID = pID || GetPlayerID();
	return CustomNetTables.GetTableValue("PlayerData", "player_" + pID)
}
function FormattingTimeToRound(time){
	var str = String(time)
	while (str.length < 2)
		str = '0' + str
	return str
}
function GetFormatSecMMTime(Isms,time){
	var time = time || Game.GetDOTATime(false, false)
	var ms = time * 10000 % 10000
    var seconds = Math.floor(time)
    var minutes = Math.floor(parseInt(time, 10) / 60);
	var seconds = Math.floor(parseInt(time, 10) - minutes * 60);
	return FormattingTimeToRound(minutes) + ":"  + FormattingTimeToRound(seconds) + (Isms ?  ":" +  StrFormattingCountSymbol(String(Math.floor(ms)),4) : '');
}

function GetDotaHud() {
	var rootUI = $.GetContextPanel();
	while (rootUI.id != "Hud" && rootUI.GetParent() != null) {
		rootUI = rootUI.GetParent();
	}
	return rootUI;
}

function GetNumberOfDecimal(n) {
    n = (typeof n == 'string') ? n : n.toString();
    if (n.indexOf('e') !== -1) return parseInt(n.split('e')[1]) * -1;
    var separator = (1.1).toString().split('1')[1];
    var parts = n.split(separator);
    return parts.length > 1 ? parts[parts.length - 1].length : 0;
}

function FindDotaHudElement(id){ 
  return GetDotaHud().FindChildTraverse(id);
}

function GetPlayerID(){
	return Game.GetLocalPlayerInfo().player_id;
}

function LengthTable(table){
	var k = 0;
	for (i in table)
		k++;
	return k
} 

function IsAllChildrenHide(Parent){
	var t = {}
	_.each(Parent.Children(),function(child) {	
		t[child.id] = IsHiddenPanel(child);
	}); 
	for (var id in t){
		if (t[id] === false){
			return false
		}
	}
	return true
}

function GetRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function HidePanelClass(panel){
	panel.SetHasClass("hidden",true);
}
function UnHidePanelClass(panel){
	panel.SetHasClass("hidden",false);
}

function HidePanel(panel) {
	if (!panel) return
	panel.style.visibility = "collapse;";
	panel.hittest = false;
	panel.enabled = false;
	panel.hidden_custom = true;
}
function ToggleHidePanel(panel,bool){
	if (!panel) return
	return bool ? HidePanel(panel) : UnHiddenPanel(panel)
}

function UnHiddenPanel(panel) {
	if (!panel) return
	panel.style.visibility = "visible;";
	panel.hittest = true;
	panel.enabled = true;
	panel.hidden_custom = false;
}

function IsHiddenPanel(panel){
	return panel.hidden_custom
}

function IsHeroName(str) {
	return IsDotaHeroName(str);
}

function IsDotaHeroName(str) {
	return str.lastIndexOf('npc_dota_hero_') === 0;
}

function GetHeroName(unit) {
	return Entities.GetUnitName(unit);
}

function SortDec(a, b) {
  if (a > b) return -1;
  if (a < b) return 1;
}
function ShowAbilityTooltip( ability,abilityName )
{
	var name = abilityName || ability.abilityname
	return function()
	{
		$.DispatchEvent( "DOTAShowAbilityTooltip", ability, name ); 
	}
};

function HideAbilityTooltip ( ability )
{
	return function()
	{
		$.DispatchEvent( "DOTAHideAbilityTooltip", ability );
	}
};

function ShowText(panel,description,title)
{
	return function(){
		if (title) 
		{
			$.DispatchEvent("DOTAShowTitleTextTooltip",panel, title, description);
		} 
		else
		{
			$.DispatchEvent("DOTAShowTextTooltip", panel, description);
		}
	}
};

function HideText(title) 
{
	return function (){
		if (title) {
			$.DispatchEvent("DOTAHideTitleTextTooltip");
		} 
		else 
		{
			$.DispatchEvent("DOTAHideTextTooltip");
		}
	}
}


function TogglePanel(Panel){
	if (IsHiddenPanel(Panel))
		UnHiddenPanel(Panel)
	else
		HidePanel(Panel)
}

function nearestOrLowerKey(t, key){
	if (!t){ return false}
	var selectedKey
	for (var k in t){
		if (k <= key && (!selectedKey || Math.abs(k - key) < Math.abs(selectedKey - key))){
			selectedKey = k
		}
	}
	return t[selectedKey]
}


function UpdateLocalizeText(text,funcs){
	count = 0;
	while (text.indexOf("{ability_") > -1 && text.indexOf("}",text.indexOf("{ability_")) > -1 ){
		count++;
		var first = text.indexOf("{ability_");
		var ends = text.indexOf("}",first);
		var replace = text.substring(first,ends+1)
		var replacingText = replace;
		var color = funcs  ? funcs(count) : 'red';
		replace = replace.replace("{ability_","Dota_tooltip_ability_");
		replace = replace.replace("}",""); 
		text = text.replace(replacingText,"<font color='"+ color +"'>" + $.Localize(replace) + "</span></font>");
	}
	return text;
} 

//======================================================
//	Author: Ark120202
//	Custom Game: Angel Arena Black Start
//====================================================== 

function TransformTextureToPath(texture, optPanelImageStyle) {
	if (IsHeroName(texture))
		return optPanelImageStyle === 'portrait' ?
			'file://{images}/heroes/selection/' + texture + '.png' :
			optPanelImageStyle === 'icon' ?
				'file://{images}/heroes/icons/' + texture + '.png' :
				'file://{images}/heroes/' + texture + '.png';
	else if (texture.lastIndexOf('npc_') === 0)
		return optPanelImageStyle === 'portrait' ?
			'file://{images}/custom_game/units/portraits/' + texture + '.png' :
			'file://{images}/custom_game/units/' + texture + '.png';
	/*else if (optPanelImageStyle === 'Ability') 
		return 'file://{images}/spellicons/' + texture + '.png'
	else if (optPanelImageStyle === 'AbilityRaw')
		return 'raw://resource/flash3/images/spellicons/' + texture + '.png'
	else if (optPanelImageStyle === 'Rune')
			return 'file://{images}/rune/rune_' + texture + '.png';
	else if (optPanelImageStyle === 'custom_icon')
		return 'file://{images}/custom_game/custom_icon/' + texture + '.png' 
	else
		return optPanelImageStyle === 'item' ?
			'raw://resource/flash3/images/items/' + texture + '.png' :
			'raw://resource/flash3/images/spellicons/' + texture + '.png'; */
	switch (optPanelImageStyle) {
		case 'Ability':
			return 'file://{images}/spellicons/' + texture + '.png';				
		case 'AbilityRaw':
			return 'raw://resource/flash3/images/spellicons/' + texture + '.png';		
		case 'Rune':
			return 'file://{images}/rune/rune_' + texture + '.png';		
		case 'custom_icon':
			return 'file://{images}/custom_game/custom_icon/' + texture + '.png';
		default:
			return optPanelImageStyle === 'item' ?
				'raw://resource/flash3/images/items/' + texture + '.png' :
				'raw://resource/flash3/images/spellicons/' + texture + '.png';
		
	}
	return;
}

function SafeGetPlayerHeroEntityIndex(playerId) {
	var clientEnt = Players.GetPlayerHeroEntityIndex(playerId);
	return clientEnt === -1 ? (Number(PlayerTables.GetTableValue('player_hero_indexes', playerId)) || -1) : clientEnt;
}

function GetPlayerHeroName(playerId) {
	if (Players.IsValidPlayerID(playerId)) {
		return GetHeroName(SafeGetPlayerHeroEntityIndex(playerId));
	}
	return '';
}

function GetTeamInfo(team) {
	var t = PlayerTables.GetTableValue('teams', team) || {};
	return {
		score: t.score || Game.GetTeamDetails( team ).team_score || 0,
	};
}

function GetHEXPlayerColor(playerId) {
	var playerColor = Players.GetPlayerColor(playerId).toString(16);
	return playerColor == null ? '#000000' : ('#' + playerColor.substring(6, 8) + playerColor.substring(4, 6) + playerColor.substring(2, 4) + playerColor.substring(0, 2));
}

function secondsToMS(seconds, bTwoChars) {
	var sec_num = parseInt(seconds, 10);
	var minutes = Math.floor(sec_num / 60);
	var seconds = Math.floor(sec_num - minutes * 60);

	if (bTwoChars && minutes < 10)
		minutes = '0' + minutes;
	if (seconds < 10)
		seconds = '0' + seconds;
	return minutes + ':' + seconds;
}

function SortPanelChildren(panel, sortFunc, compareFunc) {
	var tlc = panel.Children().sort(sortFunc);
	_.each(tlc, function(child) {
		for (var k in tlc) {
			var child2 = tlc[k];
			if (child !== child2 && compareFunc(child, child2)) {
				panel.MoveChildBefore(child, child2);
				break;
			} 
		}
	});
};

function dynamicSort(property) {
	var sortOrder = 1;
	if (property[0] === '-') {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function(a, b) {
		var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		return result * sortOrder;
	};
}

function FormatComma (value) {
  try {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch (e) {}
}

function FormatGold (value) {
  // var formatted = FormatComma(gold);
  // if (gold.toString().length > 6) {
  //   return FormatGold(gold.toString().substring(0, gold.toString().length - 5) / 10) + 'M';
  // } else if (gold.toString().length > 5) { 
  //   return FormatGold(gold.toString().substring(0, gold.toString().length - 3)) + 'K';
  // } else {
  //   return formatted;
  // }
  
  // ark120202
	return (value > 9999999 
		? (value/1000000).toFixed(2) + 'M' 
		: value > 99999 
			? (value/1000).toFixed(1) + 'k' 
			: value)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function DynamicSubscribePTListener(table, callback, OnConnectedCallback) {
	if (PlayerTables.IsConnected()) {
		$.Msg("Update " + table + " / PT connected")
		var tableData = PlayerTables.GetAllTableValues(table);
		if (tableData != null)
			callback(table, tableData, {});
		var ptid = PlayerTables.SubscribeNetTableListener(table, callback);
		if (OnConnectedCallback != null) {
			OnConnectedCallback(ptid);
		}
	} else {
		$.Msg("Update " + table + " / PT not connected, repeat")
		$.Schedule(0.1, function() {
			DynamicSubscribePTListener(table, callback, OnConnectedCallback);
		});
	}
}