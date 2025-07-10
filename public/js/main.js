document.addEventListener('DOMContentLoaded', async () => {
    console.log("Script loaded!");

    try {
        const response = await fetch('/api/videos');
        console.log("API response:", response);

        const videos = await response.json();
        console.log("Loaded videos:", videos);

        const container = document.getElementById('titles');
        if (!container) {
            console.error("Error: #titles container not found!");
            return;
        }

        if (videos.length === 0) {
            container.innerHTML = '<div class="title">No games found</div>';
            return;
        }

        // Group videos by title
        const grouped = {};
        videos.forEach(video => {
            if (!grouped[video.title]) grouped[video.title] = [];
            grouped[video.title].push(video);
        });

        // Generate HTML with wrapper 
        container.innerHTML = Object.entries(grouped).map(([title, clips]) => `
            <div class="title-wrapper">
                <div class="title">
                    ${title}
                    <div class="videos">
                        ${clips.slice(0, 3).map(video => `
                            <div class="video">
                                <video src="${video.url}" autoplay loop muted></video>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        console.log("Titles rendered!");
    } catch (error) {
        console.error("Failed to load videos:", error);
    }
});


 document.addEventListener('DOMContentLoaded', () => {
  // Create elements
  const bg = document.createElement('div');
  bg.className = 'interactive-bg';
  document.body.prepend(bg);
  
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  // Color cycling
  let hue = 200;
  const cycleColors = () => {
    hue = (hue + 0.5) % 360;
    document.documentElement.style.setProperty('--hue', hue);
    requestAnimationFrame(cycleColors);
  };
  cycleColors();

  // le mouse effects
  document.addEventListener('mousemove', (e) => {
    // cursor position
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    
    // background gradient
    document.documentElement.style.setProperty('--x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--y', `${e.clientY}px`);
    
    // thee colorful pulses
    if (Math.random() > 0.8) {
      const pulse = document.createElement('div');
      const pulseHue = (hue + Math.random() * 120 - 60) % 360;
      pulse.style.cssText = `
        position: fixed;
        width: ${Math.random() * 150 + 50}px;
        height: ${Math.random() * 150 + 50}px;
        background: radial-gradient(circle, 
          hsla(${pulseHue}, 100%, 70%, 0.3), 
          transparent 70%);
        border-radius: 50%;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: -1;
        animation: pulse ${Math.random() * 1 + 0.5}s forwards;
      `;
      document.body.appendChild(pulse);
      setTimeout(() => pulse.remove(), 1500);
    }
  });

  // add de pulse animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; }
      50% { opacity: 0.4; }
      100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
});


document.querySelectorAll('.videos').forEach(videoContainer => {
  videoContainer.style.display = 'none';
});


document.querySelectorAll('.title').forEach(title => {
  title.addEventListener('mouseenter', () => {
    const videos = title.querySelector('.videos');
    videos.style.display = 'flex'; 
    setTimeout(() => videos.style.opacity = '1', 10); 
  });
  
  title.addEventListener('mouseleave', () => {
    const videos = title.querySelector('.videos');
    videos.style.opacity = '0';
    setTimeout(() => videos.style.display = 'none', 300); 
  });
});