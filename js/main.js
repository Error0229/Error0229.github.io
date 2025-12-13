/**
 * Yi-Ting Lin Portfolio - Main JavaScript
 * Blueprint/Schematic Aesthetic
 */

(function () {
  'use strict';

  // ==========================================================================
  // Cycling Typing Animation with Delete Effect (Hero + Browser Tab)
  // ==========================================================================
  const typingText = document.querySelector('.typing-text');
  const namesToCycle = ['Error0229', 'Cato Lin', 'Yi-Ting Lin'];
  const titleSuffix = ' | me';
  let nameIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 100;
  const deleteSpeed = 60;
  const pauseBeforeDelete = 2000;
  const pauseBeforeType = 500;

  function typeAnimation() {
    const currentName = namesToCycle[nameIndex];

    if (!isDeleting) {
      // Typing characters
      if (charIndex < currentName.length) {
        const displayText = currentName.substring(0, charIndex + 1);
        typingText.textContent = displayText;
        document.title = displayText + titleSuffix;
        charIndex++;
        setTimeout(typeAnimation, typeSpeed + Math.random() * 50);
      } else {
        // Finished typing, pause then start deleting
        setTimeout(() => {
          isDeleting = true;
          typeAnimation();
        }, pauseBeforeDelete);
      }
    } else {
      // Deleting characters
      if (charIndex > 0) {
        const displayText = currentName.substring(0, charIndex - 1);
        typingText.textContent = displayText;
        document.title = (displayText || '_') + titleSuffix;
        charIndex--;
        setTimeout(typeAnimation, deleteSpeed + Math.random() * 30);
      } else {
        // Finished deleting, move to next name
        isDeleting = false;
        nameIndex = (nameIndex + 1) % namesToCycle.length;
        setTimeout(typeAnimation, pauseBeforeType);
      }
    }
  }

  // Start typing after a short delay
  setTimeout(typeAnimation, 500);

  // ==========================================================================
  // Project Filter
  // ==========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter cards
      const filter = tab.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          // Re-trigger animation
          card.style.animation = 'none';
          card.offsetHeight; // Trigger reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================================================
  // Intersection Observer for Scroll Animations
  // ==========================================================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  };

  const scrollObserver = new IntersectionObserver(animateOnScroll, observerOptions);

  // Observe skills groups and project cards
  document.querySelectorAll('.skills-group, .project-card').forEach(el => {
    scrollObserver.observe(el);
  });

  // ==========================================================================
  // Smooth Scroll for Anchor Links
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ==========================================================================
  // Grid Background Mouse Interaction (Subtle)
  // ==========================================================================
  const gridBg = document.querySelector('.grid-bg');

  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    // Subtle parallax effect on grid
    gridBg.style.transform = `translate(${x * 10 - 5}px, ${y * 10 - 5}px)`;
  });

  // ==========================================================================
  // Card Tilt Effect (Subtle)
  // ==========================================================================
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
    });
  });

  // ==========================================================================
  // Chip Stagger Animation on Scroll
  // ==========================================================================
  const chips = document.querySelectorAll('.chip');

  const chipObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const chipsInGroup = entry.target.querySelectorAll('.chip');
        chipsInGroup.forEach((chip, index) => {
          setTimeout(() => {
            chip.style.opacity = '1';
            chip.style.transform = 'translateY(0)';
          }, index * 50);
        });
        chipObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skills-chips').forEach(group => {
    const chips = group.querySelectorAll('.chip');
    chips.forEach(chip => {
      chip.style.opacity = '0';
      chip.style.transform = 'translateY(10px)';
      chip.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    chipObserver.observe(group);
  });

  // ==========================================================================
  // Console Easter Egg
  // ==========================================================================
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║                                           ║
  ║   > SYSTEM INITIALIZED                    ║
  ║   > USER: Yi-Ting Lin                     ║
  ║   > STATUS: Online                        ║
  ║                                           ║
  ║   Looking for the source?                 ║
  ║   github.com/Error0229/Error0229.github.io║
  ║                                           ║
  ╚═══════════════════════════════════════════╝
  `);

})();
