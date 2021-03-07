const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});


// Routing
app.use(express.static(path.join(__dirname, 'public')));


// Chatroom

let numUsers = 0;

io.on('connection', (socket) => {
  let addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

setInterval(function(){
  var words = [ "A romantic candlelit dinner would be incomplete without  - .", "After blacking out during New Year's Eve, I was awoken by  - .", "After months of debate, the Occupy Wall Street General Assembly could only agree on �More  - !�" , "After the earthquake, Sean Penn bought � to the people of Haiti." , "Alternative medicine is now embracing the curative powers of  - .", "And I would have gotten away with it, too, if it hadn't been for  - .", "Anthropologists have recently discovered a primitive tribe that worships  - .", "Before I run for president, I must destroy all evidence of my involvement with  - .", "BILLY MAYS HERE FOR  - .", "But before I kill you, Mr. Bond, I must show you  - .", "Charades was ruined for me forever when my mom had to act out  - .", "Coming to Broadway this season,  - : The Musical.", "Dear Abby, I'm having some trouble with � and would like your advice." , "During his midlife crisis, my dad got really into  - .", "During Picasso's often - overlooked Brown Period, he produced hundreds of paintings of  - .", "During sex, I like to think about  - .", "Every Christmas my uncle gets drunk and tells the story about  - .", "Everyone down on the ground! We don't want to hurt anyone. We're just here for  - .", "He who controls � controls the world." , "How am I maintaining my relationship status.", "I do not know with what weapons World War III will be fought, but World War IV will be fought with.", "I drink to forget  - .", "I got 99 problems but � ain't one." , "I learned the hard way that you can't cheer up a grieving friend with  - .", "I'm sorry professor, but I couldn't complete my homework because of  - .", "In 1,000 years when paper money is but a distant memory,  -  will be our currency.", "In an attempt to reach a wider audience, the Smithsonian Museum of Natural History has opened an interactive exhibit on  - .", "In his new self - produced album, Kanye West raps over the sounds of  - .", "In his newest and most difficult stunt, David Blaine must escape from  - .", "In its new tourism campaign, Detroit proclaims that it has finally eliminated  - .", "In L.A. county Jail, word is you can trade 200 cigarettes for  - .", "In Michael Jackson's final moments, he thought about  - .", "In Rome, there are whisperings that the Vatican has a secret room devoted to  - .", "In the distant future, historians will agree that � marked the beginning of America's decline." , "In the new Disney Channel Original Movie, Hannah Montana struggles with � for the first time." , "Instead of coal, Santa now gives the bad children  -  .", "It's a pity that kids these days are all getting involved with  - .", "Jesus is  - .", "Life for American Indians was forever changed when the White Man introduced them to  - .", "Little Miss Muffet, Sat on a tuffet, Eating her curds and  - .", "Major League Baseball has banned � for giving players an unfair advantage." , "Maybe she's born with it. Maybe it's  - .", "Members of New York's social elite are paying thousands of dollars just to experience  - .", "MTV's new reality show features eight washed - up celebrities living with  - .", "My country, 'tis of thee, sweet land of  - .", "My mom freaked out when she looked at my browser history and found  - .com/ - .", "My new favorite porn star is Joey � - � McGee." , "Next from J.K. Rowling: Harry Potter and the Chamber of  - .", "Next on ESPN2: The World Series of  - .", "Next time on Dr. Phil: How to talk to your child about  - .", "On the third day of Christmas, my true love game to me: three French hens, two turtle doves, and  - .", "Only two things in life are certain: death and  - .", "Science will never explain the origin of  - .", "Studies show that lab rats navigate mazes 50% faster after being exposed to  -", "The CIA now interrogates enemy agents by repeatedly subjecting them to  - .", "The class field trip was completely ruined by  - .", "The Five Stages of Grief: denial, anger, bargaining,  -  acceptance.", "The healing process began when I joined a support group for victims of  - .", "The socialist governments of Scandanavia have declared that access to � is a basic human right." , "The votes are in, and the new high school mascot is  - .", "This holiday season, Tim Allen must overcome his fear of � to save Christmas." , "This is the way the world ends This is the way the world ends Not with a bang but with  - .", "This is your captain speaking. Fasten your seatbelts and prepare for  - .", "This month's Cosmo: �Spice up your sex life by bringing � into the bedroom.�" , "This reason on Man vs. Wild, Bear Grylls must survive in the depths of the Amazon with only � and his wits." , "Tonight on 20/20: What you don't know about � could kill you." , "TSA guidelines now prohibit � on airplanes." , "Wake up, America. Christmas is under attack by secular liberals and their  - .", "War! What is it good for?", "What am I giving up for Lent?", "What are my parents hiding from me?", "What brought the orgy to a grinding halt?", "What did I bring back from Mexico?", "What did the US airdrop to the children of Afghanistan?", "What did Vin Diesel eat for dinner?", "What do old people smell like?", "What does Dick Cheney prefer?", "What don't you want to find in your Chinese food?", "What ended my last relationship?", "What gets better with age?", "What gives me uncontrollable gas?", "What has been making life difficult at the nudist colony?", "What helps Obama unwind?", "What is Batman's guilty pleasure?", "What keeps me warm during the cold, cold winter?", "What never fails to liven up the party?", "What people like  - .", "What will always get you laid?", "What will I bring back in time to convince people that I am a powerful wizard?", "What would grandma find disturbing, yet oddly charming?", "What's a girl's best friend?", "What's my anti - drug?", "What's my secret power?", "What's Teach for America using to inspire inner city students to succeed?", "What's that smell?", "What's that sound?", "What's the crustiest?", "What's the gift that keeps on giving?", "What's the most emo?", "What's the new fad diet?", "What's the next Happy Meal toy?", "What's there a ton of in heaven?", "When all else fails, I can always masturbate to  - .", "When I am a billionaire, I shall erect a 50 - foot statue to commemorate  - .", "When I am President of the United States, I will create the Department of  - .", "When I pooped, what came out of my butt?", "When Pharaoh remained unmoved, Moses called down a Plague of  - .", "When the United States raced the Soviet Union to the moon, the Mexican government funneled millions of pesos into research on  - .", "Why am I sticky?", "Why can't I sleep at night?", "Why do I hurt all over?", "In the seventh circle of Hell, sinners must endure -  for all eternity.", "A successful job interview begins with a firm handshake and ends with - .", "Lovin� you is easy �cause you�re - ." , "My life is ruled by a vicious cycle of -  and - .", "The blind date was going horribly until we discovered our shared interest in - .", " -  . Awesome in theory, kind of a mess in practice.", "I�m not like the rest of you. I�m too rich and busy for - ." , "(Pick 2) -  : Hours of fun. Easy to use. Perfect for - !", "What left this stain on my couch?", "Call the law offices of Goldstein & Goldstein, because no one should have to tolerate -  in the workplace.", "(Pick 2) When you get right down to it, -  is just - .", "Turns out that � Man was neither the hero we needed nor wanted." , "As part of his daily regimen, Anderson Cooper sets aside 15 minutes for - .", "Money can�t buy me love, but it can buy me - ." , "(Pick 2) With enough time and pressure, -  will turn into - .", "And what did you bring for show and tell?", "During high school I never really fit in until I found -  club.", "Hey baby, come back to my place and I�ll show you - ." , "(Pick 2) After months of practice with - , I think I�m finally ready for - ." , "To prepare for his upcoming role, Daniel Day-Lewis immersed himself in the world of - .", "Finally! A service that delivers -  right to your door.", "My gym teacher got fired for adding -  to the obstacle course.", "(Pick 2) Having problems with - ? Try - !", "As part of his contract, Prince won�t perform without -  in his dressing room." , "(Pick 2) Listen, son. If you want to get involved with - , I won�t stop you. Just steer clear of - ."  ] ; 
  var randomNumber = Math.round( Math.random() * (words.length-1) ); 
  var message = words[randomNumber]
    io.sockets.emit('channel_3', message);
}, 2000);




