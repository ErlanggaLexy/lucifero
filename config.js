module.exports = {
  TOKEN: "",
  ownerID: ["803996037224202302", ""], 
  setupFilePath: './commands/setup.json',
  commandsDir: './commands',  
  embedColor: "#db0032",
  musicardTheme:"themes15", //Goes from themes1 to themes19
  activityName: "YOU", // This is bot status Write Anything here 
  activityType: "WATCHING",  // Available activity types : LISTENING , PLAYING
  SupportServer: "https://discord.gg/xQF9f9yUEM",
  CheckmarkIcon: "https://cdn.discordapp.com/attachments/1052112819006480426/1263549604566401106/maddie_creates-gif.gif?ex=669aa3c5&is=66995245&hm=f0458a7c8623f90718eb10f317e974dfa22f6f1057157fd34f49b09169cbc171&",
  MusicIcon:"https://media.discordapp.net/attachments/1230824451990622299/1236664581364125787/music-play.gif",
  embedTimeout: 5,  // Timeout before the button interaction embeds are deleted ( Default - 5 seconds)
  errorLog: "", 

   // Lavalink Server Details

  nodes: [
    {
        name: "Node #1",
        host: "lava-v3.ajieblogs.eu.org",
        port: 80,
        password: "https://dsc.gg/ajidevserver",
        reconnectTimeout: 5000,
        reconnectTries: Infinity,
        secure: false
    },
 ]
}
