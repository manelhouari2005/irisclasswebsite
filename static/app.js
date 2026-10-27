document.addEventListener('DOMContentLoaded', () => {
  const inputs = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'];
  
  // Link sliders and numerical inputs together
  inputs.forEach(id => {
    const range = document.getElementById(`${id}_range`);
    const num = document.getElementById(id);
    const badge = document.getElementById(`${id}_val`);

    if (range && num) {
      range.addEventListener('input', (e) => {
        num.value = parseFloat(e.target.value).toFixed(1);
        if (badge) badge.textContent = `${num.value} cm`;
      });

      num.addEventListener('input', (e) => {
        range.value = e.target.value;
        if (badge) badge.textContent = `${parseFloat(e.target.value || 0).toFixed(1)} cm`;
      });
    }
  });

  // Preset quick fill
  window.loadPreset = function(sl, sw, pl, pw) {
    document.getElementById('sepal_length').value = sl;
    document.getElementById('sepal_length_range').value = sl;
    document.getElementById('sepal_length_val').textContent = `${sl} cm`;

    document.getElementById('sepal_width').value = sw;
    document.getElementById('sepal_width_range').value = sw;
    document.getElementById('sepal_width_val').textContent = `${sw} cm`;

    document.getElementById('petal_length').value = pl;
    document.getElementById('petal_length_range').value = pl;
    document.getElementById('petal_length_val').textContent = `${pl} cm`;

    document.getElementById('petal_width').value = pw;
    document.getElementById('petal_width_range').value = pw;
    document.getElementById('petal_width_val').textContent = `${pw} cm`;

    // Trigger classification automatically on preset select
    classifyIris();
  };

  // Submit classifier function
  window.classifyIris = async function() {
    const btn = document.getElementById('btn-classify');
    const originalText = btn.innerHTML;
    
    // UI Loading state
    btn.disabled = true;
    btn.innerHTML = `<span style="display:inline-block; animation: spin 1s linear infinite;">⏳</span> Classifying...`;

    const payload = {
      sepal_length: parseFloat(document.getElementById('sepal_length').value),
      sepal_width: parseFloat(document.getElementById('sepal_width').value),
      petal_length: parseFloat(document.getElementById('petal_length').value),
      petal_width: parseFloat(document.getElementById('petal_width').value),
    };

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to get prediction');
        return;
      }

      displayResult(data);
    } catch (err) {
      console.error(err);
      alert('Network or server error while connecting to classifier.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  };

  function displayResult(data) {
    const placeholder = document.getElementById('result-placeholder');
    const content = document.getElementById('result-content');

    placeholder.style.display = 'none';
    content.style.display = 'flex';

    // Highlight section
    const speciesNameEl = document.getElementById('species-name');
    const confidenceBadge = document.getElementById('confidence-badge');
    const speciesDesc = document.getElementById('species-description');
    const petalRatio = document.getElementById('petal-ratio-info');

    speciesNameEl.textContent = data.display_name;
    speciesNameEl.style.color = data.badge_color || '#818cf8';
    confidenceBadge.textContent = `${data.confidence}% Confidence`;
    confidenceBadge.style.color = data.badge_color;
    confidenceBadge.style.borderColor = data.badge_color;
    speciesDesc.textContent = data.description;
    if (petalRatio) {
      petalRatio.textContent = data.petal_ratio;
    }

    // Probabilities list
    const probsContainer = document.getElementById('probabilities-container');
    probsContainer.innerHTML = '';

    const colors = {
      'setosa': '#10b981',
      'versicolor': '#6366f1',
      'virginica': '#ec4899'
    };

    for (const [species, pct] of Object.entries(data.probabilities)) {
      const probColor = colors[species] || '#6366f1';
      const isWinner = species === data.prediction;

      const item = document.createElement('div');
      item.className = 'prob-item';
      item.innerHTML = `
        <div class="prob-info">
          <span style="${isWinner ? 'font-weight:700; color:#fff;' : 'color:var(--text-muted);'}">
            Iris ${species.charAt(0).toUpperCase() + species.slice(1)} ${isWinner ? '★' : ''}
          </span>
          <span style="font-family: monospace; font-weight: 600;">${pct.toFixed(1)}%</span>
        </div>
        <div class="prob-track">
          <div class="prob-fill" style="width: 0%; background: ${probColor};"></div>
        </div>
      `;
      probsContainer.appendChild(item);

      // Trigger animation smoothly
      setTimeout(() => {
        const fill = item.querySelector('.prob-fill');
        if (fill) fill.style.width = `${pct}%`;
      }, 50);
    }

    // Dimension visual boxes
    document.getElementById('vis-sepal-ratio').textContent = 
      `${(data.inputs.sepal_length / data.inputs.sepal_width).toFixed(2)}x`;
    document.getElementById('vis-petal-ratio').textContent = 
      `${(data.inputs.petal_length / data.inputs.petal_width).toFixed(2)}x`;
  }
});
