function renderGrid(data, category) {
    const gridContainer = document.querySelector('[data-grid="true"]');
    if (!gridContainer) {
        console.error('Grid container element not found');
        return;
    }
    
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }
    
    const validData = data.filter((item) => {
        if (!item.url) {
            console.error(`Item ${item.id} is missing a URL`);
            return false;
        }
        return category ? item.category === category : true;
    });
    
    validData.forEach((item, index) => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.setAttribute('data-id', item.id);
        gridItem.style.opacity = '0';
        gridItem.style.transition = `opacity 0.5s ease ${index * 150}ms`;

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('img-container');
        imgContainer.style.position = 'relative';
        imgContainer.style.display = 'inline-block';
        imgContainer.style.overflow = 'hidden';
        imgContainer.style.width = '100%';
        imgContainer.style.height = 'auto';
        imgContainer.style.boxSizing = 'border-box';

        // Original color image
        const img = document.createElement('img');
        img.src = item.url;
        img.alt = item.name;
        img.classList.add('base-image');
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.objectFit = 'cover';
        img.style.boxSizing = 'border-box';

        // Grayscale image overlay
        const grayscaleImg = document.createElement('img');
        grayscaleImg.src = item.url;
        grayscaleImg.alt = item.name;
        grayscaleImg.classList.add('grayscale-image');
        grayscaleImg.style.position = 'absolute';
        grayscaleImg.style.top = '0';
        grayscaleImg.style.left = '0';
        grayscaleImg.style.width = '100%';
        grayscaleImg.style.height = '99%';
        grayscaleImg.style.objectFit = 'cover';
        grayscaleImg.style.filter = 'grayscale(100%)';
        grayscaleImg.style.pointerEvents = 'none';
        grayscaleImg.style.clipPath = 'inset(0 75% 0 0)'; // Default to 25% grayscale

        // Set the clip path based on conditions
        if (item.headshots >= 100) {
            grayscaleImg.style.clipPath = 'inset(0 75% 0 0)'; // 25% grayscale
            if (item.special_1) {
                grayscaleImg.style.clipPath = 'inset(0 50% 0 0)'; // 50% grayscale
                if (item.special_2) {
                    grayscaleImg.style.clipPath = 'inset(0 25% 0 0)'; // 75% grayscale
                    if (item.gold) {
                        grayscaleImg.style.clipPath = 'inset(0 0% 0 0)'; // 100% grayscale
                    }
                }
            }
        } else {
            grayscaleImg.style.display = 'none'; // No grayscale if headshots < 100
        }

        imgContainer.appendChild(img);
        imgContainer.appendChild(grayscaleImg);
        gridItem.appendChild(imgContainer);

        if (item.headshots >= 100 && item.special_1 && item.special_2 && item.gold) {
            const overlay = document.createElement('img');
            overlay.src = '/img/done.webp';
            overlay.classList.add('overlay');
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            gridItem.appendChild(overlay);
        }

        gridContainer.appendChild(gridItem);

        // Trigger fade-in effect after appending
        requestAnimationFrame(() => {
            gridItem.style.opacity = '1';
        });
    });
}

function checkHeadshotsAndApplyGrayscale(data) {
    data.forEach((item) => {
        const gridItem = document.querySelector(`[data-id="${item.id}"] .img-container`);
        if (!gridItem) {
            console.error(`Grid item with ID ${item.id} not found`);
            return;
        }
        const grayscaleImg = gridItem.querySelector('.grayscale-image');

        // Apply or remove grayscale filter based on conditions
        if (item.headshots >= 100) {
            grayscaleImg.style.display = 'block';
            grayscaleImg.style.clipPath = 'inset(0 75% 0 0)'; // 25% grayscale
            if (item.special_1) {
                grayscaleImg.style.clipPath = 'inset(0 50% 0 0)'; // 50% grayscale
                if (item.special_2) {
                    grayscaleImg.style.clipPath = 'inset(0 25% 0 0)'; // 75% grayscale
                    if (item.gold) {
                        grayscaleImg.style.clipPath = 'inset(0 0% 0 0)'; // 100% grayscale
                    }
                }
            }
        } else {
            grayscaleImg.style.display = 'none';
        }
    });
}

window.addEventListener('load', () => {
    const scriptTag = document.querySelector('script[src="script.js"]');
    const category = scriptTag.getAttribute('param') || '';
    renderGrid(jsonData, category);
    checkHeadshotsAndApplyGrayscale(jsonData);
});
