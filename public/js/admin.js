document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    const title = document.querySelector('input[name="title"]').value;
    const files = document.querySelectorAll('input[name="videos"]');
    
    formData.append('title', title);
    

    Array.from(files).forEach(input => {
        if (input.files[0]) {
            formData.append('videos', input.files[0]);
        }
    });

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData  
        });
        
        if (response.ok) {
            alert('Videos uploaded successfully!');
            window.location.href = '/';
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        alert(`Upload failed: ${error.message}`);
        console.error('Upload error:', error);
    }
});

 // Custom cursor
        document.addEventListener('mousemove', (e) => {
            const cursor = document.querySelector('.custom-cursor');
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
        
        // Video field counter
        let fieldCount = 1;
        const maxFields = 3;
        const counter = document.getElementById('videoCounter');
        const addBtn = document.getElementById('addBtn');
        
        function updateCounter() {
            counter.textContent = `${fieldCount}/${maxFields}`;
            addBtn.style.display = fieldCount >= maxFields ? 'none' : 'flex';
        }
        
        function addField() {
            if (fieldCount >= maxFields) return;
            
            const container = document.getElementById('videoFields');
            const div = document.createElement('div');
            div.className = 'flex gap-2 items-center';
            div.innerHTML = `
                <input 
                    type="file" 
                    name="videos" 
                    accept="video/mp4" 
                    class="file-input flex-1 p-2 bg-[#2a2a2a] rounded border border-[#3a3a3a] text-sm"
                >
                <button 
                    type="button" 
                    onclick="this.parentElement.remove(); fieldCount--; updateCounter();" 
                    class="px-3 h-full bg-red-600 hover:bg-red-700 rounded transition-all flex items-center justify-center"
                >
                    <span class="text-lg">×</span>
                </button>
            `;
            container.appendChild(div);
            fieldCount++;
            updateCounter();
        }
        
        // Initialize
        updateCounter();