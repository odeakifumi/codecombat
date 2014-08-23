// This code runs once per frame. Build units and command peasants!
// Destroy the ogre base within 180 seconds.
// Run over 4000 statements per call and chooseAction will run less often.
// Check out the green Guide button at the top for more info.

var base = this;
base.force=function(p,r,g){
    var yajirushi=Vector.subtract(r,p);
    var kyori    =yajirushi.magnitude();
    return Vector.multiply(Vector.normalize(yajirushi),g/(kyori*kyori)*1500);
    
};

/////// 1. Command peasants to grab coins and gems. ///////
// You can only command peasants, not fighting units.
// You win by gathering gold more efficiently to make a larger army.
// Click on a unit to see its API.
var peasants = base.getByType('peon');
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
/////// 2. Decide which unit to build this frame. ///////
// Peasants can gather gold; other units auto-attack the enemy base.
// You can only build one unit per frame, if you have enough gold.
if (!base.joutai) base.joutai = 1;
var teki=base.getEnemies();
if (base.joutai === 1) {
for(var i=0;i<teki.length;i++){
    if(teki[i].type!='peasant'&&teki[i].type!='base'){
        base.joutai=2;
    }    
}
//var teki_base=base.getEnemies()[0];
//if(teki_base.gold+100<base.gold){
//if(base.now()>60){
//    base.joutai=2;
//}
//}
if(base.gold>=200)base.joutai=2;
}
var type;
if (base.built.length < 6) {
    type = 'peon';
} else if (base.joutai === 2 && base.built.length < 11) {
    type = 'munchkin';
} else
if (base.joutai === 2 && base.built.length <12) {
    type = 'fangrider';
} else
if (base.joutai === 2 && base.built.length < 6) {
    type = 'shaman';
} else if(base.joutai===2){
    if(!base.jikoku){
        base.jikoku=base.now()+3;
    }
    if(base.jikoku<base.now()){
        base.joutai=3;
    }
}else if (base.joutai === 3 && base.built.length < 6) {
    type = 'brawler';
} else
if (base.joutai === 3 && base.built.length < 220) {
    type = 'shaman';
} else
if (base.joutai === 3) {
    type = 'fangrider';
}
if (type && base.gold >= base.buildables[type].goldCost)
    base.build(type);







// 'peon': Peons gather gold and do not fight.
// 'munchkin': Light melee unit.
// 'ogre': Heavy melee unit.
// 'shaman': Support spellcaster.
// 'fangrider': High damage ranged attacker.
// 'brawler': Mythically expensive super melee unit.
// See the buildables documentation below for costs and the guide for more info.

