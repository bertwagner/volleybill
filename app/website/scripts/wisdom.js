///
/// Variables
///


///
/// Methods
///

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


///
/// Event Listeners
///

///
/// Inits
///

var quotes = [
    "Keith has never lost a game of volleyball.  Ever.",
    "Keith always wins.  Guaranteed.",
    "Keith always trades high-fives after a game to show good sportsmanship.",
    "Keith never misses a game for a lunch date.",
    "NTB is Keith's official volleyball sponsor.",
    "Keith purposely skynets the ball to make his opponents think they have a chance of winning.",
    "After winning this season's championship, Keith's next act of domination is ending world hunger.",
    "When not writing quotes, Keith is living them.",
    "SKYNET!",
    "COLD CUTS!",
    "THE CLOSER IS IN POSITION!",
    "GAME POINT",
    "The Chicken Dance? Keith invented it.",
    "EAT MORE CHICKEN!",
    "Keith inspires you to chew more gum.",
    "Keith loves fair teams!",
    "Keith is the best volleyball and soccer player...ever!",
    "GUYS....ICE CREAM IF WE WIN THIS ONE!",
    "THAT'S WHAT I DO!",
    "I LOVE IT WHEN A PLAY COMES TOGETHER!!1!",
    "Keith gets things done!!",
    "Keith never gets ready, he stays ready, he was born ready!",
    "Keith. 'Nuff said.",
    "GUYS IF WE WIN THIS, CARS FOR EVERYBODY!",
    "Keith once had to look up \"loss\" in the dictionary because he's so accustomed to winning.",
    "Stack 'em up",
    "STEEL CURTAIN, BABY!",
    "Don't fall asleep!!",
    "Keith wins again!",
    "The only time Keith loses... is when he tries to lose.",
    "The Champ is here!!!!!",
    "FAKE NEWS!!!",
    "ACE!",
    "Whaaaatttttt!",
    "Shake and bake!",
    "What are you talking about?!?!?  It was in!!!",
    "What are you talking about?!?!?  It was out!!!",
    "If you're having trouble finding Keith, try NTB.",
    "A long time ago Keith got a job as a lumberjack in the Sahara forest.",
    "There are a growing number of support groups for Keith's former opponents.",
    "Keith is the only fictional character employed by Progressive not for advertising.",
    "Keith is working from home today.",
    "Double or nothing means everything to Keith.  Unless he loses.",
    "I always wondered what a soccer field would look like with a cherry tree in it. Then Keith was born.",
    "Champ is here!!",
    "Keith is the MAN!!!",
    "All Keith does is WIN!!!",
    "Time to get this MONEY!",
    "Do you take Google Pay?",
    "Gehghis Khan, Alexander the Great, Keith, Atilla the Hun, Charlemagne",
    "Keith hates STACKED teams!!",
    "“All day, every day! No breaks!”",
    "Keith HATES moles on his team!!!",
    "Keith is a Demigod!",
    "I am Mr. Wonderful!",
    "A.K.A Mr. Wonderful!",
    "Scientist think the world is round.  Keith knows better.",
    "Make Keith great again.",
    "This is what I do!",
    "*cackle* *cackle* *cackle*",
    "It sure is lonely at the top..."
];

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
  }


document.getElementById("quote").innerHTML=quotes.random();