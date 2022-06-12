<template>
  <div class="board">
    <div v-for="(e,x) in 10" :key="x">
      <template v-for="(e,y) in 10" :key="y">
        <div @click="handleUnitClick(x,y)" class="unit_square">  
          <img v-if="getBombAt(x,y)" class="fire" src="@/assets/fire.gif" width="13" alt="">
          <img v-if="getUnitAt(x,y)" class="anchor" src="@/assets/anchor.png" width="13" alt="">
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameBoard',

  data() {
    return {
      // units: [
      //   {
      //     'posX':3,
      //     'posY':3,
      //     'isBombed':false
      //   },
      //   {
      //     'posX':4,
      //     'posY':3,
      //     'isBombed':false
      //   },
      //   {
      //     'posX':5,
      //     'posY':3,
      //     'isBombed':false
      //   }
      // ],
      // receivedBombs: [
      //   {
      //     'posX':5,
      //     'posY':7,
      //     'isWater':false
      //   },
      //   {
      //     'posX':4,
      //     'posY':3,
      //     'isWater':false
      //   },
      //   {
      //     'posX':2,
      //     'posY':9,
      //     'isWater':false
      //   }
      // ],
    }
  },
  props: {
    units: Array, //it will only be available if you are the board owner
    receivedBombs: Array, //will be available for both
  },
  methods: {
    intToChar: function(number) {
      return String.fromCharCode(65 + number);
    },
    handleTempUnitClick: function(unit){
      this.selectedUnit = unit;
      // console.log('selectedUnit', unit)
    },
    handleUnitClick: function(x,y){
      this.$emit('unitClicked',{'posX':x,'posY':y});
      console.log('posX: '+x,"posY: "+y)
    },
    getUnitAt: function(posX, posY){
      const unit = this.units?.find((u)=>u.posX==posX && u.posY == posY)
      const bomb = this.receivedBombs?.find((b)=>b.posX==posX && b.posY == posY && !b.isWater);
      return ((unit || bomb)?(unit?unit:bomb):false)
    },
    getBombAt: function(posX, posY){
      const bomb = this.receivedBombs?.find((u)=>u.posX==posX && u.posY == posY) 
      return (bomb?bomb:false)
    },
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
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.board{
  display: grid;
  /* gap: 3px 7px; */
  grid-template-columns: 1rem 1rem 1rem 1rem 1rem 1rem 1rem 1rem 1rem 1rem;
  padding: 3px;
}
.board .unit_square{
  border: 1px solid #a0efff;
  position: relative;
  /* cursor: pointer; */
  background: #d9f3f8;
  width: 1rem;
  height: 1rem;
  padding: 0;
  text-align: center;
  font-size: 0.5rem;
}

.board .unit_square:hover{
  /* background: #e47b25; */
}
.availableUnitsContainer{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.fire{
  position: absolute;
  mix-blend-mode: darken;
  left:1px;
}

.anchor{
  position: absolute;
  left: 2px;
  /* bottom: 1px; */
}

</style>