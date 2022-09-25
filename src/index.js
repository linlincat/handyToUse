class HandSister {
  constructor(config){
      this.x = config.x
      this.y = config.y
      this.width = config.width
      this.height = config.height
      this.setConfig()
  }
  setConfig(){
      console.log("初始化...")
  }
}

window.HandSister = HandSister
export default HandSister