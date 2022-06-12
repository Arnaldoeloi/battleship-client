<template>
  <div class="board">
    <div v-for="(e,x) in 5" :key="x">
      <div v-for="(e,y) in 2" :key="y" class="unit_square" :class="shouldPaintSquare(x,y)?(unitType):null" @click="handleUnitClick"></div>
    </div>
  </div>
</template>

<script>
//Seaplane .-.
//Battleship ---- 
//Submarine -
//AirCarrier -----
//Cruiser --
export default {
  name: 'AvailableUnit',
  data() {
    return {
    }
  },
  props: {
    isPlacingUnits: Boolean,
    unitType: String,

  },
  methods: {
    handleUnitClick: function(){
      console.log('handleUnitClick AvUnit')
        this.$emit('click', this.unitType);    
    },
    shouldPaintSquare(posX, posY){
      if(!this.unitsLayout[this.unitType])return false;
      // console.log('this.unitsLayout[this.unitType]',this.unitsLayout[this.unitType]);
      
      return this.unitsLayout[this.unitType].find((u)=>u.x==posX && u.y==posY);
    }
  },
  computed: {
    unitsLayout: function(){
      return {
        'battleship':[
          {'x':0,'y':0},
          {'x':1,'y':0},
          {'x':2,'y':0},
          {'x':3,'y':0},
        ],
        'aircarrier':[
          {'x':0,'y':0},
          {'x':1,'y':0},
          {'x':2,'y':0},
          {'x':3,'y':0},
          {'x':4,'y':0},
        ],
        'cruiser':[
          {'x':0,'y':0},
          {'x':1,'y':0},
        ],
        'submarine':[
          {'x':0,'y':0},
        ],
        'seaplane':[
          {'x':0,'y':1},
          {'x':1,'y':0},
          {'x':2,'y':1},
        ],
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.invisible {
    visibility: hidden;
}
.board{
  display: grid;
  /* gap: 3px 7px; */
  grid-template-columns: 1rem 1rem 1rem 1rem 1rem;
  padding: 3px;
}
.board .unit_square{
  /* border: 1px solid #a0efff; */
  cursor: pointer;
  width: 1rem;
  height: 1rem;
  padding: 0;
  text-align: center;
  font-size: 0.5rem;
}

.board .cruiser{
  border: 1px solid #a0efff;
  background: #ffb44a;
}
.board .submarine{
  border: 1px solid #a0efff;
  background: #de5b3a;
}
.board .aircarrier{
  border: 1px solid #a0efff;
  background: #f677df;
}
.board .seaplane{
  border: 1px solid #a0efff;
  background: #3ade87;
}
.board .cruiser{
  border: 1px solid #a0efff;
  background: #3a45de;
}
.board .battleship{
  border: 1px solid #a0efff;
  background: #a67cd4;
}

.board .unit_square:hover{
  /* background: #e47b25; */
}

.fire{
  mix-blend-mode: darken;
}

.anchor{
  position: relative;
  bottom: 14px;
}

</style>
