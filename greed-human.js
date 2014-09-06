var base = this;
base.force=function(p,r,g){
    var yajirushi=Vector.subtract(r,p);
    var kyori    =yajirushi.magnitude();
    return Vector.multiply(Vector.normalize(yajirushi),g/(kyori*kyori)*1500);
    
};
var peasants = base.getByType('peasant');
for (var peonIndex = 0; peonIndex < peasants.length;peonIndex++) {
    var peon = peasants[peonIndex];
    var force=new Vector(0,0);
    var items=base.getItems();
    for (var itemIndex=0;itemIndex<items.length;itemIndex++) {
        var item=items[itemIndex];
        force=Vector.add(force,base.force(peon.pos, item.pos,item.bountyGold));
    }
    for (var peasantIndex2 = 0; peasantIndex2 < peasants.length; peasantIndex2++){
        if (peonIndex===peasantIndex2)
            continue;
        var peasant2 = peasants[peasantIndex2];
        force=Vector.add(force,base.force(peasant2.pos, peon.pos,1));
    }
    var target=Vector.add(peon.pos,force);
    var target_x = target.x;
    var target_y = target.y;
    if (target_x<0){
        target_x=0;
    }
    if(target_x>85){
        target_x=85;
    }    
    if(target_y<0){
        target_y=0;
    }
    if(target_y>70){
        target_y=70;
    }
    base.command(peon,'move', new Vector(target_x, target_y));
}
if (base.gold>=100&&!base.finished) {
    base.build('soldier');
    base.finished=true;
    return;
}
var character_table={
    'peon':'peasant',
    'munchkin':'soldier',
    'ogre':'knight',
    'shaman':'librarian',
    'fangrider':'griffin-rider',
    'brawler':'captain',
};
var teki=base.getEnemies();

for (var i = teki.length-1; i >=1 ; i--) {
    if (!teki[i].check){
        var type=character_table[teki[i].type];
        if (base.gold>=base.buildables[type].goldCost) {
            base.build(type);
            teki[i].check=true;
        }
    }
}


// 'peasant': Peasants gather gold and do not fight.
// 'soldier': Light melee unit.
// 'knight': Heavy melee unit.
// 'librarian': Support spellcaster.
// 'griffin-rider': High-damage ranged attacker.
// 'captain': Mythically expensive super melee unit.
// See the buildables documentation below for costs and the guide for stats.

// 'peon': Peons gather gold and do not fight.
// 'munchkin': Light melee unit.
// 'ogre': Heavy melee unit.
// 'shaman': Support spellcaster.
// 'fangrider': High damage ranged attacker.
// 'brawler': Mythically expensive super melee unit.
// See the buildables documentation below for costs and the guide for more info.