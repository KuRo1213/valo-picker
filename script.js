const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const result = document.getElementById('result');
const spinSound = document.getElementById('spinSound');

// Unique Valorant agents
const uniqueAgents = [
  "Jett", "Phoenix", "Sage", "Brimstone", "Sova", "Reyna", "Cypher", "Killjoy",
  "Omen", "Viper", "Breach", "Raze", "Skye", "Yoru", "Astra", "KAY/O", "Chamber",
  "Neon", "Fade", "Harbor", "Gekko", "Deadlock", "Iso", "Clove", "Tejo", "Waylay", "Vyse"
];

const agentColors = {
  "Jett": "#00eaff", "Phoenix": "#ff8500", "Sage": "#6dd3b7", "Brimstone": "#ff4c4c",
  "Sova": "#b7d1f8", "Reyna": "#a400ff", "Cypher": "#005577", "Killjoy": "#ffcc00",
  "Omen": "#6666ff", "Viper": "#00ff66", "Breach": "#d2691e", "Raze": "#ff3366",
  "Skye": "#66ff99", "Yoru": "#3399ff", "Astra": "#9933ff", "KAY/O": "#999999",
  "Chamber": "#ffcc66", "Neon": "#00ffff", "Fade": "#660066", "Harbor": "#339999",
  "Gekko": "#aaff00", "Deadlock": "#ff0033", "Iso": "#333333", "Clove": "#ff66cc",
  "Tejo": "#db8c0dff", "Waylay": "#f4e400ff", "Vyse": "#2a074fff"

};

const agentCount = uniqueAgents.length;
const arc = (2 * Math.PI) / agentCount;

let angle = 0;
let spinning = false;

// Draw the wheel
function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  uniqueAgents.forEach((agent, i) => {
    const startAngle = angle + i * arc;
    const endAngle = startAngle + arc;

    ctx.beginPath();
    ctx.fillStyle = agentColors[agent] || getRandomColor();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 250, startAngle, endAngle);
    ctx.fill();

    // Text
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(startAngle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "bold 14px Arial";
    ctx.fillText(agent, 230, 10);
    ctx.restore();
  });
}

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

// Spin the wheel
function spinWheel() {
  if (spinning) return;
  spinning = true;
  spinBtn.disabled = true;
  spinSound.currentTime = 0;
  spinSound.play();

  const spinDuration = 4000; // 4 seconds
  const startTime = performance.now();
  const baseAngle = angle;

  // Spin randomly between 5 to 8 full circles
  const spinTarget = baseAngle + (Math.random() * 3 + 5) * 2 * Math.PI;

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / spinDuration, 1);
    const easedProgress = easeOutCubic(progress);

    angle = baseAngle + (spinTarget - baseAngle) * easedProgress;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      spinBtn.disabled = false;

      // Correct for pointer at 270° (downward)
      const normalizedAngle = (angle + Math.PI / 2) % (2 * Math.PI);
      const index = Math.floor((2 * Math.PI - normalizedAngle) / arc) % agentCount;
      const selectedAgent = uniqueAgents[index];

      result.textContent = `Selected Agent: ${selectedAgent}`;
    }
  }

  requestAnimationFrame(animate);
}

// Easing function for smooth deceleration
function easeOutCubic(t) {
  return (--t) * t * t + 1;
}

drawWheel();
spinBtn.addEventListener('click', spinWheel);
