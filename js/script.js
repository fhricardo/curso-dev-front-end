// ======================
// UTILIDADES
// ======================

// Atualiza o ano atual
const yearElement = document.querySelector('#year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// ======================
// TOGGLE DE RESPOSTAS
// ======================
const setupResponseToggle = () => {
    const checkbox = document.getElementById('toggleRespostas');
    if (!checkbox) return;

    checkbox.addEventListener('change', () => {
        const responses = document.querySelectorAll('.responses');
        responses.forEach(response => {
            response.style.display = checkbox.checked ? 'block' : 'none';
        });
    });
};

// ======================
// CARREGAR CONTEÚDOS
// ======================
const loadPageContent = (target) => {
    if (!target) return;

    fetch(target)
        .then(response => response.text())
        .then(html => {
            const contentContainer = document.querySelector('.contents');
            if (contentContainer) {
                contentContainer.innerHTML = html;

                activateImageHover();

                // Realce de sintaxe (se existir)
                if (typeof applySyntax === 'function') {
                    applySyntax();
                }
            }
        })
        .catch(error => console.error('Erro ao carregar página:', error));
};

// Detecta os parâmetros da URL e carrega a página correspondente
const loadFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const modulo = params.get("modulo");
    const aula = params.get("aula");

    if (modulo && aula) {
        loadPageContent(`contents/${modulo}/${aula}.html`);
    } else {
        // fallback: conteúdo inicial
        const path = window.location.pathname;
        const page = path.split("/").pop();
        const pageName = page.replace(".html", "");
        if (pageName == 'index') {
            loadPageContent(`contents/intro.html`);
        } else if (pageName == 'sobre') {
            loadPageContent(`contents/sobre.html`)
        } else {
            loadPageContent(`contents/${pageName}/intro.html`);
        }
    }
};

// ======================
// IMAGENS COM HOVER
// ======================
const activateImageHover = () => {
    const figures = document.querySelectorAll('.example img');
    figures.forEach(img => {
        const originalSrc = img.getAttribute('src');
        const hoverSrc = img.getAttribute('data-hover');

        if (hoverSrc) {
            img.addEventListener('mouseover', () => img.setAttribute('src', hoverSrc));
            img.addEventListener('mouseout', () => img.setAttribute('src', originalSrc));
        }
    });
};

// ======================
// MODAL
// ======================
const modal = document.querySelector("#meuModal");
const modalContent = modal?.querySelector(".contentModal");

const loadModalContent = async (url, selector = ".contentModal") => {
    if (!url || !modal || !modalContent) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Página não encontrada");

        const html = await response.text();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        const content = tempDiv.querySelector(selector);

        modalContent.innerHTML = content?.innerHTML || "<p>Conteúdo não encontrado.</p>";

        modal.style.display = "flex";
        requestAnimationFrame(() => modal.classList.add("show"));
    } catch (error) {
        console.error("Erro ao carregar modal:", error);
        modalContent.innerHTML = "<p>Erro ao carregar conteúdo.</p>";
        modal.style.display = "flex";
        requestAnimationFrame(() => modal.classList.add("show"));
    }
};

const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
        modalContent.innerHTML = "";
    }, 300);
};

// ======================
// MENU RESPONSIVO
// ======================
const toggleBtn = document.getElementById("toggleMenu");
const menu = document.getElementById("menu");
const submenu = document.getElementById("submenu");

if (toggleBtn) {
    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("showMenu");
    });
}

document.addEventListener("click", (e) => {
    if (menu?.classList.contains("showMenu") && !menu.contains(e.target) && e.target !== toggleBtn) {
        menu.classList.remove("showMenu");
    }
});

if (submenu) {
    submenu.addEventListener("click", (e) => {
        e.stopPropagation();
        submenu.classList.toggle("showSubMenu");
    });

    document.addEventListener("click", (e) => {
        if (submenu.classList.contains("showSubMenu") && !submenu.contains(e.target)) {
            submenu.classList.remove("showSubMenu");
        }
    });
}

// ======================
// INICIALIZAÇÃO
// ======================
document.addEventListener("DOMContentLoaded", () => {
    // Configura toggle de respostas
    setupResponseToggle();

    // Delegação de eventos para modal-trigger
    document.addEventListener("click", (e) => {
        const link = e.target.closest(".modal-trigger");
        if (link) {
            e.preventDefault();
            const url = link.getAttribute("href");
            const target = link.getAttribute("data-target");
            loadModalContent(url, target);
        }
    });

    // Fechar modal
    document.querySelector("#meuModal .close")?.addEventListener("click", closeModal);
    modal?.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Links internos com query string (sem reload)
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (link && link.href.includes("?modulo=")) {
            e.preventDefault();
            const url = new URL(link.href);

            history.pushState({}, "", url); // atualiza URL
            loadFromURL(); // carrega o conteúdo
        }
    });

    // Carrega a página inicial com base na URL
    loadFromURL();
});

// Suporte ao botão voltar/avançar
window.addEventListener("popstate", () => {
    loadFromURL();
});
