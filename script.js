// Global variables
let notes = [];
let deletedNotes = [];
let currentNote = null;

// User Type Selection
function selectUserType(type) {
    document.getElementById('userSelect').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('userTypeTitle').textContent = 
        type.charAt(0).toUpperCase() + type.slice(1) + ' Magic Notes Dashboard';
}

// Go Back to User Type Selection
function goBack() {
    document.getElementById('userSelect').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    
    // Reset dashboard elements
    document.getElementById('noteInput').value = '';
    document.getElementById('notesList').innerHTML = '';
    document.getElementById('trashList').innerHTML = '';
    document.getElementById('trashList').style.display = 'none';
    document.getElementById('shareOptions').style.display = 'none';
    
    // Reset notes
    notes = [];
    deletedNotes = [];
    currentNote = null;
}

// Existing functions from the previous script remain the same...
// (saveNote, shareNote, deleteNote, etc.)
// Global variables

// Note Saving
function saveNote() {
    const noteContent = document.getElementById('noteInput').value.trim();
    if (noteContent) {
        const colorPalette = [
            '#FFD700', '#FF6B6B', '#4ECDC4', 
            '#6A5ACD', '#FF4500', '#1E90FF'
        ];
        const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];

        const newNote = {
            content: noteContent,
            date: new Date().toLocaleString(),
            color: randomColor
        };

        notes.push(newNote);
        document.getElementById('noteInput').value = '';
        updateNotesList();
        confettiAnimation();
    }
}

// Note Sharing
function shareNote() {
    const noteContent = document.getElementById('noteInput').value.trim();
    if (noteContent) {
        currentNote = noteContent;
        document.getElementById('shareOptions').style.display = 'block';
    } else {
        alert('Please write a note before sharing!');
    }
}

// Web Share API
function shareNoteWeb() {
    if (navigator.share) {
        navigator.share({
            title: 'My Magic Note',
            text: currentNote
        }).then(() => {
            console.log('Note shared successfully');
        }).catch((error) => {
            console.error('Error sharing note:', error);
            alert('Sharing failed. Try another method.');
        });
    } else {
        alert('Web Share not supported on this browser. Try copying to clipboard.');
    }
}

// Copy to Clipboard
function copyNoteToClipboard() {
    navigator.clipboard.writeText(currentNote).then(() => {
        alert('Note copied to clipboard! 📋');
    }).catch(err => {
        console.error('Could not copy text: ', err);
        alert('Copying failed. Please try again.');
    });
}

// Email Sharing
function emailNote() {
    // Create email modal
    const modalHtml = `
        <div class="email-modal">
            <div class="email-modal-content">
                <h2 style="color: var(--primary-color);">Share Note via Email</h2>
                <form id="emailShareForm">
                    <label for="recipientEmail">Recipient's Email:</label>
                    <input type="email" id="recipientEmail" required>
                    <textarea id="emailMessage" rows="4">${currentNote || ''}</textarea>
                    <div class="email-modal-buttons">
                        <button type="button" onclick="closeEmailModal()">Cancel</button>
                        <button type="submit">Send</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Create and append modal
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);

    // Add form submit event listener
    document.getElementById('emailShareForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('recipientEmail').value;
        const message = document.getElementById('emailMessage').value;
        
        // Simulate email sending (replace with actual email service in a real app)
        alert(`Note would be sent to: ${email}\n\nMessage:\n${message}`);
        
        closeEmailModal();
    });
}

// Close Email Modal
function closeEmailModal() {
    const modal = document.querySelector('.email-modal');
    if (modal) {
        modal.remove();
    }
}

// Delete Note
function deleteNote(index) {
    const deletedNote = notes.splice(index, 1)[0];
    deletedNotes.push(deletedNote);
    updateNotesList();
    updateTrashList();
    magicDeleteAnimation();
}

// Restore Note
function restoreNote(index) {
    const restoredNote = deletedNotes.splice(index, 1)[0];
    notes.push(restoredNote);
    updateNotesList();
    updateTrashList();
    confettiAnimation();
}

// Toggle Trash List
function toggleTrashList() {
    const trashList = document.getElementById('trashList');
    if (trashList.style.display === 'none') {
        updateTrashList();
        trashList.style.display = 'block';
    } else {
        trashList.style.display = 'none';
    }
}

// Update Notes List
function updateNotesList() {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = notes.map((note, index) => `
        <div class="note-item" style="border-left-color: ${note.color};">
            <div>
                <p style="color: ${note.color};">${note.content}</p>
                <small>${note.date}</small>
            </div>
            <div class="note-actions">
                <button onclick="deleteNote(${index})">🗑️</button>
            </div>
        </div>
    `).join('');
}

// Update Trash List
function updateTrashList() {
    const trashList = document.getElementById('trashList');
    trashList.innerHTML = `
        <h3 style="text-align: center; color: var(--secondary-color);">🗑️ Deleted Notes</h3>
        ${deletedNotes.map((note, index) => `
            <div class="note-item" style="border-left-color: ${note.color};">
                <div>
                    <p style="color: ${note.color};">${note.content}</p>
                    <small>${note.date}</small>
                </div>
                <div class="note-actions">
                    <button onclick="restoreNote(${index})">♻️</button>
                </div>
            </div>
        `).join('')}`;
}

// Magic Delete Animation
function magicDeleteAnimation() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];

    function createParticles() {
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 5 + 2,
                color: `hsla(${Math.random() * 360}, 50%, 50%, 0.7)`,
                speedX: (Math.random() - 0.5) * 5,
                speedY: (Math.random() - 0.5) * 5,
                alpha: 1
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle, index) => {
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.alpha -= 0.02;
            
            if (particle.alpha <= 0) {
                particles.splice(index, 1);
            }
        });

        if (particles.length > 0) {
            requestAnimationFrame(drawParticles);
        } else {
            document.body.removeChild(canvas);
        }
    }

    createParticles();
    drawParticles();
}

// Confetti Animation
function confettiAnimation() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const confetti = [];

    function createConfetti() {
        for (let i = 0; i < 100; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 10 + 5,
                color: `hsl(${Math.random() * 360}, 50%, 50%)`,
                speed: Math.random() * 3 + 1
            });
        }
    }

    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach((particle, index) => {
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            particle.y += particle.speed;
            
            if (particle.y > canvas.height) {
                confetti.splice(index, 1);
            }
        });

        if (confetti.length > 0) {
            requestAnimationFrame(drawConfetti);
        } else {
            document.body.removeChild(canvas);
        }
    }

    createConfetti();
    drawConfetti();
}