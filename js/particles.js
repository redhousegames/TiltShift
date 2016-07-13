(function() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var ft = 0;

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //Lets create an array of particles
    particles = [];
    var n = 200
    if (canvas.width < 400) { //Less particles for mobile
      n=100
    }
    for (var i = 0; i < n; i++) {
      //This will add n particles to the array with random positions
      particles.push(new create_particle());
    }

    //Draw to canvas
    draw();
  }

  function create_particle() {
    //Random position on the canvas
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    //Random animation starting point
    this.t = Math.random();
    this.opacity = .5 * easeInOutCubic(this.t);

    //Lets add random velocity to each particle
    this.vy = 1 / 3 * (Math.random() + 0.5);
  }

  function easeInOutCubic(t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }

  function draw() {
    // do my drawing stuff here
    var W = canvas.width;
    var H = canvas.height;
    //Lets make the canvas transparent
    ctx.clearRect(0, 0, W, H);

    //Lets draw particles from the array now
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      //Chromatic abberation focal point intensity multiplier
      var f = 1 / 50000000 * (easeInOutCubic(Math.sin(Math.PI * ft) + 1));

      //Lets draw a particle
      //Additive Color Mode
      ctx.globalCompositeOperation = "screen";

      //Green Componenet
      ctx.beginPath();
      if (i % 2 == 0) { //if even make red particles
        ctx.fillStyle = "rgba(0, 175, 0," + p.opacity + ")";
      } else { //else blue particles
        ctx.fillStyle = "rgba(0, 127, 0, " + p.opacity + ")";
      }
      ctx.arc(p.x + H / W * f * Math.pow((W / 2 - p.x), 3), p.y + f * Math.pow((H / 2 - p.y), 3), 1.5, Math.PI * 2, false);
      ctx.fill();

      //Red Blue Component
      ctx.beginPath();
      if (i % 2 == 0) { //if even make red particles
        ctx.fillStyle = "rgba(0, 0, 219," + p.opacity + ")";
      } else { //else blue particles
        ctx.fillStyle = "rgba(255, 0, 127, " + p.opacity + ")";
      }
      ctx.arc(p.x, p.y, 1.5, Math.PI * 2, false);
      ctx.fill();

      p.y -= p.vy; //Move particles up
      p.t += .001; //30 sec trasition for opacity
      p.opacity = .5 * easeInOutCubic(Math.sin(Math.PI * p.t));
      //To prevent the particles from moving out of the canvas
      if (p.y < -50) p.y = H + 50;

      //To cycle opactiy animation
      if (p.t > 1) p.t = 0;
    }

    ft += .005; //6 sec transition for abberations

    //To cycle abberation animation
    if (ft > 1) ft = 0;
  }
  resizeCanvas();
  setInterval(draw, 33); // ~30 Frames/sec
})();
