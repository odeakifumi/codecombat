var base = this;
base.force=function(p,r,g){
    var yajirushi=Vector.subtract(r,p);
    var kyori    =yajirushi.magnitude();
    return Vector.multiply(Vector.normalize(yajirushi),g/(kyori*kyori)*1500);
    
};
var peons = base.getByType('peon');
for (var peonIndex = 0; peonIndex < peons.length;peonIndex++) {
    var peon = peons[peonIndex];
    var force=new Vector(0,0);
    var items=base.getItems();
    for (var itemIndex=0;itemIndex<items.length;itemIndex++) {
        var item=items[itemIndex];
        force=Vector.add(force,base.force(peon.pos, item.pos,item.bountyGold));
    }
    for (var peonIndex2 = 0; peonIndex2 < peons.length; peonIndex2++){
        if (peonIndex===peonIndex2)
            continue;
        var peon2 = peons[peonIndex2];
        force=Vector.add(force,base.force(peon2.pos, peon.pos,1));
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
    base.peon = 0;
} 
var teki=base.getEnemies();
if (base.joutai===1){
    if(base.gold>=100)base.joutai=2;
}
if (base.joutai === 1||base.joutai===3) {
    for(var i=0;i<teki.length;i++){
        if(teki[i].type!='peasant'&&teki[i].type!='base'){
            base.joutai=4;
        }    
    }
}
var type;
base.say(base.joutai);
if (base.joutai===1&&base.peon<6&&base.gold>=50) {
    type='peon';
    base.peon+=1;
}else if (base.joutai===2){
    type='munchkin';
    base.joutai=3;
}else if (base.joutai===4) {
    if (base.gold>=180) {
        base.joutai=5;
        base.kazu=0;
    }
}else if (base.joutai===5) {
    type='ogre';
    base.kazu+=1;
    if (base.kazu===2) {
        base.joutai=6;
        base.kazu=0;
    }
}else if (base.joutai===6) {
    type='shaman';
    base.kazu+=1;
    if (base.kazu===3) {
        base.joutai=7;
        base.kazu=0;
    }
}else if (base.joutai===7) {
    if (base.peon<6) {
        if (base.gold>=50) {
            type='peon';
            base.peon+=1;
            base.joutai=4;    
        }
    }else if (base.kazu<5) {
        if (base.gold>=10) {
            type='munchkin';
            base.kazu+=1;
        }
    }else{
        base.joutai=4;
    }
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
