var sortable = 'racial' // default sortable  
var dataNumbers = {
	1:'SIMPLE',
	2:'NORMAL',
	3:'HARD',
	4:'IMPOSSIBLE',
	5:'HELL',
	6:'SANDBOX',
}    
var questContainer = $('#QuestMainContainer')
var dailyQuest = $("#QuestDailyContainer")
var sandBoxMenu = $('#SandBoxMenu')
var CoinsContainer = $("#CoinsContainer");
var NotifyServerContainer = $('#NotifyServerContainer');
var ChestTimeAlive = $('#ChestTimeAlive')
 
var m_QueryUnit = Game.GetLocalPlayerID();;
var PhysicalRuneMask = $('#double-rune-mask');
var MagicalRuneMask = $('#magic-rune-mask');
var LifeRuneMask = $('#aegis-rune-mask');

var infinityIcon = $('#InfinityIcon');
var roundLabel = $('#RoundLabel');
 
var RoundBoard = $("#RoundBoard")

var attributes = GetDotaHud().FindChildTraverse('stragiint')

var rangeParticle2

// let defaultPickArr = [
// 	[1,2,3],
// 	[7,5,6,4],
// 	[8,9,-1,10,11],
// 	[12,13,14,15],
// 	[16,17,18],
// ]

var colors = {
	common:'#7d7f7d',
	uncommon:'#b1b3b1',
	rare:'#4573D5', 
	mythical:'#9933ff',
	legendary:'#FF7C00',
	Godness:'#EB312C',	
}   
var pickdiff = $('#PickDifficulty')
var openNew = $('#PickUniqueBonus')
var openNew2 = $('#SelectedUniqueCards')
var toggle1 = $('#Toggle-1')
var toggle2 = $('#Toggle-2')
var goldButton = GetDotaHud().FindChildTraverse('ShopButton').FindChildTraverse('GoldLabel')
var toggle3 = $('#Toggle-3')

const CREEP_MAX = 6
const HEROES_MAX = 4

const heroesContainer = $('#HeroesContainer')
const creepContainer =  $('#CreepContainer')

function UpdateInfoPanel(){
	var parent = $('#ContainerMenu')
	parent.RemoveAndDeleteChildren()
	var data = {
		uncommon:[],
		rare:[],
		mythical:[],
		legendary:[],
	}    
	var dataCard = CustomNetTables.GetAllTableValues('CardInfoUnits')
	for (k in dataCard){
		var dataNettables = dataCard[k];
		var unitName = dataNettables.key;
		var dataUnit = dataNettables.value;
		if (dataUnit.type == 'Starting_towers') continue
		data[dataUnit.type].push({
			unitName:unitName,
			racial:dataUnit.racial,
			className:dataUnit.class
		});
		data[dataUnit.type].sort(function(a,b){
			return a[sortable] > b[sortable]
		});
	}    
	for (k in data){
		var panel = $.CreatePanel('Panel',parent,k);
		panel.AddClass('ContainerRarity');
		var topbar = $.CreatePanel('Panel',panel,'ContainerTopBar')
		topbar.style.backgroundColor = "gradient( linear, 72% 100%, 75% 0%, from( #000000dd ), color-stop( .8, {color}), to( #00000000 ) )".replace('{color}',colors[k])
		var label = $.CreatePanel('Label',topbar,'');
		label.html = true;
		label.text = $.Localize(k);
		var cardList = $.CreatePanel('Panel',panel,'CardList');
		_.each(data[k],function(data){
			var cardName = data.unitName 
			var unitData = CustomNetTables.GetTableValue('CardInfoUnits', cardName);
			var parentCard = $.CreatePanel('Panel',cardList,cardName)
			parentCard.AddClass('CardPanelData')
			var classes = unitData.class.split(' | ');
			var classname = '' 
			for (name in classes)
				classname += $.Localize(classes[name]) + " ";
			var cardPanel = $.CreatePanel('Panel',parentCard,'CardInfoPanel')
			var cardPanelInformation = $.CreatePanel('Panel',parentCard,'CardTooltip')
			cardPanelInformation.BLoadLayoutSnippet('TooltipCard')
			cardPanelInformation.SetDialogVariable('damageMin', unitData.BaseStats.DamageMin)
			cardPanelInformation.SetDialogVariable('damageMax', unitData.BaseStats.DamageMax)
			cardPanelInformation.SetDialogVariable('attackRate', unitData.BaseStats.AttackRate.toFixed(1))
			cardPanelInformation.SetDialogVariable('AttackRange', unitData.BaseStats.AttackRange);
			cardPanelInformation.SetDialogVariable('class', classname);
			//cardPanelInformation.SetDialogVariable('racial', racial); 
			cardPanel.BLoadLayoutSnippet('Card');
			cardPanel.FindChildTraverse('CardNameHeader').text = $.Localize(cardName);
			/*var containerClass = cardPanel.FindChildTraverse('ClassIcons'); 
			var raceContainer = cardPanel.FindChildTraverse('RaceIcons');
			_.each(racialArr,function(racial){
				var q = $.CreatePanel('Panel',raceContainer,'')
				q.AddClass(racial.toLowerCase());
				q.AddClass('RaceIcon');
			})
			_.each(classes,function(className){
				var q =$.CreatePanel('Panel',containerClass,'')
				q.AddClass(className.toLowerCase());
				q.AddClass('ClassIcon');
			})*/
			cardPanel.FindChildTraverse('primarystats').AddClass(unitData.BaseStats.PrimaryStats != -1 
				? unitData.BaseStats.PrimaryStats == 'DOTA_ATTRIBUTE_AGILITY' 
					?	'AgilityIcon'
					: 	unitData.BaseStats.PrimaryStats == 'DOTA_ATTRIBUTE_INTELLECT' 
						? 	'IntellectIcon'
						: 	'StrengthIcon'
				: 'Invisible'
			)
			var abilityByUpgrade = unitData.BonusAbilityByGrade
			var ability = unitData.BaseStats.Ability
			var abilityPanel = cardPanel.FindChildTraverse('AbilityList')
			_.each(ability,function(abilityName){
				var panel = $.CreatePanel('Panel',abilityPanel,'')
				panel.SetPanelEvent( "onmouseover", ShowAbilityTooltip(panel,abilityName));  
				panel.SetPanelEvent( "onmouseout",HideAbilityTooltip(panel));	
				panel.AddClass('AbilityPanel')
				$.CreatePanel('DOTAAbilityImage',panel,'').abilityname = abilityName
				$.CreatePanel('Panel',panel,'Bevel')
			})
			/*if (abilityByUpgrade != null)
				for (abilityName in abilityByUpgrade){
					var panel = $.CreatePanel('Panel',abilityPanel,'')
					panel.SetPanelEvent( "onmouseover", ShowAbilityTooltip(panel,abilityName));  
					panel.SetPanelEvent( "onmouseout",HideAbilityTooltip(panel));	
					panel.AddClass('AbilityPanel')
					$.CreatePanel('DOTAAbilityImage',panel,'').abilityname = abilityName
					$.CreatePanel('Panel',panel,'Bevel')	
					var panelStars = $.CreatePanel('Panel',panel,'NeedGradePanel')	
						$.CreatePanel('Panel',panelStars,'').AddClass('star');		
				}
			*/    
			cardPanel.SetPanelEvent( "onmouseover", function(){
				cardPanelInformation.AddClass('Visible');
			});      
			cardPanel.SetPanelEvent( "onmouseout",function(){
				cardPanelInformation.RemoveClass('Visible');
			});
			cardPanel.FindChildTraverse('HeroIcon').AddClass(unitData.type)
			cardPanel.FindChildTraverse('HeroIcon').SetImage('file://{images}/heroes/{name}.png'.replace('{name}',unitData.prototype_model))
			var scenePanel = cardPanel.FindChildTraverse('ScenePanel');
			var xml = IsAnimationCards()    
			? '<DOTAScenePanel antialias="true" hittest="false" id="UnitModelCard" unit="{unitName}" particleonly="false" />'.replace('{unitName}',unitData.prototype_model)
			: '<Image id="UnitModelCard" scaling="stretch-to-cover-preserve-aspect" src="s2r://panorama/images/war_of_kings/cards/' + cardName + '.png"/>';  
			scenePanel.BCreateChildren(xml);   
			let ClassAbilityPanel = cardPanel.FindChildTraverse('ClassAbilityPanel')
			ClassAbilityPanel.abilityname =unitData.class + "_class"; ;
			ClassAbilityPanel.SetPanelEvent( "onmouseover", ShowAbilityTooltip(ClassAbilityPanel));  
			ClassAbilityPanel.SetPanelEvent( "onmouseout",HideAbilityTooltip(ClassAbilityPanel));
		})
	}
}   
var SelectionUniqueID = {
	'Unique_close':0,
	'Unique_warrior':1,
	'Unique_mage':2,
	'Unique_health':3,
	'Unique_midas':4,
	'Unique_gold_per_kill':5,
	'Unique_tower':6,
	'Unique_tower_level':7,
	'Unique_drop_chance':8,
	'Unique_creep_not_use':9,
}

function OnUpdateSelectionButton(){
	var ExpData = GetXpAndOst()
	$("#Unique_health").enabled = ExpData.Level >= 5
	$("#Unique_health").needlvl = 5
	$("#Unique_midas").enabled = ExpData.Level >= 10
	$("#Unique_midas").needlvl = 10
	$("#Unique_gold_per_kill").enabled =  ExpData.Level >= 15
	$("#Unique_gold_per_kill").needlvl = 15
	$("#Unique_tower").enabled = ExpData.Level >= 20
	$("#Unique_tower").needlvl = 20
	$("#Unique_tower_level").enabled = ExpData.Level >= 25
	$("#Unique_tower_level").needlvl = 25
	$("#Unique_drop_chance").enabled = ExpData.Level >= 30
	$("#Unique_drop_chance").needlvl = 30
	$("#Unique_creep_not_use").enabled = ExpData.Level >= 35
	$("#Unique_creep_not_use").needlvl = 35
	var funcsOnMouseOver = function(panel){
		return function(){
			if (!panel.enabled)
				$.DispatchEvent("DOTAShowTextTooltip",panel, $.Localize('UI_need_lvl').replace('{level}',panel.needlvl));
		}
	}
	for (var i in SelectionUniqueID){
		var panel = $('#' + i)
		panel.SetPanelEvent('onactivate', SelectionUnique(SelectionUniqueID[i],panel))
		panel.SetPanelEvent('onmouseover', funcsOnMouseOver(panel))
		panel.SetPanelEvent('onmouseout', HideText())
	}
	$("#XpPlayerContainer").SetDialogVariable('player_level', ExpData.Level);
	var Xpb = $("#XpBar");
	Xpb.value = Number(ExpData.Exp); 
	Xpb.max = ExpData.ExpMax;
	Xpb.SetDialogVariable('xp_level', Xpb.value)
	Xpb.SetDialogVariable('xp_max_level', Xpb.max)
}


function SelectionUnique(iUnique,panel){
	return function(){
		_.each($('#ContainerSelectionUnique').Children(),function(child){
			child.SetHasClass('Active', child.id == panel.id)
		})
		GameEvents.SendCustomGameEventToServer('OnSelectionUnique', {
			iUnique:iUnique,
		})
		pickdiff.SetHasClass('hidden', true)
		openNew.SetHasClass('Visible', false)
		openNew2.SetHasClass('Visible', true)
		toggle3.AddClass('IsOpen')
		toggle2.RemoveClass('IsOpen')
		toggle1.RemoveClass('IsOpen')
	}
}

function UseAbility(ability){
	GameEvents.SendCustomGameEventToServer('OnUseAbility', {
		ability:ability,
	})
}

var toggleList = {
	1:'CardAssemblyContainer',
	2:'CardMenuContainer',
	// 3:'InfoPanelCards',
	4:'SettingContainer',
	5:'ShopContainerRoot',
	6:'leaderboardsContainer',
}

function OnClickDropDown(){
	var name = $('#ArrangeButton').Children()[0].id
	if (sortable == name) return
	sortable = name;
	UpdateInfoPanel();
}

 
function ToggleVisiblePanel(name){
	for (k in toggleList){
		$('#' + toggleList[k]).SetHasClass('Visible', (toggleList[k] == name) && !$('#' + toggleList[k]).BHasClass('Visible'));
	}
	//$('#' + name).SetHasClass('Visible', !$('#' + name).BHasClass('Visible'));
}


function OnInputSubmitEntry(){
	var name = $("#ItemSearchTextEntry").text
	var data = {
		uncommon:[],
		rare:[],
		mythical:[],
		legendary:[],
		Godness:[],
	}

	var dataCard = CustomNetTables.GetAllTableValues('CardInfoUnits')
	for (k in dataCard){
		var dataNettables = dataCard[k];
		var unitName = dataNettables.key;
		var dataUnit = dataNettables.value;
		if ($.Localize(unitName).toUpperCase().indexOf(name.toUpperCase()) == -1) continue;
		data[dataUnit.type].push(unitName);
	}
	var parent = $('#ContainerMenu')
	_.each(parent.Children(),function(child){
		child.SetHasClass('Invisible', data[child.id].length < 1)
		if (data[child.id].length < 1) return
			_.each(child.FindChildTraverse('CardList').Children(),function(children){
				children.SetHasClass('Invisible', $.Localize(children.id).toUpperCase().indexOf(name.toUpperCase()) == -1)
			})
	})
}

function SearchAssembly(){  
	var text = $.Localize($('#ItemSearchTextEntryAssembly').text).toUpperCase()
	var parent = $('#CardAssemblyMain');
	_.each(parent.Children(),function(child){
		var SearchUnitByCard = false
		var SearchAbility = false 
		var labelText = child.FindChildTraverse('CardNameAssembly').text.toUpperCase()
		var assembliesPanel = child.FindChildTraverse('HeroAssemblyContent')
		_.each(assembliesPanel.Children(),function(children){
			var TextIsAbility = children.FindChildTraverse('DescriptionLabels').FindChildTraverse('AbilityName') && children.FindChildTraverse('DescriptionLabels').FindChildTraverse('AbilityName').text.toUpperCase().indexOf(text) != -1
			var IsSearchUnit = false
			_.each(children.FindChildTraverse('DescriptionLabels').Children(),function(chilld){
				if (chilld.id == 'AbilityName') return
				if (IsSearchUnit) return
				_.each(chilld.Children(),function(chillld){
					if (!chillld.unitNameSearch) return
					IsSearchUnit = IsSearchUnit || $.Localize(chillld.unitNameSearch).toUpperCase().indexOf(text) > -1 
				})
			})
			children.SetHasClass('InVisible', !TextIsAbility)
			SearchUnitByCard = SearchUnitByCard || IsSearchUnit
			SearchAbility = SearchAbility || TextIsAbility
			if (IsSearchUnit || TextIsAbility){
				children.SetHasClass('InVisible', false)

			}
		})
		child.SetHasClass('Invisible',labelText.indexOf(text) == -1)
		if (SearchUnitByCard)
			child.SetHasClass('Invisible',!SearchUnitByCard)
		if (SearchAbility)
			child.SetHasClass('Invisible',!SearchAbility)
	})
}

function UpdateAssemblyPanel(){
	var parent = $('#CardAssemblyMain');
	parent.RemoveAndDeleteChildren();
	var allData = CustomNetTables.GetAllTableValues('CardInfoUnits');
	var dataSort = {
		uncommon:2,
		rare:3,
		mythical:4,
		legendary:5,   
	}
	var array = []
	for (var k in allData){
		array.push(allData[k])
	} 
	var indexes = -1
	array.sort(function(a,b){
		indexes++
		return dataSort[a.value.type] > dataSort[b.value.type]
		? 1 
		: dataSort[a.value.type] < dataSort[b.value.type]
			? -1
			: a.key > b.key
				? 1
				: a.key < b.key
					? -1
					: 0
	})
	for (var k in array){
		var dataNettables = array[k];
		var unitName = dataNettables.key;
		var dataUnit = dataNettables.value;
		if (!dataUnit.Assemblies) continue;
		var panel = $.CreatePanel('Panel',parent,'')
		panel.AddClass('HeroSlot')
		$.CreatePanel('Label',panel,'CardNameAssembly').text = $.Localize(unitName)
		var detalies = $.CreatePanel('Panel',panel,'')
		detalies.AddClass('HeroDetalies') 
		var containerImage = $.CreatePanel('Panel',detalies,'')
		$.CreatePanel('Image',containerImage,'HeroIconAssembly').SetImage('file://{images}/heroes/{name}.png'.replace('{name}',dataUnit.prototype_model))
		$.CreatePanel('Panel',containerImage,'BorderAnim').AddClass(dataUnit.type)
		var assemblycontent = $.CreatePanel('Panel',detalies,'HeroAssemblyContent')
		for (var name in dataUnit.Assemblies){ 
			var data = dataUnit.Assemblies[name];
			var units =   data.assembliesNeed.split(' | ');
			var abilityAssembly = data.AssemblyAbility;
			var childpanel = $.CreatePanel('Panel',assemblycontent,'');
			var localizeName = $.Localize(name)
			if (data.data)  
				for (var q in data.data){
					localizeName = localizeName.replace('{' + q + '}',data.data[q].toFixed(Math.min(GetNumberOfDecimal(data.data[q]),1)))
				}      
			childpanel.BLoadLayoutSnippet('RowDescription');
			if (!abilityAssembly){
				childpanel.FindChildTraverse('AbilityName').DeleteAsync(0)
				childpanel.FindChildTraverse('AbilityImage').DeleteAsync(0)   
				var parentDescription = $.CreatePanel('Panel',childpanel.FindChildTraverse('DescriptionLabels'),'')
				$.CreatePanel('Panel',parentDescription,'').AddClass('Dot')
				var labelDescription = $.CreatePanel('Label',parentDescription,'')
				labelDescription.text = localizeName;
				assemblycontent.style.marginTop = 0  
				parentDescription.style.flowChildren = "right"
			}  
			if (abilityAssembly){  
				childpanel.FindChildTraverse('AbilityName').text = $.Localize('Dota_tooltip_ability_' + abilityAssembly);
				var abilityimage = childpanel.FindChildTraverse('AbilityImage')
				abilityimage.abilityname = abilityAssembly; 
				localizeName = localizeName.replace('{ability}',$.Localize('Dota_tooltip_ability_' + abilityAssembly).toUpperCase())
				abilityimage.SetPanelEvent('onmouseover',ShowText(abilityimage,localizeName))
				abilityimage.SetPanelEvent('onmouseout',HideText())
			}
			var descriptionpanel = childpanel.FindChildTraverse('DescriptionLabels')
			for (var unitNames in units){
				var labelDescription = $.CreatePanel('Panel',descriptionpanel,'')
				labelDescription.AddClass('LabelDescription')
				var split = units[unitNames].split(' + ')
				var length = LengthTable(split) 
				var start = 1
				var proto = CustomNetTables.GetTableValue("CardInfoUnits", unitName).prototype_model;
				var image = $.CreatePanel('Image',labelDescription,'')
				image.AddClass('HeroImageDescription')
				image.unitNameSearch = unitName
				image.SetImage('file://{images}/heroes/{name}.png'.replace('{name}',proto))
				$.CreatePanel('Label',labelDescription,'plusDescription').text = '+'
				for (var names in split){ 
					var proto = CustomNetTables.GetTableValue("CardInfoUnits", split[names]).prototype_model;
					var image = $.CreatePanel('Image',labelDescription,'')

					image.unitNameSearch = split[names]
					image.AddClass('HeroImageDescription')
					image.SetImage('file://{images}/heroes/{name}.png'.replace('{name}',proto))
					if (start < length)
						$.CreatePanel('Label',labelDescription,'plusDescription').text = '+'
					start++
				}
			}
		}
	}
}
function UpdateSetting(){ 
	var IsAnimation = IsAnimationCards()
	_.each($('#ContainerMenu').Children(),function(child1){
			_.each(child1.FindChildTraverse('CardList').Children(),function(child){
				var baseDataUnit = CustomNetTables.GetTableValue("CardInfoUnits", child.id);
				var scene = child.FindChildTraverse('ScenePanel')
				scene.RemoveAndDeleteChildren()
				var xml = IsAnimation 
					? '<DOTAScenePanel antialias="true" hittest="false" id="UnitModelCard" unit="{unitName}" particleonly="false" />'.replace('{unitName}',baseDataUnit.prototype_model)
					: '<Image id="UnitModelCard" scaling="stretch-to-cover-preserve-aspect" src="s2r://panorama/images/war_of_kings/cards/' + child.id + '.png"/>';  
				scene.BCreateChildren(xml);
			})
	})
}


function OnUpdateCardSelection(data){
	for (k in toggleList)
		$('#' + toggleList[k]).RemoveClass('Visible')
	var container = $('#MainContainerSelectCard')
	container.RemoveAndDeleteChildren()
	var data = data || CustomNetTables.GetTableValue("PlayerData", "player_" + GetPlayerID()).CacheRandomCards
	var idCard = 0
	_.each(data,function(card){
		idCard++;  
		var containerP = $.CreatePanel('Panel',container,'')
		containerP.BLoadLayoutSnippet('Card')
		var baseDataUnit = CustomNetTables.GetTableValue("CardInfoUnits", card);
		containerP.AddClass(baseDataUnit.type)
		var ability = baseDataUnit.BaseStats.Ability
		var scenePanel = containerP.FindChildTraverse('ScenePanel')
		var abilityPanel = containerP.FindChildTraverse('AbilityList')
		// background-color: gradient( linear, 77% 100%, 80% 0%, from( #000000dd ), color-stop( .8, #9933ff), to( #00000000 ) );
		var xml = IsAnimationCards()  
			? '<DOTAScenePanel antialias="true" hittest="false" id="UnitModelCard" unit="{unitName}" particleonly="false" />'.replace('{unitName}',baseDataUnit.prototype_model)
			: '<Image id="UnitModelCard" scaling="stretch-to-cover-preserve-aspect" src="s2r://panorama/images/war_of_kings/cards/' + card + '.png"/>';  
		scenePanel.BCreateChildren(xml);  

		let ClassAbilityPanel = containerP.FindChildTraverse('ClassAbilityPanel')
		ClassAbilityPanel.abilityname = baseDataUnit.class + "_class"; 
		ClassAbilityPanel.SetPanelEvent( "onmouseover", ShowAbilityTooltip(ClassAbilityPanel));  
		ClassAbilityPanel.SetPanelEvent( "onmouseout",HideAbilityTooltip(ClassAbilityPanel));

		containerP.FindChildTraverse('CardNameHeader').text = $.Localize(card)
		containerP.FindChildTraverse('HeroIcon').AddClass(baseDataUnit.type)
		containerP.FindChildTraverse('HeroIcon').SetImage('file://{images}/heroes/{name}.png'.replace('{name}',baseDataUnit.prototype_model))
		containerP.FindChildTraverse('HeroIcon').SetPanelEvent( "onmouseover", ShowText(containerP.FindChildTraverse('HeroIcon'),baseDataUnit.type));  
		containerP.FindChildTraverse('HeroIcon').SetPanelEvent( "onmouseout",HideText());
		containerP.SetPanelEvent( "onactivate",OnBuyCard(idCard));
		containerP.FindChildTraverse('primarystats').AddClass(baseDataUnit.BaseStats.PrimaryStats != -1 
			? baseDataUnit.BaseStats.PrimaryStats == 'DOTA_ATTRIBUTE_AGILITY' 
				?	'AgilityIcon'
				: 	baseDataUnit.BaseStats.PrimaryStats == 'DOTA_ATTRIBUTE_INTELLECT' 
					? 	'IntellectIcon'
					: 	'StrengthIcon'
			: 'Invisible'
		) 
		_.each(ability,function(abilityName){

			var panel = $.CreatePanel('Panel',abilityPanel,'')
			panel.SetPanelEvent( "onmouseover", ShowAbilityTooltip(panel,abilityName));  
			panel.SetPanelEvent( "onmouseout",HideAbilityTooltip(panel));	
			panel.AddClass('AbilityPanel')
			$.CreatePanel('DOTAAbilityImage',panel,'').abilityname = abilityName
			$.CreatePanel('Panel',panel,'Bevel')
		})
	})
} 
function OnBuyCard(idCard){
	return function(){
		GameEvents.SendCustomGameEventToServer('OnBuyCard', {
			CardID:idCard,
		})
	}
}

function DiscardCard(){
	GameEvents.SendCustomGameEventToServer('OnDiscardCard', {})
}

function UpdateRoundDamage(){ 
	var data = CustomNetTables.GetTableValue("PlayerData", "player_" + GetPlayerID()).BuildingCardsEndRoundData || {}
	var maxWidth = 200
	var TowersDamage = $('#TowersDamage')
	TowersDamage.RemoveAndDeleteChildren()
	var arraySort = []
	delete data.npc_war_of_kings_devoloper 
	for (i in data){
		arraySort.push({
			name:i,
			damage:Number(data[i]),
		})
	}
	if (arraySort.length < 1) return
	arraySort.sort(function(a,b){
		return a.damage < b.damage 
		? 1
		: a.damage > b.damage 
			? -1
			: 0
	})
	var maxDamage = arraySort[0].damage
	_.forEach(arraySort,function(value){
		var name = value.name
		if (name == 'npc_war_of_kings_devoloper') return;
		var prototype = CustomNetTables.GetTableValue("CardInfoUnits", name).prototype_model || name;
		var pct = maxWidth * (value.damage/maxDamage).toFixed(8)
		var parent = $.CreatePanel('Panel',TowersDamage,'')
		parent.AddClass('HeroBarProgress')
		var image = $.CreatePanel('Panel',parent,'HeroIconDamage') 
		image.style.backgroundImage = ('url("s2r://panorama/images/heroes/{heroName}.png")'.replace('{heroName}',prototype)) 
		image.AddClass('HeroIconDamage') 
		//image.SetImage('file://{images}/heroes/{heroName}.png'.replace('{heroName}',prototype))
		//image.scaling = "stretch-to-cover-preserve-aspect"		
		var progressBar = $.CreatePanel('Panel',parent,'ProgressBarTowerDamage')
		progressBar.style.width = pct + 'px';
		$.CreatePanel('Panel',progressBar,'Circle')
		$.CreatePanel('Panel',progressBar,'bar')
		$.CreatePanel('Label',parent,'ProgressBarLabel').text = FormatGold(value.damage.toFixed(0))
		progressBar.SetPanelEvent( "onmouseover", ShowText(progressBar,$.Localize(name)));  
		progressBar.SetPanelEvent( "onmouseout",HideText());	
	})
}

function AutoUpdatePlayerData(){
	var dataAttributes = {
		fStrength:-1,
		fAgility:-1,
		fIntellect:-1,
		
		baseStrength:0,
		baseAgility:0,
		baseIntellect:0,
	}
	var unit = Players.GetLocalPlayerPortraitUnit();
	for (var i = 0; i < Entities.GetNumBuffs(unit); i++) {
    	var buff = Entities.GetBuff(unit, i);
        var name = Buffs.GetName(unit, buff);
		if (name == 'modifier_attributes_custom_strength')
			dataAttributes.fStrength = Buffs.GetStackCount( unit, buff);
		if (name == 'modifier_attributes_custom_agility')
			dataAttributes.fAgility = Buffs.GetStackCount( unit, buff);
		if (name == 'modifier_attributes_custom_intellect')
			dataAttributes.fIntellect = Buffs.GetStackCount( unit, buff);

		if (name == 'modifier_attributes_custom_base_strength')
			dataAttributes.baseStrength = Buffs.GetStackCount( unit, buff);
		if (name == 'modifier_attributes_custom_base_agility'){
			dataAttributes.baseAgility = Buffs.GetStackCount( unit, buff);
		}
		if (name == 'modifier_attributes_custom_base_intellect')
			dataAttributes.baseIntellect = Buffs.GetStackCount( unit, buff);
    }
    attributes.style.visibility =  dataAttributes.fStrength > -1 ? 'visible' : 'collapse';
    if (dataAttributes.fStrength > -1){
    	let unitName = Entities.GetUnitName(unit)
    	let BaseStats = CustomNetTables.GetTableValue("CardInfoUnits", unitName) && CustomNetTables.GetTableValue("CardInfoUnits", unitName).BaseStats || {}
    	let attack_range = Entities.GetAttackRange( unit )
    	
    	let IsAlt = GameUI.IsAltDown()
    	attributes.FindChildTraverse('StrengthLabel').text = dataAttributes.baseStrength + (IsAlt ? " +" + BaseStats.StrengthGain.toFixed(1) : "")
    	attributes.FindChildTraverse('AgilityLabel').text = dataAttributes.baseAgility + (IsAlt ? " +" + BaseStats.AgilityGain.toFixed(1) : "")
    	attributes.FindChildTraverse('IntelligenceLabel').text = dataAttributes.baseIntellect + (IsAlt ? " +" + BaseStats.IntellectGain.toFixed(1) : "")
    	if (IsAlt && !rangeParticle2){
	    	rangeParticle2 = Particles.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, -1);
	        Particles.SetParticleControl(rangeParticle2, 1, [attack_range, attack_range, attack_range]);
	        Particles.SetParticleControl(rangeParticle2, 0, Entities.GetAbsOrigin(unit))
    	}else if (!IsAlt && rangeParticle2){
    		Particles.DestroyParticleEffect(rangeParticle2, false);
    		rangeParticle2 = null;
    	}

 		var greenStrength = dataAttributes.fStrength - dataAttributes.baseStrength
 		var greenAgility = dataAttributes.fAgility - dataAttributes.baseAgility
 		var greenIntellect = dataAttributes.fIntellect - dataAttributes.baseIntellect

    	attributes.FindChildTraverse('StrengthModifierLabel').SetHasClass('StatPositive',greenStrength > 0 )
    	attributes.FindChildTraverse('StrengthModifierLabel').SetHasClass('StatNegative',greenStrength < 0 )

    	attributes.FindChildTraverse('AgilityModifierLabel').SetHasClass('StatPositive',greenAgility > 0 )
    	attributes.FindChildTraverse('AgilityModifierLabel').SetHasClass('StatNegative',greenAgility < 0 )

    	attributes.FindChildTraverse('IntelligenceModifierLabel').SetHasClass('StatPositive',greenIntellect > 0 )
    	attributes.FindChildTraverse('IntelligenceModifierLabel').SetHasClass('StatNegative',greenIntellect < 0 )

    	var labelStr = greenStrength == 0 ?  "" :  (greenStrength > 0 ? ("+" + greenStrength) : greenStrength)
    	var labelAgi = greenAgility == 0 ?   "" :  (greenAgility > 0 ? ("+" + greenAgility) : greenAgility)
    	var labelInt = greenIntellect == 0 ? "" : (greenIntellect > 0 ? ("+" + greenIntellect) : greenIntellect)
    	attributes.SetDialogVariable('strength_bonus', labelStr)
    	attributes.SetDialogVariable('agility_bonus', labelAgi)
    	attributes.SetDialogVariable('intelligence_bonus', labelInt)
    }
	GameUI.SetCameraDistance(RemapValClamped($("#CameraDistanceSlider").value, 0, 1, 1300, 1520));
	var container = $("#PlayerRowContainer")
	var maxDamage = 0
	var localData = Game.GetLocalPlayerInfo()
	_.each(Game.GetAllPlayerIDs(),function(pID){
		maxDamage = Math.max(CustomNetTables.GetTableValue('PlayerData', 'Player_' + pID) != undefined && CustomNetTables.GetTableValue('PlayerData', 'Player_' + pID).AllDamageGame || 0,maxDamage)
	})
	if (m_QueryUnit != -1){
		goldButton.text = FormatGold(GetGold(m_QueryUnit));
	}
	_.each(Game.GetAllPlayerIDs(),function(pID){
		var panel = container.FindChildTraverse('Player_' + pID)
		var data = CustomNetTables.GetTableValue('PlayerData', 'Player_' + pID)
		if (!panel){
			panel = $.CreatePanel('Panel',container,'Player_' + pID)
			panel.BLoadLayoutSnippet('PlayerRow')
			panel.FindChildTraverse('PlayerAvatar').steamid = Game.GetPlayerInfo(pID).player_steamid
			panel.FindChildTraverse('PlayerName').text = Players.GetPlayerName( pID )
			panel.style.transform = 'none';
			panel.style.borderLeftColor = GetHEXPlayerColor(pID)
			panel.FindChildTraverse('PlayerAvatar').style.borderColor = GetHEXPlayerColor(pID)
		}
		panel.SetHasClass('Premium_1', data.IsDonator == 1)
		panel.SetHasClass('Premium_2', data.IsDonator == 2)
		panel.SetHasClass('Premium_3', data.IsDonator == 3)
		var towerData = data.amountTower.split('/')
		panel.FindChildTraverse('Avatar').SetHasClass('IsDisconnect',Game.GetPlayerInfo(pID).player_connection_state >= DOTAConnectionState_t.DOTA_CONNECTION_STATE_DISCONNECTED)
		// panel.SetDialogVariable('towerAmount', towerData[0])
		// panel.SetDialogVariable('towerMax', towerData[1])
		var panelWidth = panel.FindChildTraverse('ProgressBarDamageAllPlayer')
		var pct = maxDamage == 0 
		? 100
		: Math.max((Number(data.AllDamageGame)/Number(maxDamage)) * 100,9.3).toFixed(8)
		panelWidth.style.width = pct + '%';
		panel.FindChildTraverse('kills').text = Players.GetLastHits(pID)
		panel.FindChildTraverse('DamageAll').text = FormatGold(CustomNetTables.GetTableValue('PlayerData', 'Player_' + pID).AllDamageGame)
	})
	var playerIndex = localData.player_selected_hero_entity_index
	var physical = Entities.GetAbilityByName( playerIndex, 'ability_bonus_physical_damage' )
	var magical = Entities.GetAbilityByName( playerIndex, 'ability_bonus_magical_damage' )
	var aegis = Entities.GetAbilityByName( playerIndex, 'ability_bonus_life' )



	var completion = Math.max(Abilities.GetCooldown( physical ),1) < 1 || Abilities.GetCooldownTimeRemaining( physical ) <= 0 
			? 0
			: Math.max( 0, 360 * (Abilities.GetCooldownTimeRemaining(physical ) / Math.max(Abilities.GetCooldown( physical ),1)) );

	PhysicalRuneMask.style.clip = "radial(50% 50%, "+ -completion +"deg, " + completion + "deg)";
	 


	completion = Math.max(Abilities.GetCooldown( magical ),1) < 1 || Abilities.GetCooldownTimeRemaining( magical ) <= 0 
			? 0
			: Math.max( 0, 360 * (Abilities.GetCooldownTimeRemaining(magical ) / Math.max(Abilities.GetCooldown( magical ),1)) );
 	
 	MagicalRuneMask.style.clip = "radial(50% 50%, "+ -completion +"deg, " + completion + "deg)";
	


	completion = Math.max(Abilities.GetCooldown( aegis ),1) < 1 || Abilities.GetCooldownTimeRemaining( aegis ) <= 0 
			? 0
			: Math.max( 0, 360 * (Abilities.GetCooldownTimeRemaining(aegis ) / Math.max(Abilities.GetCooldown( aegis ),1)) );
 	LifeRuneMask.style.clip = "radial(50% 50%, "+ -completion +"deg, " + completion + "deg)";

}

function AutoUpdateHud(){
	$.Schedule(1/80,AutoUpdateHud) 
	if (Game.IsGamePaused()) return
	AutoUpdatePlayerData();
	var dotaTime = Game.GetDOTATime(false,false)
	var gs = CustomNetTables.GetTableValue("PlayerData", "GLOBAL_SETTING")
	if ( Game.GetState() == DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS && $('#TimerRing').value < $('#TimerRing').max){
		var time = gs.PickTime
		if (time && time != -1){
			$('#TimerRing').value = dotaTime
			$('#TimerRing').max = time
			$('#TimeNumber').text = Math.max(time - Math.floor($('#TimerRing').value),0)
			if (time < dotaTime)
				OnUpdateModeAndDifficulty()
			$.GetContextPanel().FindChildTraverse('DifficultyGamePlayer').SetHasClass('Invisible',time < Game.GetDOTATime(false, false))
		}
	}
	infinityIcon.SetHasClass('Visible', gs.RoundNumber > 80)
	roundLabel.text = gs.RoundNumber
	var customShop = $("#CustomShop")
	var playerData = CustomNetTables.GetTableValue('PlayerData', 'Player_' + GetPlayerID())
	ChestTimeAlive.SetHasClass('Visible', playerData.ChestSpawnTime > 0 && playerData.ChestSpawnTime - dotaTime > 0)
	ChestTimeAlive.SetDialogVariable('time_gold_chest', Math.max((playerData.ChestSpawnTime - dotaTime),0).toFixed(2))
	RoundBoard.SetHasClass('Visible', playerData.Difficulty != 6)
	if (customShop){
		var crystal = playerData.Crystal
		customShop.FindChildTraverse('CrystalCount').text = crystal
		var container = customShop.FindChildTraverse('ShopContainer')
		_.each(container.Children(),function(child){
			child.enabled = child.crystalCost <= crystal
		})	
	}
	var modeIndex = playerData.mode || 1
	var dataMode = {
		1:'GAMEMODE_NORMAL',
		2:'GAMEMODE_ENDLESS', 
	}
	var runes = playerData.runes
	$.GetContextPanel().SetDialogVariable('Mode', $.Localize(dataMode[modeIndex]))
	$('#PhysicalRune').enabled = runes.physical_rune > 0
	$('#MagicalRune').enabled = runes.magical_rune > 0
	$('#LifeRune').enabled = runes.life_rune > 0
	$.GetContextPanel().SetDialogVariable('rune_damage_count', runes.physical_rune)
	$.GetContextPanel().SetDialogVariable('rune_magical_count', runes.magical_rune)
	$.GetContextPanel().SetDialogVariable('rune_life_count', runes.life_rune)
	if (gs.RoundNumber > 80) 
		$.GetContextPanel().SetDialogVariable('Mode', 'ENDLESS')
	var questData = playerData.Quests;
	var dailyQuests = playerData.DailyQuests;
	for (var questIndex in questData){
		var data = questData[questIndex]	
		var parent =  ContainerQuest.FindChildTraverse('quest_' + questIndex);
		if (!parent) continue;
		var IsLose = data.tQuestProgress.bLose == 1;
		var IsSucces = data.tQuestProgress.bSucces == 1;
		var progressBar = parent.FindChildTraverse('ProgressBarQuest');
		parent.SetHasClass('IsComplete',IsSucces)
		parent.SetHasClass('IsLose',IsLose)
		var bonusType = data.sDropType;
		parent.SetDialogVariable('descriptionQuest', $.Localize(data.sDescription).replace('{target}',$.Localize(data.sTarget)) + "\n " + (FormatGold(data.tQuestProgress.iValue) + " / " + FormatGold(data.tQuestProgress.iMaxValue)));
		progressBar.max = data.tQuestProgress.iMaxValue;
		progressBar.value = data.tQuestProgress.iValue;
	}

	var ShopSlots = CustomNetTables.GetTableValue("PlayerData", "GLOBAL_SETTING").SHOP_DATA
	for (var questIndex in dailyQuests){
		var data = dailyQuests[questIndex]	
		var parent =  dailyQuest.FindChildTraverse('quest_daily_' + questIndex);
		if (!parent) continue;
		var progress = data.Progress;
		var IsLose = progress.lose == 1;
		var IsSucces = progress.succes == 1;
		var dataItem = ShopSlots[data.drop];
		parent.SetHasClass('IsComplete',IsSucces)
		parent.SetHasClass('IsLose',IsLose)	
		parent.SetDialogVariable('drop', data.dropType != 'courier' ? data.drop : '')
		parent.SetDialogVariable('descriptionQuest', $.Localize('quest_daily_' + questIndex) + "\n " + (progress.value + " / " + progress.max));
		var progressBar = parent.FindChildTraverse('ProgressBarQuest')
		progressBar.max = progress.max;
		progressBar.value = progress.value;
	}
	CoinsContainer.SetDialogVariable('Coins', playerData.Coins)

}
function OnMouseOverDifficul(panel){
	return function(){
		var lvlbattlepass = GetXpAndOst().Level
		if (lvlbattlepass < 5 && panel.GetParent().id == 'hell'){
			$.DispatchEvent("DOTAShowTextTooltip", panel, 'UI_NEED_LEVEL_BATTLE_PASS');
			return
		}
		if (panel.GetParent().id == 'sandbox'){
			$.DispatchEvent("DOTAShowTextTooltip", panel, 'Difficuilt_tooltip_sandbox');
			return 
		}
		sendData =  'name=' + panel.GetParent().id
		$.DispatchEvent("UIShowCustomLayoutParametersTooltip", panel, "DifficuilTooltip", "file://{resources}/layout/custom_game/tooltips/DifficuilTooltip.xml", sendData)
	}
}
  
function OnMouseOutDifficul(panel){
	return function(){
		var lvlbattlepass = GetXpAndOst().Level
		if ((lvlbattlepass < 5 && panel.GetParent().id == 'hell') || panel.GetParent().id == 'sandbox'){
			$.DispatchEvent("DOTAHideTextTooltip");
			return
		}
		$.DispatchEvent("UIHideCustomLayoutTooltip", panel, "DifficuilTooltip");
	}
}

function OnPickDifficuilt(panel){
	return function(){
		var dataNumbers = {
				'simple':1,
				'normal':2,
				'hard':3,
				'impossible':4,
				'hell':5,
				'sandbox':6,
		} 
		GameEvents.SendCustomGameEventToServer('OnPickDiff', {
			pickDiff:dataNumbers[panel.GetParent().id.toLowerCase()],
		})
		_.each($('#ContainerDiff').Children(),function(child){
			child.SetHasClass('IsPickDiff',child.id == panel.GetParent().id)
		})
		_.each($('#ContainerDiffRow2').Children(),function(child){
			child.SetHasClass('IsPickDiff',child.id == panel.GetParent().id)
		})
		pickdiff.SetHasClass('hidden', !pickdiff.BHasClass('hidden'))
		openNew.SetHasClass('Visible', !openNew.BHasClass('Visible'))
		toggle1.SetHasClass('IsOpen', !pickdiff.BHasClass('hidden'))
		toggle2.SetHasClass('IsOpen', openNew.BHasClass('Visible'))
		toggle3.SetHasClass('IsOpen', false)
	}
}
 
function IsTooltipOpen(){
	return 	!$("#IsTooltipOpen").checked
}

function IsAnimationCards(){
	return 	$("#IsAnimationCards").checked
}

function UpdateDifficultyTooltip(){
	var parent = $('#PickDifficulty') 
	var sandbox = parent.FindChildTraverse('sandbox').FindChildTraverse('BlockInfoDifficulty')
	var simple = parent.FindChildTraverse('simple').FindChildTraverse('BlockInfoDifficulty')
	var normal = parent.FindChildTraverse('normal').FindChildTraverse('BlockInfoDifficulty')
	var hard = parent.FindChildTraverse('hard').FindChildTraverse('BlockInfoDifficulty')
	var impossible = parent.FindChildTraverse('Impossible').FindChildTraverse('BlockInfoDifficulty')
	var hell = parent.FindChildTraverse('hell').FindChildTraverse('BlockInfoDifficulty')

	simple.SetPanelEvent( "onmouseover", OnMouseOverDifficul(simple));  
	simple.SetPanelEvent( "onmouseout",OnMouseOutDifficul(simple));
	simple.SetPanelEvent('onactivate', OnPickDifficuilt(simple));

	normal.SetPanelEvent( "onmouseover", OnMouseOverDifficul(normal));  
	normal.SetPanelEvent( "onmouseout",OnMouseOutDifficul(normal));
	normal.SetPanelEvent('onactivate', OnPickDifficuilt(normal));

	hard.SetPanelEvent( "onmouseover", OnMouseOverDifficul(hard));  
	hard.SetPanelEvent( "onmouseout",OnMouseOutDifficul(hard));
	hard.SetPanelEvent('onactivate', OnPickDifficuilt(hard));

	impossible.SetPanelEvent( "onmouseover", OnMouseOverDifficul(impossible));  
	impossible.SetPanelEvent( "onmouseout",OnMouseOutDifficul(impossible));
	impossible.SetPanelEvent('onactivate', OnPickDifficuilt(impossible));
	
	sandbox.SetPanelEvent( "onmouseover", OnMouseOverDifficul(sandbox));  
	sandbox.SetPanelEvent( "onmouseout",OnMouseOutDifficul(sandbox));
	sandbox.SetPanelEvent('onactivate', OnPickDifficuilt(sandbox));
	 
	hell.SetPanelEvent( "onmouseover", OnMouseOverDifficul(hell));     
	hell.SetPanelEvent( "onmouseout",OnMouseOutDifficul(hell)); 
	hell.SetPanelEvent('onactivate', OnPickDifficuilt(hell))	
	parent.FindChildTraverse('hell').enabled = GetXpAndOst().Level >= 5
	hell.enabled = true
}
function OnOpenVideo(parent){
	var parents = $("#" + parent).FindChildTraverse('StepMovieContainer')
	parents.BCreateChildren('<MoviePanel  id="VideoPanel" class="VideoPanel" src="file://{resources}/videos/' + parent + '.webm" controls="none" repeat="true" autoplay="onload"  />');
}

function OnDeleteVideo(parent){
	var parents = $("#" + parent).FindChildTraverse('VideoPanel')
	if (parents){
		parents.DeleteAsync(0)
	}
}

function OnUpdateModeAndDifficulty(){
	var playerData = CustomNetTables.GetTableValue('PlayerData', 'Player_' + GetPlayerID())
	var nameDifficulty = playerData.Difficulty
	questContainer.SetHasClass('Hidden', nameDifficulty == 6)
	sandBoxMenu.SetHasClass('Visible', nameDifficulty == 6)
	$.GetContextPanel().SetDialogVariable('difficulty', $.Localize(dataNumbers[nameDifficulty]))
}

function GameEndPlayer(data){
	var parent = $('#EndScreenPlayer')  
	data = data && data[GetPlayerID()] || null
	var local = (data || {}) || CustomNetTables.GetTableValue('PlayerData', 'Player_' + GetPlayerID())
	if (LengthTable(local.DataEndGame) < 1) return
		$('#EndScreenContainer').AddClass('Visible')
	_.each(Game.GetAllPlayerIDs(),function(pID){
		if (parent.FindChildTraverse('Player_' + pID)) parent.FindChildTraverse('Player_' + pID).DeleteAsync(0)
		var panel = parent.FindChildTraverse('Player_' + pID);
		var dataPI = GetPlayerID() == pID ? local : CustomNetTables.GetTableValue('PlayerData', 'Player_' + pID)
		var playerData = dataPI.DataEndGame
		var IsEnd = LengthTable(playerData) > 0
		if (!IsEnd)
			playerData = {
				'round':'???',
				'endlessRound':'???',
				'damage':'???',
				'gold':'???',
				'crystal':'???',
				'allDamage':'???', 
				'rank':'???',
				'ExpBonus':'???',
			}
		playerData.allDamage = playerData.allDamage != '???' ? FormatGold(playerData.allDamage) : playerData.allDamage
		playerData.gold = playerData.gold != '???' ? FormatGold(playerData.gold) : playerData.gold
		playerData.crystal = playerData.crystal != '???' ? FormatGold(playerData.crystal) : playerData.crystal
		panel = $.CreatePanel('Panel',parent,'Player_' + pID);
		panel.BLoadLayoutSnippet('RowEndScreen');
		panel.FindChildTraverse('SpinnerInGame').SetHasClass('Visible', !IsEnd);
		panel.FindChildTraverse('PlayerRow').SetHasClass('Hidden', !IsEnd);
		panel.SetDialogVariable('round', playerData.round);
		panel.SetDialogVariable('rank', playerData.rank)
		panel.SetDialogVariable('endless_round', playerData.endlessRound);
		panel.SetDialogVariable('damage', playerData.allDamage);
		panel.SetDialogVariable('player_name', Players.GetPlayerName(pID));
		panel.SetDialogVariable('gold', playerData.gold);
		panel.SetDialogVariable('crystal_drop', playerData.crystal);
		var pb = panel.FindChildTraverse('ProgressBarPlayerDeath')
		var dataXp = GetXpAndOst(pID);
		pb.value = Number(dataXp.Exp);
		pb.max = dataXp.ExpMax;
		var amount = !IsEnd  ? dataPI.Experience : Math.max(pb.value - playerData.ExpBonus,0)
		pb.SetDialogVariable('value', amount + ' + ( ' + playerData.ExpBonus + ' ) ')
		pb.SetDialogVariable('max_lvl', pb.max)
		var hex = GetHEXPlayerColor(pID);
		panel.FindChildTraverse('PlayerNameLabel').style.color = hex;
		panel.FindChildTraverse('PlayerAvatarImage').steamid = Game.GetPlayerInfo(pID).player_steamid
		panel.FindChildTraverse('PlayerAvatarImage').style.boxShadow = hex + " 0px 0px 4px 0px"; 
		var index = 0;
		var Slots = playerData.CardsData
		if (IsEnd)
			_.each(panel.FindChildTraverse('TowerSlots').Children(),function(child){
				index++ 
				if (!Slots[index]) return
				var index2 = index
				var data = Slots[index]
				var unitName = data.cardName
				var panelSlot = $.CreatePanel('Image',child,'tower_' + index)
				var baseDataUnit = CustomNetTables.GetTableValue("CardInfoUnits", unitName);
				var prototypeUnit = baseDataUnit.prototype_model || unitName
				panelSlot.style.border = "1px solid " + colors[data.rarity]
				panelSlot.SetImage('file://{images}/heroes/' + prototypeUnit + '.png')
				child.SetPanelEvent('onmouseover', function(){
					$.DispatchEvent("UIShowCustomLayoutParametersTooltip", child, "TooltipTower", "file://{resources}/layout/custom_game/tooltips/TooltipTower.xml", "index=" + index2 + "&PlayerID=" + pID)
				})  
				child.SetPanelEvent( "onmouseout",function(){
					$.DispatchEvent("UIHideCustomLayoutTooltip", child, "TooltipTower");
				});
			})
	})
}
   
function SetGlobalSetting(){
	var nettables = CustomNetTables.GetTableValue("PlayerData", "GLOBAL_SETTING")
	var context = $.GetContextPanel()

	$('#ArrowOpenStatic').SetPanelEvent('onactivate', function(){
		$('#TowersDamage').SetHasClass('hidden', !$('#TowersDamage').BHasClass('hidden'))
	})
	if ($.GetContextPanel().FindChildTraverse('DifficultyGamePlayer')){
		var time = nettables.PickTime
		$.GetContextPanel().FindChildTraverse('DifficultyGamePlayer').SetHasClass('Invisible',time < Game.GetDOTATime(false, false))
	}
} 
function OnRightClickShop(panel){
	return function(){
		GameEvents.SendCustomGameEventToServer('OnBuyGodness', {
			Crystal:panel.crystalCost,
			CardName:panel.itemname,
		})
	}	
}
var QUEST_FOR_BATTLE_KILL_COUNT = 0
var QUEST_FOR_BATTLE_ALIVE_ROUND = 1
var QUEST_FOR_BATTLE_KILL_GODNESS_BY_NAME = 2
var QUEST_FOR_BATTLE_DAMAGE_CHEST = 3
var QUEST_FOR_BATTLE_KILL_MINI_BOSS_COUNT = 4
var QUEST_FOR_BATTLE_USE_XP_BOOK = 5
var QUEST_FOR_BATTLE_SPEND_CRYSTAL = 6
var QUEST_FOR_BATTLE_SPEND_GOLD = 7
var QUEST_FOR_BATTLE_ROUND_PER_NO_DAMAGE = 8
var QUEST_FOR_BATTLE_UPGRADE_TOWER_GRADE = 9
var QUEST_FOR_BATTLE_REMOVE_SHIELD_ENEMY_COUNT = 10
var QUEST_FOR_BATTLE_HEALING_TOWER_ITEMS = 11

var ContainerQuest = $('#QuestInfoContainer')
function UpdateQuestion(){
	var container = ContainerQuest
	container.RemoveAndDeleteChildren(); 
	var PlayerData = CustomNetTables.GetTableValue('PlayerData', 'Player_' + GetPlayerID())
	var questData = PlayerData.Quests;
	var dailyData = PlayerData.DailyQuests;
	for (var questIndex in questData){
		var data = questData[questIndex]	
		var bonusType = data.sDropType;
		var createImg = bonusType == 'card' 
		? '<DOTAItemImage itemname="' + data.aValueDropSucces + '" style="width:51px; height:35px;" />'
		: '<Panel class="' + bonusType + '" scalling="stretch-to-fit-preserve-aspect" />'
		var bonus = String(data.aValueDropSucces).indexOf('item_card') == 0 ? '' : 'Reward: ' + data.aValueDropSucces
		var parent =  $.CreatePanel('Panel',container,'quest_' + questIndex )
		parent.BLoadLayoutSnippet('QuestRow'); 
		parent.FindChildTraverse('IconDrop').BCreateChildren(createImg);
		parent.SetDialogVariable('descriptionQuest', $.Localize(data.sDescription) + "\n " + (data.tQuestProgress.iValue + " / " + data.tQuestProgress.iMaxValue));
		parent.SetDialogVariable('drop', bonus);
		var progressBar = parent.FindChildTraverse('ProgressBarQuest')
		progressBar.max = data.tQuestProgress.iMaxValue;
		progressBar.value = data.tQuestProgress.iValue;
	}
	var ShopSlots = CustomNetTables.GetTableValue("PlayerData", "GLOBAL_SETTING").SHOP_DATA
	dailyQuest.RemoveAndDeleteChildren() 
	for (var index in dailyData){
		var data = dailyData[index];
		var progress = data.Progress;
		var dataItem = ShopSlots[data.drop];
		var itemDef = '';
		var createImg  = data.dropType == 'courier' 
		? '<EconItemImage style="width:56px; height:35px;" id="ImageItemBuy" itemdef="'+ dataItem.Image.replace('itemdef-','') +'" />'
		: '<Panel id="CoinsIcon" scalling="stretch-to-fit-preserve-aspect" />'
		var parent =  $.CreatePanel('Panel',dailyQuest,'quest_daily_' + index );	
		parent.BLoadLayoutSnippet('QuestRow');
		parent.FindChildTraverse('IconDrop').BCreateChildren(createImg);
		parent.SetDialogVariable('drop', data.dropType != 'courier' ? data.drop : '')
		parent.SetDialogVariable('descriptionQuest', $.Localize('quest_daily_' + index) + "\n " + (progress.value + " / " + progress.max));
		var progressBar = parent.FindChildTraverse('ProgressBarQuest')
		progressBar.max = progress.max;
		progressBar.value = progress.value;
	}
	
}
function ToggleQuestContainer(){
	var panel = $('#QuestMainContainer')
	panel.SetHasClass('Open', !panel.BHasClass('Open'))
}

function CreateErrorMessage(msg)
{
  var reason = msg.reason || 80;
  if (msg.message){
    GameEvents.SendEventClientSide("dota_hud_error_message", {"splitscreenplayer":0,"reason":reason ,"message":msg.message} );
  }
  else{
    GameEvents.SendEventClientSide("dota_hud_error_message", {"splitscreenplayer":0,"reason":reason} );
  }
}
 
function OpenFunctionsSandBoxSetting(name){
	var container = $('#ContainerMenuSettings')
	_.each(container.Children(),function(child){
		child.SetHasClass('Visible', child.id == name && !child.BHasClass('Visible'))
	})
}
function SearchSandBoxCard(){
	var container = $('#SelectionCardSandBox')
	var text = $('#SearchCardSelectionCard').text.toUpperCase()
	_.each(container.Children(),function(child){
		child.SetHasClass('Hidden',$.Localize(child.id).toUpperCase().indexOf(text) == -1)
	})
}
function UpdateSandBoxSelectionCard(){
	var container = $('#SelectionCardSandBox')
	container.RemoveAndDeleteChildren()
	var allCard = CustomNetTables.GetAllTableValues('CardInfoUnits');
	for (var data of allCard){
		var cardName = data.key
		var cardData =  data.value
		var parent =  $.CreatePanel('Panel',container,cardName )
		parent.BLoadLayoutSnippet('CardSandBoxSelection'); 
		parent.SetDialogVariable('cardName',$.Localize(cardName))
		var bg = parent.FindChildTraverse('BackgroundSandBoxSelection')
		bg.SetImage("s2r://panorama/images/war_of_kings/cards/" + cardName + ".png")
		bg.SetScaling('stretch-to-cover-preserve-aspect')
		parent.SetPanelEvent('onactivate', OnEventSandBox({
			card_name:parent.id,
			typeEvent:1,
		}))
	}
	var simple = $('#SimpleSandBoxPick')
	var normal = $('#NormalSandBoxPick')
	var hard = $('#HardSandBoxPick')
	var impossible = $('#ImpossibleSandBoxPick')
	var hell = $('#HellSandBoxPick')
	simple.SetPanelEvent('onactivate', OnEventSandBox({
		typeEvent:9,
		type:1,
	}))

	normal.SetPanelEvent('onactivate', OnEventSandBox({
		typeEvent:9,
		type:2,
	}))

	hard.SetPanelEvent('onactivate', OnEventSandBox({
		typeEvent:9,
		type:3,
	}))

	impossible.SetPanelEvent('onactivate', OnEventSandBox({
		typeEvent:9,
		type:4,
	}))

	hell.SetPanelEvent('onactivate', OnEventSandBox({
		typeEvent:9,
		type:5,
	}))
}
 
function OnEventSandBox(data){
	if (typeof(data) != 'object'){
		ServerData = {typeEvent: data}
		if (data == 6){
			var parent = $('#TextEntryRoundPick')
			ServerData = {
				round: Math.abs(Math.min(Number(parent.text == '' ? 1 : parent.text),80)) || 1,
				typeEvent: data,
			}
		}
		GameEvents.SendCustomGameEventToServer('OnCardAddPlayerSandBox', ServerData)
		return
	}
	return function(){
		GameEvents.SendCustomGameEventToServer('OnCardAddPlayerSandBox', data)
	}	
}
// description
var ShopSlotTypes = {
	1:$.Localize('#DOTA_Armory_Category_consumables'),
	2:$.Localize('#DOTA_Armory_Category_premiun'),  
	3:$.Localize('DOTA_Armory_Category_couriers'),
}

var ShopMainContent = $('#MainContents');
var BuyItemContainer = $('#BuyItemContainer');
var BuyButton  = $('#BuyItem');
var saveLastIndex = -1
function OnClickShopMainContent(itemIndex){
	return function(){
		var ShopSlots = CustomNetTables.GetTableValue("PlayerData", "GLOBAL_SETTING").SHOP_DATA
		BuyItemContainer.AddClass('Visible');
		ShopMainContent.AddClass('Hidden');
		var dataItem = ShopSlots[itemIndex];
		saveLastIndex = itemIndex
		var PremiumDaysSelect = BuyItemContainer.FindChildTraverse('SelectionDaysPremium')
		var container = PremiumDaysSelect.FindChildTraverse('PickingDays')
		var days = container.Children()[0] ? container.Children()[0].text : 7;
		PremiumDaysSelect.SetHasClass('Visible', dataItem.type == 2) 
		var costUpdate = dataItem.type == 2 
		? dataItem.cost[days]
		: dataItem.cost;
		BuyItemContainer.SetDialogVariable('costCrown', costUpdate)
		BuyItemContainer.SetDialogVariable('ItemName', dataItem.name)
		var labels = BuyItemContainer.FindChildTraverse('LabelsItem');
		labels.RemoveAndDeleteChildren();
		if (dataItem.Description){
			var panel = $.CreatePanel('Label',labels,'');
			panel.html = true;
			panel.text = 'Wok_plus_plus_description';
			panel.text = panel.text.replace('{s:days}',days)
			for (var description in dataItem.Description[days]){
				var data = dataItem.Description[days][description]
				if (!data) continue;
				var panel = $.CreatePanel('Label',labels,'');
				panel.html = true;
				panel.text = $.Localize('Wok_plus_plus_description_' + description).replace('{value}',data);
			}
		}

		
		BuyButton.SetPanelEvent('onactivate', function(){
			$("#ShopPageContents").AddClass('Deactivate')
			GameEvents.SendCustomGameEventToServer('OnBuyShopItem', {
				index:itemIndex,
				days:dataItem.type == 2 ? (container.Children()[0] ? container.Children()[0].text : 7) : null,
			})
		})
		var img = BuyItemContainer.FindChildTraverse('ImageContainerBuy');
		var itemdef = dataItem.Image.indexOf('itemdef') == 0
		img.RemoveAndDeleteChildren()
		img.BCreateChildren(
			itemdef 
			? '<EconItemImage id="ImageItemBuy" itemdef="'+ dataItem.Image.replace('itemdef-','') +'" />'
			: '<Image id="ImageItemBuy" scaling="stretch-to-cover-preserve-aspect" src="' + dataItem.Image + '"/>');
		img = img.FindChildTraverse('ImageItemBuy');
		if (dataItem.style){
			for (var indexStyle in dataItem.style)
				img.style[indexStyle] = dataItem.style[indexStyle];
		}		
	}
}

function UpdateCostItem(){
	if (saveLastIndex != -1){
		var ShopSlots = CustomNetTables.GetTableValue("PlayerData", "GLOBAL_SETTING").SHOP_DATA
		var dataItem = ShopSlots[saveLastIndex];
		var days = Number(BuyItemContainer.FindChildTraverse('PickingDays').Children()[0].text);
		BuyItemContainer.SetDialogVariable('costCrown', dataItem.cost[days]);

		var labels = BuyItemContainer.FindChildTraverse('LabelsItem');
		labels.RemoveAndDeleteChildren();
		if (dataItem.Description){
			var panel = $.CreatePanel('Label',labels,'');
			panel.html = true;
			panel.text = 'Wok_plus_plus_description';
			panel.text = panel.text.replace('{s:days}',days)
			for (var description in dataItem.Description[days]){
				var data = dataItem.Description[days][description];
				if (!data) continue;
				var panel = $.CreatePanel('Label',labels,'');
				panel.html = true;
				panel.text = $.Localize('Wok_plus_plus_description_' + description).replace('{value}',data);
			}
		}
	}
}

function OnClickCancelBuy(){
	BuyItemContainer.RemoveClass('Visible');
	ShopMainContent.RemoveClass('Hidden');
}

function OnUploadShop(){
	var ShopSlots = CustomNetTables.GetTableValue("PlayerData", "GLOBAL_SETTING").SHOP_DATA
	var container = $("#SearchResults");
	var playerData = CustomNetTables.GetTableValue('PlayerData', 'Player_' + GetPlayerID())
	container.RemoveAndDeleteChildren();
	playerData.IsDev = playerData.IsDev === 1
	playerData.IsTester = playerData.IsTester === 1
	//,' ',playerData.IsTester)
	for (var index in ShopSlots){
		var data = ShopSlots[index];
		if (data.IsBuy === 0 ) continue;
		if (data.IsDebugTester === 1 && (!playerData.IsTester)) continue;
		if (data.IsDebugDev === 1 && !playerData.IsDev) continue;
		var parent = $.CreatePanel('Panel',container,'');
		parent.BLoadLayoutSnippet('ShopSlot');
		parent.indexSearch = data.type;
		parent.indexBuy = index;
		parent.name = data.name; // search Name
		parent.SetDialogVariable('name', data.name);
		parent.SetDialogVariable('ItemTypeLabel', ShopSlotTypes[data.type]);
		parent.SetDialogVariable('CostPurchase', typeof(data.cost) == 'object' ? '???' : data.cost);
		var itemdef = data.Image.indexOf('itemdef') == 0
		var img = parent.FindChildTraverse('ItemImageContainer');
		img.RemoveAndDeleteChildren();
		img.BCreateChildren(
			itemdef 
			? '<EconItemImage id="ItemImageShop" itemdef="'+ data.Image.replace('itemdef-','') +'" />'
			: '<Image id="ItemImageShop" scaling="stretch-to-cover-preserve-aspect" src="' + data.Image + '"/>');
		img = img.FindChildTraverse('ItemImageShop');
		if (data.ImageClass){
			data.ImageClass = data.ImageClass.split(' ');
			for (var className of data.ImageClass)
				img.AddClass(className);
		}
		if (data.style){
			for (var indexStyle in data.style)
				img.style[indexStyle] = data.style[indexStyle];
		}
		parent.SetPanelEvent('onactivate', OnClickShopMainContent(index))
		if (data.Tooltip){
			parent.SetPanelEvent('onmouseover', ShowText(parent,data.Tooltip,data.Tooltip + "_Title"))  
			parent.SetPanelEvent( "onmouseout",HideText(data.Tooltip + "_Title"));
		}
	} 
}
 
function __OnTextEntryChargeShop(){
	var text = $('#SearchTextEntry').text.toUpperCase();
	var container = $("#SearchResults");
	_.each(container.Children(),function(child){
		child.SetHasClass('Hidden2', child.BHasClass('Hidden') || !child.name.toUpperCase().match(text))
	})

}
 
function StoreBrowserSelectCaterogy(index){
	var container = $("#SearchResults");
	_.each(container.Children(),function(child){
		child.SetHasClass('Hidden', index != 0 && child.indexSearch != index)
	})
}
function SelectCourier(indexItem){
	return function(){
		GameEvents.SendCustomGameEventToServer('OnSelectCourier', {
			itemIndex:indexItem,
		})
	}
}
//  kek   
function I__OnLoadInventory__I(){
	var ShopSlots = CustomNetTables.GetTableValue("PlayerData", "GLOBAL_SETTING").SHOP_DATA
	var container = $('#PlayerInventoryServer');
	container.RemoveAndDeleteChildren();
	var inventory = CustomNetTables.GetTableValue('PlayerData', 'Player_' + GetPlayerID()).inventory;
	for (i in inventory){
		var data = inventory[i];
		var itemData = ShopSlots[Number(i)+1];
		var parent;
		if (itemData.type == 3){
			container.BCreateChildren('<RadioButton id="item_'+ i +'" selected="'+ String(data.selected == 1) +'" />')
			parent = container.FindChildTraverse('item_' + i)
			parent.SetPanelEvent('onactivate', SelectCourier(Number(i)+1))
		}else{
			parent = $.CreatePanel('Panel',container,'');
		}
		parent.BLoadLayoutSnippet('InventorySlot');
		parent.FindChildTraverse('ButtonsContainer').SetHasClass('CountBig',data.amount > 1);
		parent.SetDialogVariable('amount', data.amount)
		parent.SetDialogVariable('name', itemData.name)
		parent.SetDialogVariable('ItemTypeLabel', ShopSlotTypes[itemData.type]);
		parent.name_spray = itemData.name;
		var itemdef = itemData.Image.indexOf('itemdef') == 0
		var img = parent.FindChildTraverse('ItemImageContainer');
		img.RemoveAndDeleteChildren();
		img.BCreateChildren(
			itemdef 
			? '<EconItemImage id="ItemImageShop" itemdef="'+ itemData.Image.replace('itemdef-','') +'" />'
			: '<Image id="ItemImageShop" scaling="stretch-to-cover-preserve-aspect" src="' + itemData.Image + '"/>');
		img = img.FindChildTraverse('ItemImageShop');
		if (itemData.ImageClass){
			itemData.ImageClass = itemData.ImageClass.split(' ');
			for (var className of itemData.ImageClass)
				img.AddClass(className);
		}
		parent.SetHasClass('IsUnique',itemData.IsBuy == 0 && i != 13)
		if (itemData.style){
			for (var indexStyle in itemData.style)
				img.style[indexStyle] = itemData.style[indexStyle];
		}
		parent.FindChildTraverse('PurchaseButton').SetPanelEvent('onactivate', SprayItem(parent))
		parent.FindChildTraverse('CancelSpray').SetPanelEvent('onactivate', CancelSpray(parent))
		parent.FindChildTraverse('SprayItem').SetPanelEvent('onactivate', SprayItemEvent(Number(i)+1))
	}
}
function SprayItemEvent(index){
	return function(){
		GameEvents.SendCustomGameEventToServer('OnSprayItem', {
			itemIndex:index,
		})
	}
}
function CancelSpray(panel){
	return function(){
		panel.RemoveClass('IsOpenSpray')
	}
}
function SprayItem(panel){
	return function(){
		panel.AddClass('IsOpenSpray')
		panel.FindChildTraverse('CheckSpray').SetDialogVariable('name_spray', panel.name_spray)
	}
}

function GetXpMaxLvl(lvl){
	return 35 * lvl;
}

function GetXPByLevelUp(lvl){
	var xp = 35;
	for (i = 2; i <= lvl;i++ )
		xp += GetXpMaxLvl(i);
	return xp;
	// return Math.abs(GetXpMaxLvl(lvl) - CustomNetTables.GetTableValue("PlayerData", "player_" + (pID || GetPlayerID())).Experience)
}

function GetAllXp(pID){
	return Number(CustomNetTables.GetTableValue("PlayerData", "player_" + (pID || GetPlayerID())).Experience);
}

function GetNeedXpByLevelUp(lvl,pID){
	lvl = lvl || GetLevelByXp(GetAllXp(pID))
	return GetXpByLevelUp(lvl) - GetAllXp(pID);
}

function GetTotalEarnedXP(pID){
	return GetCurrentXp(null,pID) + GetNeedXpByLevelUp(null,pID)
}


function GetCurrentXp(myXp,pID){
	var xp = myXp || GetAllXp(pID)
	var i = 0
	while (true) {
		i = i + 1;
		var add = MaxXpByLevel(i)
		xp = xp - add
		if (xp < 0)
			return xp + add
	}
}

function GetLevelByXp(xp){
	var i = 1;
	while (xp > 0) {
		xp = xp - MaxXpByLevel(i)
		if (xp >= 0)
			i++;
	}
	return i
}
 
function MaxXpByLevel(lvl){
	return Math.floor(35 + (35 * 0.15 * lvl))

}

function GetXpByLevelUp(lvl){
	var xp = 0;
	for (var i = 1; i <= lvl;++i)
		xp = xp + MaxXpByLevel(i);
	return xp;
}

function GetXpAndOst(pID){
	var xp = GetAllXp(pID)
	return {
		Level:GetLevelByXp(xp),
		Exp:GetCurrentXp(null,(pID || GetPlayerID())),
		ExpMax: GetTotalEarnedXP(pID),
	}
}

function UploadRanking(){
	var container1 = $("#Ranking_global_impossible")
	var container2 = $("#Ranking_global_hell")
	var container3 = $("#Ranking_friends_impossible")
	var container4 = $("#Ranking_friends_hell")
	container1.RemoveAndDeleteChildren()
	container2.RemoveAndDeleteChildren()
	container3.RemoveAndDeleteChildren()
	container4.RemoveAndDeleteChildren()
	var data = {
		global:CustomNetTables.GetTableValue("PlayerData", "GLOBAL_SETTING").LeaderboardGlobal,
		friends:CustomNetTables.GetTableValue("PlayerData", "player_" + GetPlayerID()).FriendLeaderboard,
	}
	var data2 = {
		global:{
			1:[],
			2:[],
		},
		friends:{
			1:[],
			2:[],
		},
	}
	for (var i in data.global[1]){
		var dataPlayer = {
			SteamID:i,
			data:data.global[1][i],
		}
		data2.global[1].push(dataPlayer)
	}
	for (var i in data.global[2]){
		var dataPlayer = {
			SteamID:i,
			data:data.global[2][i],
		}
		data2.global[2].push(dataPlayer)
	}

	for (var i in data.friends[1]){
		var dataPlayer = {
			SteamID:i,
			data:data.friends[1][i],
		}
		data2.friends[1].push(dataPlayer)
	}
	for (var i in data.friends[2]){
		var dataPlayer = {
			SteamID:i,
			data:data.friends[2][i],
		}
		data2.friends[2].push(dataPlayer)
	}
	data2.global[1].sort(function(a,b){return a.data.roundAlive < b.data.roundAlive 
		? 1 
		: a.data.roundAlive > b.data.roundAlive
			? -1
			: 0 })
	data2.global[2].sort(function(a,b){return a.data.roundAlive < b.data.roundAlive 
		? 1 
		: a.data.roundAlive > b.data.roundAlive
			? -1
			: 0 })

	data2.friends[1].sort(function(a,b){return a.data < b.data ? 1 : a.data > b.data ? -1 : 0})
	data2.friends[2].sort(function(a,b){return a.data < b.data ? 1 : a.data > b.data ? -1 : 0})

	var index1 = 1;
	var index2 = 1;
	for (var mode in data2['global']){
		var dataRank = data2['global'][mode];
		for (var steamid2 in dataRank){
			var steamid = dataRank[steamid2].SteamID
			var playerRankData = dataRank[steamid2].data;
			var rank = mode == 1 
			? index1
			: index2;
			var parent = $.CreatePanel('Panel',mode == 1 
				? container1
				: container2,'')
			parent.AddClass('Premium_' + data.friends['DonateLevel'][steamid])
			parent.BLoadLayoutSnippet('player_row_leaderboards')
			parent.SetDialogVariable('round_alive', playerRankData.roundAlive)
			parent.FindChildTraverse('PlayerImageLeader').steamid = steamid;
			parent.FindChildTraverse('PlayerLeader').BCreateChildren('<DOTAUserName steamid="' + steamid + '" id="PlayerNameLabel" />')
			parent.FindChildTraverse('PlayerNameLabel').steamid = steamid; 
			parent.FindChildTraverse('LeaderRankContainer').BCreateChildren( rank <= 3
			? '<Panel id="LeaderIcon" class="leader_'+ (rank) + '" />'
			: '<Label text="'+ rank +'" />')
			if (mode == 1)
				index1++;
			if (mode == 2)
				index2++;
		}
	}
	var index1 = 1;
	var index2 = 1;
	for (var mode in data2['friends']){
		var dataRank = data2['friends'][mode];
		for (var steamid2 in dataRank){
			var steamid = dataRank[steamid2].SteamID

			var playerRankData = dataRank[steamid2].data;
			var rank = mode == 1 
			? index1
			: index2;
			var parent = $.CreatePanel('Panel',mode == 1 
				? container3
				: container4,'') 
			parent.AddClass('Premium_' + data.friends['DonateLevel'][steamid])
			parent.BLoadLayoutSnippet('player_row_leaderboards')
			parent.SetDialogVariable('round_alive', playerRankData)
			parent.FindChildTraverse('PlayerImageLeader').steamid = steamid;
			parent.FindChildTraverse('PlayerLeader').BCreateChildren('<DOTAUserName steamid="' + steamid + '" id="PlayerNameLabel" />')
			parent.FindChildTraverse('PlayerNameLabel').steamid = steamid; 
			parent.FindChildTraverse('LeaderRankContainer').BCreateChildren( rank <= 3
			? '<Panel id="LeaderIcon" class="leader_'+ (rank) + '" />'
			: '<Label text="'+ rank +'" />')
			if (mode == 1)
				index1++;
			if (mode == 2)
				index2++;
		}
	}
}


function OnUpdateQueryUnit(){
	// var panel = GetDotaHud().FindChildTraverse('stragiint')
	var unit = Players.GetLocalPlayerPortraitUnit();
	var localPlayerID = Game.GetLocalPlayerID();
	m_QueryUnit = Entities.GetPlayerOwnerID(unit);
	if (m_QueryUnit === -1 || Entities.GetTeamNumber(unit) !== Players.GetTeam(localPlayerID)) {
	   m_QueryUnit = localPlayerID;
	}
}


function _UpdateCreepAndHeroes(){
	heroesContainer.RemoveAndDeleteChildren()
	creepContainer.RemoveAndDeleteChildren()
	let nettables = CustomNetTables.GetTableValue('PlayerData', "player_" + GetPlayerID()).BuildingsCardsindexID
	let amount = [0,0]
	for (var i in nettables){
		let proto = GetPrototypeUnitBuilding(i)
		if (!proto) continue
		let IsBuilding = IsCreepBuilding(i)
		amount[IsBuilding ? 1 : 0]++
		let panel = $.CreatePanel('Panel',(!IsBuilding ? heroesContainer : creepContainer),'')
		panel.style.backgroundImage = `url("file://{images}/heroes/${proto}.png")`

	}
	heroesContainer.GetParent().SetDialogVariable('HeroesAmount', amount[0])
	heroesContainer.GetParent().SetDialogVariable('HeroesAmountMax', HEROES_MAX)

	creepContainer.GetParent().SetDialogVariable('CreepAmount', amount[1])
	creepContainer.GetParent().SetDialogVariable('CreepAmountMax', CREEP_MAX)
}

function UpdateDefaultTowerPicker(){
	let allDefault = []

	var dataCard = CustomNetTables.GetAllTableValues('CardInfoUnits')
	for (k in dataCard){
		var dataNettables = dataCard[k];
		var unitName = dataNettables.key;
		var dataUnit = dataNettables.value;
		if (dataUnit.type != 'Starting_towers') continue
		allDefault.push({
			UnitName: unitName,
			lvlNeed:dataUnit.lvl || 0,
			model:dataUnit.prototype_model,
			abilities:dataUnit.BaseStats.Ability,
		});
	} 	
	let Level = GetXpAndOst().Level
	allDefault.sort(function(a,b){
		return a.lvlNeed > b.lvlNeed ? 1 
		: a.lvlNeed < b.lvlNeed ? -1 : 0
	})
	for (let i = 0; i < 18;++i){
		let panel = $(`#hexagon_` + (i + 1))
		panel.enabled = !!allDefault[i]

		if (panel.enabled){
			panel.SetHasClass('Locked',Level < allDefault[i].lvlNeed)
			let childPanel = panel.GetChild(1) 
			childPanel.style.backgroundImage = `url('file://{images}/war_of_kings/CardDefault/${allDefault[i].UnitName}.png')`
			childPanel.style.backgroundSize = "100%";
			panel.__data__ = allDefault[i]
			panel.SetPanelEvent('onactivate', __PickingDefaultTower(panel))
		}
	}
} 

function __PickingDefaultTower(panel){
	return function(){
		let Level = GetXpAndOst().Level
		let data = panel.__data__
		let modelContainer = $("#ModelInfoContainer")
		modelContainer.RemoveAndDeleteChildren()

		modelContainer.BCreateChildren(`<DOTAScenePanel antialias="true" hittest="false" unit="${data.model}" particleonly="false" />`); 
		$("#LockedAndInfo").SetHasClass('Visible', data.lvlNeed > Level)
		$("#LockedAndInfo").GetChild(0).SetDialogVariable('lvl', data.lvlNeed)
		
		let container = $("#AbilityListByHero")
		container.RemoveAndDeleteChildren()

		_.each(data.abilities,function(ability){
			let panelAbility = $.CreatePanel('DOTAAbilityImage',container,'')
			panelAbility.abilityname = ability
			panelAbility.enabled = !panel.BHasClass('Locked')
			panelAbility.SetPanelEvent( "onmouseover", ShowAbilityTooltip(panelAbility));  
			panelAbility.SetPanelEvent( "onmouseout",HideAbilityTooltip(panelAbility));
			if (!panelAbility.enabled)
				$.CreatePanel('Panel',panelAbility,'').AddClass('LockedIcon')
		})

		if (data.lvlNeed <= Level){
			GameEvents.SendCustomGameEventToServer('OnSelectDefaultTower', {
				TowerName:data.UnitName,
			})
		}

	}
}

(function(){ 
	UpdateDefaultTowerPicker()
	_UpdateCreepAndHeroes();
	UploadRanking();
	I__OnLoadInventory__I();
	OnUploadShop();
	UpdateSandBoxSelectionCard();
	UpdateQuestion();
	OnUpdateModeAndDifficulty();
	UpdateDifficultyTooltip();
	AutoUpdateHud();
	GameEndPlayer();
	HidePanel(GetDotaHud().FindChildTraverse('stackable_side_panels'))
	HidePanel(GetDotaHud().FindChildTraverse('CourierControls'))
	GetDotaHud().FindChildTraverse('ShopButton').style.width = "130px"
	UpdateAssemblyPanel();   
	OnUpdateCardSelection();
	UpdateInfoPanel();
	UpdateRoundDamage();
	SetGlobalSetting();
	OnUpdateSelectionButton();
	GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_FLYOUT_SCOREBOARD, false );
	GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_HEROES, false );
	GameUI.SetDefaultUIEnabled( DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_TIMEOFDAY, false );
	$("#SearchResults").RemoveClass('Hidden');
	$("#PlayerInventoryServer").AddClass('Visible');
	toggle1.SetPanelEvent('onactivate', function(){
		pickdiff.SetHasClass('hidden', false)
		openNew.SetHasClass('Visible', false)
		openNew2.SetHasClass('Visible', false)
		toggle1.AddClass('IsOpen')
		toggle2.RemoveClass('IsOpen')
		toggle3.RemoveClass('IsOpen')
	})
	toggle2.SetPanelEvent('onactivate', function(){
		pickdiff.SetHasClass('hidden', true)
		openNew2.SetHasClass('Visible', false)
		openNew.SetHasClass('Visible', true)
		toggle2.AddClass('IsOpen')
		toggle1.RemoveClass('IsOpen')
		toggle3.RemoveClass('IsOpen')
	}) 
	toggle3.SetPanelEvent('onactivate', function(){
		pickdiff.SetHasClass('hidden', true)
		openNew.SetHasClass('Visible', false)
		openNew2.SetHasClass('Visible', true)
		toggle3.AddClass('IsOpen')
		toggle2.RemoveClass('IsOpen')
		toggle1.RemoveClass('IsOpen')
	})
	GameEvents.Subscribe("OnUpdateCards", function(data){
		$('#GlobalBgDark').AddClass('Visible')
		$('#PickedCardContainer').AddClass('Visible')
		OnUpdateCardSelection(data.data);
	});
	GameEvents.Subscribe("OnCreateNewQuests", UpdateQuestion);
	GameEvents.Subscribe("RemoveAndCreateBuilding", _UpdateCreepAndHeroes);
	GameEvents.Subscribe("OnDiscard", function(){
		var container = $('#MainContainerSelectCard')
		container.RemoveAndDeleteChildren()
		$('#PickedCardContainer').RemoveClass('Visible')
		$('#GlobalBgDark').RemoveClass('Visible')
	});
	GameEvents.Subscribe("OnStartRound", function(data){
		$('#StartRoundNotificaton').SetDialogVariable('roundStart', data.round)
		$('#StartRoundNotificaton').SetHasClass('Visible', true)
		$.Schedule(5,function(){    
			$('#StartRoundNotificaton').SetHasClass('Visible', false)
		})
	});
	GameEvents.Subscribe( "cont_create_error_message", CreateErrorMessage); 
	GameEvents.Subscribe('OnDeathPlayer', GameEndPlayer)
	GameEvents.Subscribe("OnRoundEnd", function(){
		UpdateRoundDamage();
	});
	GameEvents.Subscribe('OnRequest', function(){
		OnUploadShop();
		OnUpdateSelectionButton();
		UpdateDifficultyTooltip();
		UploadRanking();
	})
	GameEvents.Subscribe('OnBuyReturnInfo', function(data){
		NotifyServerContainer.SetDialogVariable('NotifyServerContainer', data.error 
			? $.Localize('error_server_' + data.error)
			: 'succes')
		NotifyServerContainer.AddClass('Visible');
		$("#ShopPageContents").RemoveClass('Deactivate');
		OnClickCancelBuy();
		if ( data.IsShopUpdate == 1 )
			I__OnLoadInventory__I();
		$.Schedule(data.error && 4 || 1,function(){	
			NotifyServerContainer.RemoveClass('Visible');
		})
	})
	GameEvents.Subscribe('OnSuccesQuest', function(){
		I__OnLoadInventory__I();
	})

	GameEvents.Subscribe('OnEndlessMode', function(){
		$("#EndlessModeOn").AddClass('Visible');
		$.Schedule(3,function(){
			$("#EndlessModeOn").RemoveClass('Visible');
		})
	}) 
	var tooltipHover = GetDotaHud().FindChildTraverse('stats_tooltip_region')
	tooltipHover.SetPanelEvent('onmouseover', function(){
		$.DispatchEvent("UIShowCustomLayoutParametersTooltip", tooltipHover, "TooltipArmorDamageCustom", 
			"file://{resources}/layout/custom_game/tooltips/TooltipunitDamageArmor3.xml", "")
	})  
	tooltipHover.SetPanelEvent( "onmouseout",function(){
		$.DispatchEvent("UIHideCustomLayoutTooltip", tooltipHover, "TooltipArmorDamageCustom");
	});

	var heroesSelling = CustomNetTables.GetTableValue("PlayerData", "GLOBAL_SETTING").CUSTOM_SHOP_DATA.GodnessHeroes
	var container = $('#CustomShop').FindChildTraverse('ShopContainer')
	container.RemoveAndDeleteChildren() 
	for (name in heroesSelling){ 
		var dataHero = heroesSelling[name];
		var panel = $.CreatePanel('DOTAItemImage',container,'');
		panel.crystalCost = dataHero.crystalCost;
		panel.SetScaling('stretch-to-cover-preserve-aspect');
		panel.itemname = name;
		panel.SetPanelEvent('onmouseactivate', OnRightClickShop(panel))
		var labelContainer = $.CreatePanel('Panel',panel,'CrystalBgItem');
		$.CreatePanel('Label',labelContainer,'').text = dataHero.crystalCost;
		$.CreatePanel('Panel',labelContainer,'CrystalIcon');
	}
	GameEvents.Subscribe('dota_player_update_query_unit', OnUpdateQueryUnit);
	GameEvents.Subscribe('dota_player_update_selected_unit', OnUpdateQueryUnit);
})(); 