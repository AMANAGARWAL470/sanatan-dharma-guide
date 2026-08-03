/**
 * SANĀTANA DHARMA ENTITY & MULTI-LAYER LEARNING READER (LEVEL 1 TO LEVEL 5)
 * Dynamically renders complete reference views for any Knowledge Graph Entity.
 */

(function () {
  const EntityViewer = {
    currentEntityId: null,
    currentLevel: 1,

    openEntityModal: function (entityId) {
      if (!window.KNOWLEDGE_GRAPH) return;

      const entity = window.KNOWLEDGE_GRAPH.getNode(entityId);
      if (!entity) return;

      this.currentEntityId = entityId;
      this.currentLevel = 1;

      let modal = document.getElementById('entity-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'entity-modal';
        modal.className = 'pdf-modal-overlay';
        modal.innerHTML = `
          <div class="pdf-modal-container" style="max-width: 900px;">
            <div class="pdf-modal-header">
              <div class="pdf-modal-title" id="entityModalTitle">Entity Reference</div>
              <div style="display:flex; gap:12px; align-items:center;">
                <button class="pdf-modal-close" onclick="window.EntityViewer.closeEntityModal()">✕ Close</button>
              </div>
            </div>
            <div class="pdf-modal-body" id="entityModalContent" style="padding: 24px 28px;"></div>
          </div>
        `;
        document.body.appendChild(modal);
      }

      this.renderEntityContent(entity);
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';

      if (typeof window.playTempleChime === 'function') {
        window.playTempleChime(432, 2.0);
      }
    },

    closeEntityModal: function () {
      const modal = document.getElementById('entity-modal');
      if (modal) {
        modal.classList.remove('open');
      }
      document.body.style.overflow = '';
    },

    switchLevel: function (levelNum) {
      this.currentLevel = levelNum;
      const entity = window.KNOWLEDGE_GRAPH.getNode(this.currentEntityId);
      if (entity) {
        this.renderEntityContent(entity);
      }
    },

    renderEntityContent: function (entity) {
      const contentEl = document.getElementById('entityModalContent');
      document.getElementById('entityModalTitle').textContent = entity.name;

      const categoryInfo = window.KNOWLEDGE_GRAPH.categories[entity.category.toUpperCase()] || { label: entity.category, color: '#d4a017' };
      const edges = window.KNOWLEDGE_GRAPH.getEdgesForNode(entity.id);

      let html = `
        <!-- Entity Header Badge -->
        <div style="background: rgba(212,160,23,0.08); border: 1px solid var(--line-strong); border-radius: 16px; padding: 20px 24px; margin-bottom: 24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom: 8px;">
            <h2 style="font-family: var(--serif-display); font-size: clamp(26px, 4vw, 36px); color: var(--gold-bright);">${entity.name}</h2>
            <span style="font-family: var(--mono); font-size: 11px; padding: 4px 12px; background: ${categoryInfo.color}22; border: 1px solid ${categoryInfo.color}; color: ${categoryInfo.color}; border-radius: 20px; text-transform: uppercase;">${categoryInfo.label}</span>
          </div>
          <p style="font-size: 16px; color: var(--ivory); line-height: 1.6; margin-bottom: 12px;">${entity.summary}</p>
          ${entity.sanskrit ? `
            <div class="shloka-block" style="margin-top: 14px; padding: 14px 18px;">
              <div class="shloka-sanskrit" style="font-size: 18px;">${entity.sanskrit}</div>
              <div style="font-family: var(--mono); font-size: 12px; color: var(--muted); margin-top: 4px;">${entity.transliteration}</div>
              <div class="shloka-translation" style="font-size: 14px; margin-top: 6px; font-style: normal; color: var(--gold-bright);">"${entity.meaning}"</div>
              ${entity.citation ? `<div class="shloka-citation" style="font-size: 11px; margin-top: 4px;">— ${entity.citation}</div>` : ''}
            </div>
          ` : ''}
        </div>

        <!-- 5-Level Learning Difficulty Selector -->
        <div style="margin-bottom: 20px;">
          <div style="font-family: var(--mono); font-size: 12px; color: var(--gold-bright); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">
            🎓 Multi-Layer Learning Levels (Select Depth):
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${[
          { num: 1, label: "Level 1: Beginner Summary" },
          { num: 2, label: "Level 2: Conceptual Depth" },
          { num: 3, label: "Level 3: Philosophical Tradition" },
          { num: 4, label: "Level 4: Scriptural Analysis" },
          { num: 5, label: "Level 5: Sanskrit & Commentary" }
        ].map(lvl => `
              <button 
                onclick="window.EntityViewer.switchLevel(${lvl.num})" 
                style="padding: 8px 14px; font-family: var(--mono); font-size: 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; ${this.currentLevel === lvl.num
            ? 'background: var(--gold-bright); color: #0a0705; font-weight: 700; border: 1px solid var(--gold-bright);'
            : 'background: rgba(255,255,255,0.05); color: var(--muted); border: 1px solid var(--line);'
          }">
                ${lvl.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Level Content View -->
        <div style="background: var(--bg-panel); border: 1px solid var(--line-strong); border-radius: 14px; padding: 22px; margin-bottom: 24px; min-height: 120px;">
          <div style="font-family: var(--mono); font-size: 11px; color: var(--vermillion); text-transform: uppercase; margin-bottom: 8px;">
            Reading Level ${this.currentLevel} Explanation:
          </div>
          <div style="font-size: 16px; line-height: 1.8; color: var(--ivory); font-family: var(--serif-body);">
            ${entity.levels && entity.levels[`l${this.currentLevel}`]
          ? entity.levels[`l${this.currentLevel}`]
          : entity.summary
        }
          </div>
        </div>

        <!-- Knowledge Graph Connections -->
        ${edges.length > 0 ? `
          <div style="margin-top: 28px; border-top: 1px solid var(--line); padding-top: 20px;">
            <h3 style="font-family: var(--serif-display); font-size: 20px; color: var(--gold-bright); margin-bottom: 12px;">🔗 Connected Knowledge Graph Nodes:</h3>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              ${edges.map(e => {
          const otherId = e.source === entity.id ? e.target : e.source;
          const otherNode = window.KNOWLEDGE_GRAPH.getNode(otherId);
          if (!otherNode) return '';
          return `
                  <button 
                    onclick="window.EntityViewer.openEntityModal('${otherNode.id}')"
                    style="background: rgba(212,160,23,0.12); border: 1px solid var(--line-strong); color: var(--ivory); padding: 8px 14px; border-radius: 20px; font-size: 13px; font-family: var(--mono); cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s ease;"
                    onmouseover="this.style.borderColor='var(--gold-bright)'" 
                    onmouseout="this.style.borderColor='var(--line-strong)'"
                  >
                    <span>⚡ ${otherNode.name}</span>
                    <span style="font-size: 10px; color: var(--muted);">(${e.label})</span>
                  </button>
                `;
        }).join('')}
            </div>
          </div>
        ` : ''}
      `;

      contentEl.innerHTML = html;
    }
  };

  window.EntityViewer = EntityViewer;
})();
