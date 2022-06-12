<template>
  <div class="board">
    <div v-for="(e,x) in 10" :key="x">
      <template v-for="(e,y) in 10" :key="y">
        <div @click="handleUnitClick(x,y)" class="unit_square">
            <img v-if="getUnitAt(x,y)" class="anchor" src="@/assets/anchor.png" width="13" alt="">  
        </div>
      </template>
    </div>
  </div>
  <span v-if="selectedUnit">Placing {{ selectedUnit }}</span>
  <div class="availableUnitsContainer" v-for="avUnit in availableUnits" :key="avUnit">
    <AvailableUnit :unitType="avUnit" @click="handleAvailableUnitClick(avUnit)"/>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import AvailableUnit from './AvailableUnit.vue'
export default {
  name: 'UnitSetter',
  components:{
    AvailableUnit
  },
  data() {
    return {
      selectedUnit: null,
      availableUnits: [
        'aircarrier', 
        'submarine',
        'submarine',
        'submarine',
        'submarine',
        'cruiser',
        'cruiser',
        'cruiser', 
        'seaplane', 
        'seaplane', 
        'seaplane', 
        'battleship', 
        'battleship', 
      ],
      units: [],
    }
  },
  props: {
    isPlacingUnits: Boolean,
    // tempUnits:Array, //to register the units
    // units: Array, //it will only be available if you are the board owner
    // receivedBombs: Array, //will be available for both
  },
  methods: {
    intToChar: function(number) {
      return String.fromCharCode(65 + number);
    },
    putUnitAt(unit, posX, posY){
      const layout =this.unitsLayout[unit]; 
      if(!layout)return false; 
      
      const newUnitCoords = [];
      layout.forEach(coords => {
        newUnitCoords.push(
          new Object({'posX':coords.x+posX,'posY':(unit=='seaplane')?(coords.y+posY-1):(coords.y+posY), 'isBombed':false}));
      });

      for (let i = 0; i < newUnitCoords.length; i++) {
        // console.log("checking coords")
        const coord = newUnitCoords[i];
        
        if(coord.posX<0){useToast().error("Can't place out of the grid.");return false;}
        if(coord.posX>9){useToast().error("Can't place out of the grid.");return false;}
        if(coord.posY<0){useToast().error("Can't place out of the grid.");return false;}
        if(coord.posY>9){useToast().error("Can't place out of the grid.");return false;}

        console.log("unitAt:",this.getUnitAt(coord.posX, coord.posY))

        if(this.getUnitAt(coord.posX, coord.posY)){
          useToast().error("Another unit overlap identified.");
          return false;
        }
      }

      this.units = [...this.units,...newUnitCoords];
      this.selectedUnit = null;
      const index = this.availableUnits.indexOf(unit);
      if(index > -1)this.availableUnits.splice(index,1);
    },
    handleAvailableUnitClick: function(unit){
      this.selectedUnit = unit;
      // console.log('selectedUnit', unit)
    },
    handleUnitClick: function(x,y){
      this.$emit('unitClicked',{'posX':x,'posY':y});
      if(this.selectedUnit){
        this.putUnitAt(this.selectedUnit, x,y)
      }
      console.log(this.availableUnits);
      if(!this.availableUnits?.length){
        this.$emit('boardReady',this.units);
      }
      console.log('posX: '+x,"posY: "+y)
    },
    getUnitAt: function(posX, posY){
      // console.log("Checking unit at, ", posX, posY)
      const unit = this.units.find((u)=>u.posX==posX && u.posY == posY)
      return (unit?unit:false)
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
  mix-blend-mode: darken;
}

.anchor{
  position: relative;
  /* top: 5px; */
}

</style>