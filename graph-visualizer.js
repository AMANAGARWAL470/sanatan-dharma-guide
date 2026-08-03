/**
 * SANĀTANA DHARMA INTERACTIVE KNOWLEDGE GRAPH VISUALIZER
 * 2D Canvas Force-Directed Network Visualizer for exploring connected entities.
 */

(function () {
  const GraphVisualizer = {
    canvas: null,
    ctx: null,
    animId: null,
    nodes: [],
    links: [],
    hoveredNode: null,
    selectedCategory: 'all',

    openGraphModal: function () {
      if (!window.KNOWLEDGE_GRAPH) return;

      let modal = document.getElementById('graph-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'graph-modal';
        modal.className = 'pdf-modal-overlay';
        modal.innerHTML = `
          <div class="pdf-modal-container" style="max-width: 1000px; width: 95vw; height: 85vh; display: flex; flex-direction: column;">
            <div class="pdf-modal-header">
              <div class="pdf-modal-title">🌌 Interactive Knowledge Graph Explorer</div>
              <button class="pdf-modal-close" onclick="window.GraphVisualizer.closeGraphModal()">✕ Close</button>
            </div>
            
            <!-- Category Filters -->
            <div style="padding: 12px 20px; background: rgba(0,0,0,0.3); border-bottom: 1px solid var(--line); display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
              <span style="font-family: var(--mono); font-size: 11px; color: var(--gold-bright);">FILTER BY:</span>
              <button onclick="window.GraphVisualizer.setFilter('all')" class="cat-tab active" style="font-size:11px; padding:4px 10px;">ALL NODES</button>
              ${Object.keys(window.KNOWLEDGE_GRAPH.categories).map(catKey => {
          const cat = window.KNOWLEDGE_GRAPH.categories[catKey];
          return `<button onclick="window.GraphVisualizer.setFilter('${cat.id}')" class="cat-tab" style="font-size:11px; padding:4px 10px; border-color:${cat.color}55;">${cat.label}</button>`;
        }).join('')}
            </div>

            <!-- Canvas Container -->
            <div style="flex: 1; position: relative; background: #070504; overflow: hidden;" id="graphCanvasContainer">
              <canvas id="knowledgeGraphCanvas" style="width: 100%; height: 100%; display: block;"></canvas>
              <div id="graphTooltip" style="position: absolute; display: none; background: rgba(15,10,7,0.95); border: 1px solid var(--gold-bright); padding: 10px 14px; border-radius: 8px; font-family: var(--serif); color: var(--ivory); pointer-events: none; max-width: 280px; z-index: 100; box-shadow: 0 10px 25px rgba(0,0,0,0.8);"></div>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      }

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        this.initCanvas();
      }, 100);
    },

    closeGraphModal: function () {
      const modal = document.getElementById('graph-modal');
      if (modal) modal.classList.remove('open');
      document.body.style.overflow = '';
      if (this.animId) cancelAnimationFrame(this.animId);
    },

    setFilter: function (catId) {
      this.selectedCategory = catId;
      this.initNodesAndLinks();
    },

    initCanvas: function () {
      const container = document.getElementById('graphCanvasContainer');
      this.canvas = document.getElementById('knowledgeGraphCanvas');
      if (!this.canvas || !container) return;

      this.canvas.width = container.clientWidth;
      this.canvas.height = container.clientHeight;
      this.ctx = this.canvas.getContext('2d');

      this.initNodesAndLinks();
      this.bindEvents();
      this.animate();
    },

    initNodesAndLinks: function () {
      const width = this.canvas.width;
      const height = this.canvas.height;

      let sourceNodes = window.KNOWLEDGE_GRAPH.nodes;
      if (this.selectedCategory !== 'all') {
        sourceNodes = sourceNodes.filter(n => n.category === this.selectedCategory);
      }

      const activeIds = new Set(sourceNodes.map(n => n.id));

      this.nodes = sourceNodes.map((n, idx) => {
        const angle = (idx / sourceNodes.length) * Math.PI * 2;
        const radius = Math.min(width, height) * 0.35;
        return {
          ...n,
          x: width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 40,
          y: height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: 18
        };
      });

      this.links = window.KNOWLEDGE_GRAPH.edges.filter(
        e => activeIds.has(e.source) && activeIds.has(e.target)
      );
    },

    bindEvents: function () {
      const container = document.getElementById('graphCanvasContainer');
      const tooltip = document.getElementById('graphTooltip');

      this.canvas.onmousemove = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        this.hoveredNode = null;
        for (let n of this.nodes) {
          const dx = mx - n.x;
          const dy = my - n.y;
          if (dx * dx + dy * dy <= (n.r + 5) * (n.r + 5)) {
            this.hoveredNode = n;
            break;
          }
        }

        if (this.hoveredNode) {
          this.canvas.style.cursor = 'pointer';
          tooltip.style.display = 'block';
          tooltip.style.left = `${mx + 15}px`;
          tooltip.style.top = `${my + 15}px`;
          tooltip.innerHTML = `
            <div style="font-family: var(--serif-display); font-size: 16px; color: var(--gold-bright); font-weight:700;">${this.hoveredNode.name}</div>
            <div style="font-size: 12px; color: var(--ivory); margin-top: 4px;">${this.hoveredNode.summary}</div>
            <div style="font-family: var(--mono); font-size: 10px; color: var(--vermillion); margin-top: 6px;">Click to view full entity details →</div>
          `;
        } else {
          this.canvas.style.cursor = 'default';
          tooltip.style.display = 'none';
        }
      };

      this.canvas.onclick = () => {
        if (this.hoveredNode && window.EntityViewer) {
          window.EntityViewer.openEntityModal(this.hoveredNode.id);
        }
      };
    },

    animate: function () {
      if (!this.ctx) return;
      const width = this.canvas.width;
      const height = this.canvas.height;

      this.ctx.clearRect(0, 0, width, height);

      // Force simulation damping
      for (let i = 0; i < this.nodes.length; i++) {
        const n1 = this.nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;

        // Bounce off canvas boundaries
        if (n1.x < 40 || n1.x > width - 40) n1.vx *= -1;
        if (n1.y < 40 || n1.y > height - 40) n1.vy *= -1;

        // Repulsion between nodes
        for (let j = i + 1; j < this.nodes.length; j++) {
          const n2 = this.nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 120) {
            const force = (120 - dist) / 120 * 0.05;
            n1.vx -= (dx / dist) * force;
            n1.vy -= (dy / dist) * force;
            n2.vx += (dx / dist) * force;
            n2.vy += (dy / dist) * force;
          }
        }
      }

      // Draw links
      this.ctx.strokeStyle = 'rgba(212, 160, 23, 0.2)';
      this.ctx.lineWidth = 1.5;
      for (let l of this.links) {
        const s = this.nodes.find(n => n.id === l.source);
        const t = this.nodes.find(n => n.id === l.target);
        if (s && t) {
          this.ctx.beginPath();
          this.ctx.moveTo(s.x, s.y);
          this.ctx.lineTo(t.x, t.y);
          this.ctx.stroke();
        }
      }

      // Draw nodes
      for (let n of this.nodes) {
        const categoryInfo = window.KNOWLEDGE_GRAPH.categories[n.category.toUpperCase()] || { color: '#d4a017' };
        const isHovered = this.hoveredNode === n;

        // Node Glow
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, isHovered ? n.r + 6 : n.r + 2, 0, Math.PI * 2);
        this.ctx.fillStyle = isHovered ? 'rgba(242, 193, 78, 0.4)' : `${categoryInfo.color}33`;
        this.ctx.fill();

        // Node Circle
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        this.ctx.fillStyle = categoryInfo.color;
        this.ctx.fill();
        this.ctx.strokeStyle = '#f5efe6';
        this.ctx.lineWidth = isHovered ? 3 : 1.5;
        this.ctx.stroke();

        // Node Label
        this.ctx.fillStyle = '#f5efe6';
        this.ctx.font = isHovered ? 'bold 13px "Cormorant Garamond", serif' : '11px "Cormorant Garamond", serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(n.name.split(' ')[0], n.x, n.y + n.r + 14);
      }

      this.animId = requestAnimationFrame(() => this.animate());
    }
  };

  window.GraphVisualizer = GraphVisualizer;
})();
