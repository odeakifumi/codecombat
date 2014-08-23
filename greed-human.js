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
if (!base.joutai) base.joutai = 1;
var teki=base.getEnemies();
if (base.joutai === 1) {
for(var i=0;i<teki.length;i++){
    if(teki[i].type!='peasant'&&teki[i].type!='base'){
        base.joutai=2;
    }    
}
if(base.gold>=200)base.joutai=2;
}
var type;
if (base.built.length < 6) {
    type = 'peasant';
} else if (base.joutai === 2 && base.built.length < 11) {
    type = 'soldier';
} else
if (base.joutai === 2 && base.built.length <12) {
    type = 'griffin-rider';
} else
if (base.joutai === 2 && base.built.length < 6) {
    type = 'librarian';
} else if(base.joutai===2){
    if(!base.jikoku){
        base.jikoku=base.now()+3;
    }
    if(base.jikoku<base.now()){
        base.joutai=3;
    }
}else if (base.joutai === 3 && base.built.length < 6) {
    type = 'soldier';
} else
if (base.joutai === 3 && base.built.length < 220) {
    type = 'librarian';
} else
if (base.joutai === 3) {
    type = 'griffin-rider';
}
if (type && base.gold >= base.buildables[type].goldCost)
    base.build(type);

// 'peasant': Peasants gather gold and do not fight.
// 'soldier': Light melee unit.
// 'knight': Heavy melee unit.
// 'librarian': Support spellcaster.
// 'griffin-rider': High-damage ranged attacker.
// 'captain': Mythically expensive super melee unit.
// See the buildables documentation below for costs and the guide for stats.