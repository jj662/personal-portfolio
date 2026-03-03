        AOS.init({
            duration: 1000,
            once: false,
            mirror: true,
            offset: 100,
        });

        function trackResume() {
            gtag('event', 'resume_download', {
            event_category: 'engagement',
            event_label: 'Resume PDF'
        });
        }

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXXXX');
       

        // --- Navbar Spotlight Logic ---
        function moveNavSpotlight(e) {
            const dock = e.currentTarget;
            const spotlight = document.getElementById('nav-spotlight');
            const rect = dock.getBoundingClientRect();
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            spotlight.style.left = `${x}px`;
            spotlight.style.top = `${y}px`;
        }

        // --- Three.js Background with Parallax ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('canvas-container').appendChild(renderer.domElement);

        // Particles
        const particlesCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 25; 
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const material = new THREE.PointsMaterial({
            size: 0.03,
            color: 0x6366f1,
            transparent: true,
            opacity: 0.8,
        });

        const particlesMesh = new THREE.Points(geometry, material);
        scene.add(particlesMesh);

        // Add simple geometric floaters for extra depth
        const floaters = [];
        for(let i=0; i<5; i++) {
            const geo = new THREE.IcosahedronGeometry(Math.random() * 2, 0);
            const mat = new THREE.MeshBasicMaterial({ 
                color: i % 2 === 0 ? 0x818cf8 : 0xa855f7, 
                wireframe: true, 
                transparent: true, 
                opacity: 0.05 
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10
            );
            scene.add(mesh);
            floaters.push(mesh);
        }

        camera.position.z = 5;

        // Mouse Interaction
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX / window.innerWidth - 0.5;
            mouseY = event.clientY / window.innerHeight - 0.5;
        });

        // Animation Loop
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Scroll Parallax Calculation
            const scrollY = window.scrollY;
            
            // Rotate entire system based on scroll and time
            particlesMesh.rotation.y = elapsedTime * 0.05 + (scrollY * 0.0002);
            particlesMesh.rotation.x = (mouseY * 0.2) + (scrollY * 0.0002);
            
            // Animate floaters
            floaters.forEach((mesh, i) => {
                mesh.rotation.x += 0.001 * (i + 1);
                mesh.rotation.y += 0.002;
                // Gentle bobbing
                mesh.position.y += Math.sin(elapsedTime + i) * 0.002;
            });

            // Camera parallax drift
            camera.position.y = -scrollY * 0.001; 

            renderer.render(scene, camera);
        }

        animate();

        // Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // --- 3D Card Tilt Logic (Existing) ---
        function handleMouseMove(e, container) {
            // Disable tilt on mobile to prevent scrolling issues/jitter
            if (window.innerWidth < 768) return;

            const card = container.querySelector('.glass-card');
            const glow = container.querySelector('.card-bg-glow');
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            glow.style.left = `${x - 75}px`;
            glow.style.top = `${y - 75}px`;
        }

        function handleMouseLeave(container) {
            const card = container.querySelector('.glass-card');
            card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        }

        function openModal(src) {
        const modal = document.getElementById('cert-modal');
        const modalImg = document.getElementById('modal-img');
        modalImg.src = src;
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100', 'pointer-events-auto');
        }

        function closeModal() {
        const modal = document.getElementById('cert-modal');
        modal.classList.add('opacity-0', 'pointer-events-none');
        modal.classList.remove('opacity-100', 'pointer-events-auto');
        }