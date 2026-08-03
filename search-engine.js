/**
 * SANĀTANA DHARMA SEMANTIC SEARCH & COMMAND PALETTE (CTRL + K)
 * Natural language query engine with multi-faceted filtering across Scriptures, Verses, Entities, and Agent Skills.
 */

(function () {
  const SearchEngine = {
    isOpen: false,

    init: function () {
      this.bindKeyboardShortcut();
    },

    bindKeyboardShortcut: function () {
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          this.toggleCommandPalette();
        } else if (e.key === 'Escape' && this.isOpen) {
          this.closeCommandPalette();
        }
      });
    },

    toggleCommandPalette: function () {
      if (this.isOpen) {
        this.closeCommandPalette();
      } else {
        this.openCommandPalette();
      }
    },

    openCommandPalette: function () {
      let modal = document.getElementById('search-palette-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'search-palette-modal';
        modal.className = 'pdf-modal-overlay';
        modal.style.zIndex = '200000';
        modal.innerHTML = `
          <div class="pdf-modal-container" style="max-width: 750px; width: 92vw; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.9);">
            <div style="padding: 16px 20px; background: rgba(20,15,10,0.95); border-bottom: 1px solid var(--line); display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 20px;">🔍</span>
              <input 
                type="text" 
                id="commandPaletteInput" 
                placeholder="Search anything (e.g. 'What is Karma?', 'Brahman', 'Krishna', 'Rig Veda')..." 
                style="flex: 1; background: transparent; border: none; outline: none; color: var(--ivory); font-family: var(--serif-body); font-size: 18px;"
                oninput="window.SearchEngine.handleInput(this.value)"
              >
              <kbd style="background: rgba(255,255,255,0.1); color: var(--muted); font-size: 11px; padding: 3px 7px; border-radius: 4px; font-family: var(--mono);">ESC</kbd>
            </div>

            <!-- Multi-Facet Category Filters -->
            <div style="padding: 10px 20px; background: rgba(0,0,0,0.4); border-bottom: 1px solid var(--line); display: flex; gap: 10px; flex-wrap: wrap;">
              <button onclick="window.SearchEngine.filterFacet('all')" class="cat-tab active" style="font-size: 11px; padding: 4px 10px;">ALL</button>
              <button onclick="window.SearchEngine.filterFacet('entities')" class="cat-tab" style="font-size: 11px; padding: 4px 10px;">GRAPH ENTITIES</button>
              <button onclick="window.SearchEngine.filterFacet('verses')" class="cat-tab" style="font-size: 11px; padding: 4px 10px;">VERSES & SHLOKAS</button>
              <button onclick="window.SearchEngine.filterFacet('skills')" class="cat-tab" style="font-size: 11px; padding: 4px 10px;">AGENT SKILLS</button>
            </div>

            <!-- Search Results Container -->
            <div id="commandPaletteResults" style="max-height: 60vh; overflow-y: auto; padding: 20px; background: #0a0705;">
              <div style="color: var(--muted); text-align: center; padding: 30px 10px; font-family: var(--mono); font-size: 13px;">
                Type a query or Sanskrit keyword to search across 23,800+ verses, 20 scriptures, and knowledge graph entities...
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      }

      modal.classList.add('open');
      this.isOpen = true;
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        const input = document.getElementById('commandPaletteInput');
        if (input) {
          input.focus();
          input.select();
        }
      }, 100);
    },

    closeCommandPalette: function () {
      const modal = document.getElementById('search-palette-modal');
      if (modal) modal.classList.remove('open');
      this.isOpen = false;
      document.body.style.overflow = '';
    },

    currentFacet: 'all',

    filterFacet: function (facet) {
      this.currentFacet = facet;
      const input = document.getElementById('commandPaletteInput');
      if (input) this.handleInput(input.value);
    },

    handleInput: function (query) {
      const resultsContainer = document.getElementById('commandPaletteResults');
      if (!resultsContainer) return;

      if (!query || query.trim().length < 2) {
        resultsContainer.innerHTML = `
          <div style="color: var(--muted); text-align: center; padding: 30px 10px; font-family: var(--mono); font-size: 13px;">
            Type a query or Sanskrit keyword to search across 23,800+ verses, 20 scriptures, and knowledge graph entities...
          </div>
        `;
        return;
      }

      const q = query.toLowerCase().trim();
      let html = '';

      // 1. Search Knowledge Graph Entities
      if ((this.currentFacet === 'all' || this.currentFacet === 'entities') && window.KNOWLEDGE_GRAPH) {
        const matchingEntities = window.KNOWLEDGE_GRAPH.searchNodes(q);
        if (matchingEntities.length > 0) {
          html += `<div style="font-family: var(--mono); font-size: 11px; color: var(--gold-bright); text-transform: uppercase; margin-bottom: 10px;">⚡ Knowledge Graph Entities (${matchingEntities.length}):</div>`;
          matchingEntities.forEach(entity => {
            html += `
              <div 
                onclick="window.SearchEngine.closeCommandPalette(); window.EntityViewer.openEntityModal('${entity.id}')"
                style="background: rgba(212,160,23,0.08); border: 1px solid var(--line-strong); border-radius: 12px; padding: 14px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s ease;"
                onmouseover="this.style.borderColor='var(--gold-bright)'"
                onmouseout="this.style.borderColor='var(--line-strong)'"
              >
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div style="font-family: var(--serif-display); font-size: 18px; color: var(--gold-bright); font-weight:700;">${entity.name}</div>
                  <span style="font-family: var(--mono); font-size: 10px; padding: 2px 8px; border: 1px solid var(--gold); border-radius: 12px; color: var(--gold);">${entity.category}</span>
                </div>
                <div style="font-size: 13px; color: var(--ivory); margin-top: 4px;">${entity.summary}</div>
              </div>
            `;
          });
        }
      }

      // 2. Search Agent Skills
      if ((this.currentFacet === 'all' || this.currentFacet === 'skills') && window.MASTER_SKILLS) {
        const matchingSkills = Object.values(window.MASTER_SKILLS).filter(s =>
          s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q)
        );
        if (matchingSkills.length > 0) {
          html += `<div style="font-family: var(--mono); font-size: 11px; color: var(--gold-bright); text-transform: uppercase; margin: 16px 0 10px;">🛠 Agent Skill Bundles (${matchingSkills.length}):</div>`;
          matchingSkills.slice(0, 4).forEach(skill => {
            html += `
              <div 
                onclick="window.SearchEngine.closeCommandPalette(); if(window.openReader) window.openReader('${skill.title}', '${skill.slug}')"
                style="background: rgba(255,255,255,0.04); border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; cursor: pointer;"
              >
                <div style="font-family: var(--serif-display); font-size: 16px; color: var(--ivory);">📚 ${skill.title}</div>
                <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">${skill.summary}</div>
              </div>
            `;
          });
        }
      }

      // 3. Search Verses & Passages
      if ((this.currentFacet === 'all' || this.currentFacet === 'verses') && window.MASTER_VERSES) {
        const matchingVerses = window.MASTER_VERSES.filter(v =>
          v.content.toLowerCase().includes(q) || (v.book && v.book.toLowerCase().includes(q))
        );

        if (matchingVerses.length > 0) {
          html += `<div style="font-family: var(--mono); font-size: 11px; color: var(--gold-bright); text-transform: uppercase; margin: 16px 0 10px;">📜 Scriptural Verses & Passages (${matchingVerses.length} matches):</div>`;
          matchingVerses.slice(0, 8).forEach(v => {
            html += `
              <div class="shloka-block" style="margin-bottom: 12px; padding: 12px 16px;">
                <div style="font-family: var(--mono); font-size: 11px; color: var(--vermillion); margin-bottom: 4px;">Book: ${v.book} · Page ${v.page}</div>
                <div class="shloka-translation" style="font-size: 14px; line-height: 1.6; font-style: normal; color: var(--ivory);">${v.content}</div>
              </div>
            `;
          });
        }
      }

      if (!html) {
        html = `
          <div style="color: var(--muted); text-align: center; padding: 30px 10px; font-family: var(--mono); font-size: 13px;">
            No results found for "${query}". Try searching for terms like "Karma", "Brahman", "Moksha", "Rig Veda", or "Krishna".
          </div>
        `;
      }

      resultsContainer.innerHTML = html;
    }
  };

  window.SearchEngine = SearchEngine;

  document.addEventListener('DOMContentLoaded', () => {
    SearchEngine.init();
  });
})();
