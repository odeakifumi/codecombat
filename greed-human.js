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
if (!base.joutai){
    base.joutai = 1;
    base.peasant = 0;
} 
var teki=base.getEnemies();
if (base.joutai===1){
    if(base.gold>=100)base.joutai=2;
}
if (base.joutai === 1||base.joutai===3) {
    for(var i=0;i<teki.length;i++){
        if(teki[i].type!='peon'&&teki[i].type!='base'){
            base.joutai=4;
        }    
    }
}
var type;
base.say(base.joutai);
if (base.joutai===1&&base.peasant<6&&base.gold>=50) {
    type='peasant';
    base.peasant+=1;
}else if (base.joutai===2){
    type='soldier';
    base.joutai=3;
}else if (base.joutai===4) {
    if (base.gold>=100) {
        base.joutai=5;
    }
}else if (base.joutai===5) {
    type='griffin-rider';
    base.joutai=6;
}else if (base.joutai===6) {
    type='librarian';
    base.joutai=7;
    base.kazu=0;
}else if (base.joutai===7) {
    if (base.peasant<6) {
        if (base.gold>=50) {
            type='peasant';
            base.peasant+=1;
            base.joutai=4;    
        }
    }else if (base.kazu<5) {
        if (base.gold>=10) {
            type='soldier';
            base.kazu+=1;
        }
    }else{
        base.joutai=4;
    }
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