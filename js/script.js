// Atualiza o ano atual
const yearElement = document.querySelector('#year');
if (yearElement) {
    const getCurrentYear = () => new Date().getFullYear();
    yearElement.textContent = getCurrentYear();
}

// Funções para mostrar/ocultar respostas
const toggleResponseVisibility = (show) => {
    const responses = document.querySelectorAll('.responses');
    responses.forEach(response => {
        if (show) {
            response.classList.remove('hidden');
        } else {
            response.classList.add('hidden');
        }
    });
};

// Alternar respostas com checkbox
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

// Carregar páginas
const loadPageContent = (target) => {
    if (!target) return;

    fetch(target)
        .then(response => response.text())
        .then(html => {
            const contentContainer = document.querySelector('.contents');
            if (contentContainer) {
                contentContainer.innerHTML = html;
                activateImageHover(); // Ativa comportamento após o conteúdo ser inserido
                // Chama o realce de sintaxe
                if (typeof applySyntax === 'function') {
                    applySyntax();
                }
            }
        })
        .catch(error => console.error('Erro ao carregar página:', error));
};

// Função para trocar imagens no hover
const activateImageHover = () => {
    const figures = document.querySelectorAll('.example img');
    figures.forEach(img => {
        const originalSrc = img.getAttribute('src');
        const hoverSrc = img.getAttribute('data-hover');

        if (hoverSrc) {
            img.addEventListener('mouseover', () => {
                img.setAttribute('src', hoverSrc);
            });

            img.addEventListener('mouseout', () => {
                img.setAttribute('src', originalSrc);
            });
        }
    });
};


// Modal functions
const modal = document.querySelector("#meuModal");
const modalContent = modal?.querySelector(".content");

const loadModalContent = async (url, selector = ".content") => {
    if (!url || !modal || !modalContent) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Página não encontrada");

        const html = await response.text();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        const content = tempDiv.querySelector(selector);

        modalContent.innerHTML = content?.innerHTML || "<p>Conteúdo não encontrado.</p>";

        // Mostrar modal com animação
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
        modalContent.innerHTML = ""; // Limpa conteúdo ao fechar
    }, 300);
};


// Inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    // Configura toggle de respostas
    setupResponseToggle();

    // Configura triggers do modal
    document.querySelectorAll(".modal-trigger").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const url = this.getAttribute("href");
            const target = this.getAttribute("data-target");
            loadModalContent(url, target);
        });
    });

    // Configura fechamento do modal
    if (modal) {
        document.querySelector("#meuModal .close")?.addEventListener("click", closeModal);
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Configura efeito hover nas imagens
    setupImageHoverEffect();
});