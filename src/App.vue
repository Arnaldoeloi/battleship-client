<template>


  <span>
    {{gameStateDict[currentGameState]}}
  </span><br/>
  <strong v-if="currentGameState==2">{{(isMyTurn)?'Your turn!':`${turnOwner.name} turn!`}}</strong>
  
  <h5>Server Code: {{ serverCode }}</h5>  
  <h5>Username: {{ username }}</h5>
  <h5 v-if="winner">Winner: {{ winner.name }}</h5>

  <template v-if="currentGameState == null || currentGameState == 3">
    <input type="text" id="fname" name="fname" v-model="username" placeholder="Username"><br><br>
    <input type="text" id="fname" name="fname" v-model="serverCode" placeholder="Código do servidor"><br><br>

    <button @click="connectAndCreateServer">Criar jogo</button><br><br>
    ou
    <input type="text" id="fname" name="fname" v-model="serverCode" placeholder="Código do servidor"><br><br>
    <button @click="connectAndEnterServer">Acessar jogo</button>
  </template>

  <template v-if="currentGameState == 1">
      <!-- <div class="board-container"> -->
        <UnitsSetter @boardReady="handleBoardReady"/> 
      <!-- </div>  -->
  </template>

  <template v-if="currentGameState == 2 || currentGameState == 3">
  <div class="board-container">
      <div>
        <span class="name-title">{{ adversary.name }}</span>
        <GameBoard :receivedBombs="adversaryBombs" @unitClicked="handleUnitClicked"/>
      </div>
  </div>
  <div class="board-container">
      <div v-if="myself">
        <span class="name-title">{{myself.name}}</span>
        <GameBoard v-if="myself" 
          :units="units" 
          :receivedBombs="myself?.receivedBombs"
        />
      </div>
  </div>
  </template>  
  <!-- <GameBoard v-if="currentGameState in [2,3]"/> -->
  


</template>

<script>
import GameBoard from './components/GameBoard.vue';
import UnitsSetter from './components/UnitsSetter.vue';
import { useToast } from "vue-toastification";

export default {
  name: 'App',
  components: {
    GameBoard,
    UnitsSetter,
  },
  data() {
    return {
      username: "",
      serverCode: "",
      winner: null,
      ws: null,
      turnOwner: null,
      gameStateDict: {
        null: "Join or create a game",
        0: 'Waiting another player to connect',
        1: 'Setting up the units',
        2: 'Waiting player turn end',
        3: 'The game ended!',
      },
      players: [],
      currentGameState: null,
      toast: null,
      myself: null,
    }
  },
  methods: {
    handleBoardReady(units){
      console.log('boardReady! Emitting units to server')
      this.ws.emit('unitsSetup',units);
    },
    handleGameEnded: function(payload){
      this.currentGameState = payload.state;
      this.winner = payload.winner;
      useToast().success(`The game ended. The Winner was ${payload.winner.name}`)
    },
    handlePrivateDataUpdated: function(payload){
      console.log('privateDataUpdated', payload)
      this.myself = payload;
    },
    handleBombDropped: function(payload){
      console.log('bombDropped', payload)
      this.turnOwner = payload.turnOwner;
      this.players = payload.players;
      useToast().info(`${payload.droppedOnPlayer} received a bomb! ${payload.bomb.isWater?"No unit was hit.":`A unit was hit, it's still ${this.turnOwner.name} turn.`}`)
      // this.myself = payload;
    },
    handlePlayerReadyUpdated: function(payload){
      console.log("handlePlayerReadyUpdated", payload);
      this.players = payload.players;
      this.currentGameState = payload.state;
      this.turnOwner = payload.turnOwner;
      this.players.map((p)=>{if(p.isReady)useToast().info(`${p.name} is ready!`)})
      

      // this.players.foreach((p)=>{
      //   if(p.isReady){
      //     useToast().info(`${p.name} is ready!`)
      //   }
      // })
    },
    handleError: function(payload){
      useToast().error(payload.message);
    },
    handleServerEvent: function(eventName, payload){
        // this[eventName](payload); //this should work :(
        
      if(eventName == 'serverCreated'){
        this.serverCreated(payload);
      }
      else if(eventName == 'playerConnected'){
        this.serverCreated(payload);
      }
      else if(eventName == 'error'){
        this.handleError(payload);
      }
      else if(eventName == 'privateDataUpdated'){
        this.handlePrivateDataUpdated(payload);
      }
      else if(eventName == 'playerReady'){
        this.handlePlayerReadyUpdated(payload);
      }
      else if(eventName == 'bombDropped'){
        this.handleBombDropped(payload);
      }
      else if(eventName == 'gameEnded'){
        this.handleGameEnded(payload);
      }
    
      console.log(eventName, payload)
    },
    serverCreated: function(payload) {
      console.log('serverCreated',payload)
      
      this.currentGameState = payload.state;
      this.players = payload.players;
      this.toast.success("Server created!");
    },
    playerConnected: function(payload) {
      console.log('playerConnected',payload)
      this.currentGameState = payload.state;
      this.players = payload.players;
      // this.myself = payload.players[1];
      this.toast.info(`${payload.player.name} connected!`);
    },
    connectAndCreateServer: function(){
      this.connectToServer();
      this.ws.addEventListener("open", () =>{
        this.createServer();
        console.log("We are connected");
      });
    },
    connectAndEnterServer: function(){
      this.connectToServer();
      this.ws.addEventListener("open", () =>{
        this.enterServer();
        console.log("We are connected");
      });
    },
    handleUnitClicked: function({posX,posY}){
      console.log("Trying to emit unit clicked!");
      this.ws.emit('dropBomb',{'posX':posX,'posY':posY});
    },
    connectToServer: function(){
      this.ws = new WebSocket(`ws://localhost:8080/username=${this.username}&server=${this.serverCode}`);

      this.ws.addEventListener('message', (data) => {
        console.log('Msg received', data.data);

        const parsed = JSON.parse(data.data);
        console.log('parsed',parsed);
        const { eventName, payload } = parsed;
        this.handleServerEvent(eventName, payload);
        // console.log(JSON.parse(event.data));
      });
      
    },
    enterServer: function(){
        this.ws.emit('playerConnection',{'serverCode':this.serverCode});
        console.log('Sent creation method.')
    },
    createServer: function(){
        this.ws.emit('createServer',{'serverCode':this.serverCode});
        console.log('Sent creation method.')
    },
    displaceUnits: function(){
        this.ws.emit('displaceUnits',{'units':this.units});
    }
  },
  mounted() {
    this.Ws
    this.toast = useToast()
  },
  computed: {
    isMyTurn: function(){
      if(!this.turnOwner)return true;
      return this.turnOwner?.name == this.myself?.name;
    },
    adversary: function(){
      // if(!(this.currentGameState == 0))return null;
      // console.log('Adversary set!')
      return this.players.find((p)=>p.name!=this.myself?.name);
    },
    adversaryBombs: function(){
      if(!this.adversary)return [];
      return this.adversary?.receivedBombs;
    },
    units: function(){
      if(!this.myself)return [];
      return this.myself.units
    },

  },
}
</script>

<style>
.name-title{
  font-size: 0.5rem;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.board-container{
  display: flex;
  justify-content: center
}
</style>
