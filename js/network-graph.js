/**
 * Interactive Skill-Project Network Graph
 * Force-directed graph using D3.js
 * Skills = Tech skills (languages, frameworks, tools)
 * Projects = Connected by the technologies they use
 */

(function() {
  'use strict';

  // ==========================================================================
  // Graph Data - Tech Skills and Projects with relationships
  // ==========================================================================

  // Tech skills grouped by type
  const skills = [
    // Languages
    { id: 'python', name: 'Python', type: 'language' },
    { id: 'typescript', name: 'TypeScript', type: 'language' },
    { id: 'javascript', name: 'JavaScript', type: 'language' },
    { id: 'csharp', name: 'C#', type: 'language' },
    { id: 'cpp', name: 'C++', type: 'language' },
    { id: 'go', name: 'Go', type: 'language' },
    { id: 'solidity', name: 'Solidity', type: 'language' },
    { id: 'ocaml', name: 'OCaml', type: 'language' },
    { id: 'x86asm', name: 'x86-64 ASM', type: 'language' },

    // Frameworks & Libraries
    { id: 'react', name: 'React', type: 'framework' },
    { id: 'nextjs', name: 'Next.js', type: 'framework' },
    { id: 'svelte', name: 'Svelte', type: 'framework' },
    { id: 'sveltekit', name: 'SvelteKit', type: 'framework' },
    { id: 'vue', name: 'Vue', type: 'framework' },
    { id: 'unity', name: 'Unity', type: 'framework' },
    { id: 'dotnet', name: '.NET', type: 'framework' },
    { id: 'winforms', name: 'WinForms', type: 'framework' },
    { id: 'fastapi', name: 'FastAPI', type: 'framework' },
    { id: 'echo', name: 'Echo', type: 'framework' },
    { id: 'honojs', name: 'Hono.js', type: 'framework' },
    { id: 'tamagui', name: 'Tamagui', type: 'framework' },
    { id: 'radixui', name: 'Radix UI', type: 'framework' },
    { id: 'tailwind', name: 'Tailwind', type: 'framework' },
    { id: 'p5js', name: 'p5.js', type: 'framework' },
    { id: 'directx', name: 'DirectX', type: 'framework' },

    // AI/ML
    { id: 'pytorch', name: 'PyTorch', type: 'ai' },
    { id: 'tensorflow', name: 'TensorFlow', type: 'ai' },
    { id: 'keras', name: 'Keras', type: 'ai' },
    { id: 'huggingface', name: 'HuggingFace', type: 'ai' },
    { id: 'bert', name: 'BERT', type: 'ai' },
    { id: 'diengine', name: 'DI-engine', type: 'ai' },
    { id: 'gymnasium', name: 'Gymnasium', type: 'ai' },
    { id: 'flair', name: 'Flair NLP', type: 'ai' },

    // DevOps & Tools
    { id: 'docker', name: 'Docker', type: 'devops' },
    { id: 'postgresql', name: 'PostgreSQL', type: 'devops' },
    { id: 'mongodb', name: 'MongoDB', type: 'devops' },
    { id: 'minio', name: 'MinIO', type: 'devops' },
    { id: 'hardhat', name: 'Hardhat', type: 'devops' },
    { id: 'websocket', name: 'WebSocket', type: 'devops' },
    { id: 'cloudflare', name: 'Cloudflare', type: 'devops' },
    { id: 'menhir', name: 'Menhir', type: 'devops' },
    { id: 'dune', name: 'Dune', type: 'devops' },

    // Web3
    { id: 'ethersjs', name: 'ethers.js', type: 'web3' },
    { id: 'web3js', name: 'Web3.js', type: 'web3' },
    { id: 'openzeppelin', name: 'OpenZeppelin', type: 'web3' },
  ];

  // Projects with their tech stack (comprehensive from research)
  const projects = [
    {
      id: 'naive-framework',
      name: 'Naive-Framework',
      url: 'https://github.com/NTUT-RL-Lab/Naive-Framework',
      skills: ['python', 'diengine', 'pytorch', 'gymnasium']
    },
    {
      id: 'mahjongai',
      name: 'MahjongAI',
      url: 'https://github.com/Error0229/MahjongAI2022',
      skills: ['python', 'tensorflow', 'keras']
    },
    {
      id: 'coviev2',
      name: 'CovieV2',
      url: 'https://github.com/Error0229/CovieV2',
      skills: ['python', 'bert', 'huggingface', 'flair', 'honojs', 'cloudflare']
    },
    {
      id: 'clipper',
      name: 'clipper',
      url: 'https://github.com/Error0229/clipper',
      skills: ['solidity', 'svelte', 'sveltekit', 'hardhat', 'web3js', 'openzeppelin']
    },
    {
      id: 'pepecard',
      name: 'PepeCard',
      url: 'https://github.com/Error0229/PepeCard',
      skills: ['nextjs', 'react', 'solidity', 'typescript', 'radixui', 'tailwind', 'ethersjs']
    },
    {
      id: 'twp',
      name: 'twp',
      url: 'https://github.com/jykuo-love-shiritori/twp',
      skills: ['go', 'echo', 'react', 'postgresql', 'docker', 'minio']
    },
    {
      id: 'covie',
      name: 'Covie',
      url: 'https://github.com/Error0229/Covie',
      skills: ['python', 'vue']
    },
    {
      id: 'orapa',
      name: 'orapa-mine',
      url: 'https://github.com/Error0229/orapa-mine',
      skills: ['python', 'fastapi', 'react', 'tamagui', 'postgresql', 'websocket']
    },
    {
      id: 'eversnow',
      name: 'EverSnow',
      url: 'https://github.com/Error0229/EverSnow',
      skills: ['csharp', 'unity', 'mongodb']
    },
    {
      id: 'esdialog',
      name: 'ESDialogEditor',
      url: 'https://github.com/Error0229/ESDialogEditor',
      skills: ['nextjs', 'typescript', 'radixui', 'tailwind']
    },
    {
      id: 'lcrpg',
      name: 'LCRPG',
      url: 'https://github.com/Error0229/LCRPG',
      skills: ['csharp', 'unity']
    },
    {
      id: 'vampire',
      name: 'Vampire-Survivors',
      url: 'https://github.com/Error0229/Vampire-Survivors-KEKW',
      skills: ['cpp', 'directx']
    },
    {
      id: 'csf',
      name: 'cs-f',
      url: 'https://github.com/Error0229/cs-f',
      skills: ['csharp', 'dotnet']
    },
    {
      id: 'pulsar',
      name: 'Pulsar',
      url: 'https://github.com/Error0229/Pulsar',
      skills: ['csharp', 'dotnet']
    },
    {
      id: 'b1ack',
      name: 'B1ack',
      url: 'https://github.com/Error0229/B1ack',
      skills: ['javascript']
    },
    {
      id: 'compo',
      name: 'Compo',
      url: 'https://github.com/Error0229/Compo',
      skills: ['ocaml', 'x86asm', 'menhir', 'dune']
    },
    {
      id: 'p5077',
      name: 'P5077',
      url: 'https://github.com/Error0229/P5077',
      skills: ['javascript', 'p5js']
    },
    {
      id: 'powerpoint2077',
      name: 'PowerPoint2077',
      url: 'https://github.com/Error0229/PowerPoint2077',
      skills: ['csharp', 'dotnet', 'winforms']
    }
  ];

  // ==========================================================================
  // Color Scheme - Clean, consistent palette
  // ==========================================================================

  const typeColors = {
    language: '#60a5fa',   // Blue
    framework: '#4ade80',  // Green
    ai: '#c084fc',         // Purple
    devops: '#fbbf24',     // Yellow
    web3: '#00d9ff',       // Cyan
    project: '#f0f6fc'     // White/Light
  };

  // ==========================================================================
  // Build Graph Structure
  // ==========================================================================

  function buildGraph() {
    const nodes = [];
    const links = [];
    const usedSkills = new Set();

    // First pass: identify which skills are actually used
    projects.forEach(project => {
      project.skills.forEach(skillId => usedSkills.add(skillId));
    });

    // Add only used skill nodes
    skills.forEach(skill => {
      if (usedSkills.has(skill.id)) {
        nodes.push({
          id: skill.id,
          name: skill.name,
          nodeType: 'skill',
          skillType: skill.type,
          color: typeColors[skill.type]
        });
      }
    });

    // Add project nodes and links
    projects.forEach(project => {
      nodes.push({
        id: project.id,
        name: project.name,
        nodeType: 'project',
        url: project.url,
        color: typeColors.project
      });

      // Create links to skills
      project.skills.forEach(skillId => {
        if (usedSkills.has(skillId)) {
          links.push({
            source: project.id,
            target: skillId
          });
        }
      });
    });

    return { nodes, links };
  }

  // ==========================================================================
  // Initialize D3 Force Graph
  // ==========================================================================

  function initGraph() {
    const container = document.getElementById('network-graph');
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Get container dimensions
    const rect = container.getBoundingClientRect();
    const width = rect.width || 900;
    const height = Math.max(550, Math.min(650, window.innerHeight * 0.65));

    // Build graph data
    const { nodes, links } = buildGraph();

    // Create SVG
    const svg = d3.select('#network-graph')
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Add defs for glow filter
    const defs = svg.append('defs');

    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '2.5')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        .distance(80)
        .strength(0.4))
      .force('charge', d3.forceManyBody()
        .strength(d => d.nodeType === 'skill' ? -300 : -200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide()
        .radius(d => d.nodeType === 'skill' ? 35 : 30))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    // Create container groups
    const linkGroup = svg.append('g').attr('class', 'links');
    const nodeGroup = svg.append('g').attr('class', 'nodes');

    // Draw links
    const link = linkGroup.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'graph-link')
      .attr('stroke', 'rgba(96, 165, 250, 0.25)')
      .attr('stroke-width', 1);

    // Draw nodes
    const node = nodeGroup.selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', d => `graph-node graph-node--${d.nodeType}`)
      .style('cursor', d => d.nodeType === 'project' ? 'pointer' : 'grab')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Skill nodes - rounded rectangle
    node.filter(d => d.nodeType === 'skill')
      .append('rect')
      .attr('width', 60)
      .attr('height', 24)
      .attr('x', -30)
      .attr('y', -12)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', 'rgba(10, 15, 20, 0.9)')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1.5);

    // Project nodes - circle
    node.filter(d => d.nodeType === 'project')
      .append('circle')
      .attr('r', 6)
      .attr('fill', d => d.color)
      .attr('stroke', 'rgba(10, 15, 20, 0.8)')
      .attr('stroke-width', 1);

    // Skill labels (inside node)
    node.filter(d => d.nodeType === 'skill')
      .append('text')
      .attr('class', 'node-label')
      .attr('dy', 4)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.color)
      .attr('font-size', '9px')
      .attr('font-family', "'IBM Plex Mono', monospace")
      .attr('font-weight', '500')
      .text(d => d.name);

    // Project labels (outside node)
    node.filter(d => d.nodeType === 'project')
      .append('text')
      .attr('class', 'node-label project-label')
      .attr('dx', 10)
      .attr('dy', 3)
      .attr('text-anchor', 'start')
      .attr('fill', 'rgba(240, 246, 252, 0.7)')
      .attr('font-size', '8px')
      .attr('font-family', "'IBM Plex Mono', monospace")
      .attr('font-weight', '400')
      .text(d => d.name);

    // ==========================================================================
    // Interactions
    // ==========================================================================

    node.on('mouseenter', function(event, d) {
      const connectedIds = new Set();
      connectedIds.add(d.id);

      links.forEach(l => {
        const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
        const targetId = typeof l.target === 'object' ? l.target.id : l.target;

        if (sourceId === d.id) connectedIds.add(targetId);
        if (targetId === d.id) connectedIds.add(sourceId);
      });

      // Dim unconnected nodes
      node.style('opacity', n => connectedIds.has(n.id) ? 1 : 0.15);

      // Highlight connected links
      link
        .attr('stroke', l => {
          const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
          const targetId = typeof l.target === 'object' ? l.target.id : l.target;
          if (sourceId === d.id || targetId === d.id) {
            // Get the skill color for the link
            const skillNode = nodes.find(n => n.id === (sourceId === d.id ? targetId : sourceId) && n.nodeType === 'skill');
            return skillNode ? skillNode.color : 'rgba(0, 217, 255, 0.8)';
          }
          return 'rgba(96, 165, 250, 0.1)';
        })
        .attr('stroke-width', l => {
          const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
          const targetId = typeof l.target === 'object' ? l.target.id : l.target;
          return (sourceId === d.id || targetId === d.id) ? 2 : 1;
        });

      showTooltip(event, d, connectedIds, nodes);
    });

    node.on('mouseleave', function() {
      node.style('opacity', 1);
      link
        .attr('stroke', 'rgba(96, 165, 250, 0.25)')
        .attr('stroke-width', 1);
      hideTooltip();
    });

    // Click to open project URL
    node.filter(d => d.nodeType === 'project')
      .on('click', function(event, d) {
        if (d.url) {
          window.open(d.url, '_blank', 'noopener');
        }
      });

    // ==========================================================================
    // Drag Handlers
    // ==========================================================================

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // ==========================================================================
    // Simulation Tick
    // ==========================================================================

    simulation.on('tick', () => {
      nodes.forEach(d => {
        const padding = 40;
        d.x = Math.max(padding, Math.min(width - padding, d.x));
        d.y = Math.max(padding, Math.min(height - padding, d.y));
      });

      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // ==========================================================================
    // Tooltip
    // ==========================================================================

    let tooltip = d3.select('#network-graph')
      .append('div')
      .attr('class', 'graph-tooltip')
      .style('opacity', 0);

    function showTooltip(event, d, connectedIds, allNodes) {
      let content = '';

      if (d.nodeType === 'skill') {
        const connectedProjects = allNodes.filter(n =>
          n.nodeType === 'project' && connectedIds.has(n.id) && n.id !== d.id
        );
        content = `<strong>${d.name}</strong><br><span class="tooltip-sub">${connectedProjects.length} project${connectedProjects.length !== 1 ? 's' : ''}</span>`;
      } else {
        const connectedSkills = allNodes.filter(n =>
          n.nodeType === 'skill' && connectedIds.has(n.id)
        ).map(n => n.name);
        content = `<strong>${d.name}</strong><br><span class="tooltip-sub">${connectedSkills.join(', ')}</span><br><span class="tooltip-action">Click to open GitHub</span>`;
      }

      const containerRect = container.getBoundingClientRect();
      const tooltipX = Math.min(event.offsetX + 15, containerRect.width - 180);
      const tooltipY = event.offsetY - 10;

      tooltip
        .html(content)
        .style('left', tooltipX + 'px')
        .style('top', tooltipY + 'px')
        .style('opacity', 1);
    }

    function hideTooltip() {
      tooltip.style('opacity', 0);
    }

    // ==========================================================================
    // Resize Handler
    // ==========================================================================

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newRect = container.getBoundingClientRect();
        const newWidth = newRect.width || 900;
        svg.attr('viewBox', `0 0 ${newWidth} ${height}`);
        simulation.force('center', d3.forceCenter(newWidth / 2, height / 2));
        simulation.force('x', d3.forceX(newWidth / 2).strength(0.05));
        simulation.alpha(0.3).restart();
      }, 250);
    });
  }

  // ==========================================================================
  // Initialize on DOM Ready
  // ==========================================================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGraph);
  } else {
    initGraph();
  }

})();
