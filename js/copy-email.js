(function () {
    const copyButtons = Array.from(document.querySelectorAll('[data-copy-email]'));
    const toast = document.getElementById('copy-toast');

    if (copyButtons.length === 0) {
        return;
    }

    let toastTimer = null;

    async function copyText(value) {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(value);
            return;
        }

        const tempInput = document.createElement('textarea');
        tempInput.value = value;
        tempInput.setAttribute('readonly', '');
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }

    function showToast(message, anchorElement) {
        if (!toast) {
            return;
        }

        toast.textContent = message;
        if (anchorElement) {
            const rect = anchorElement.getBoundingClientRect();
            const minSidePadding = 12;
            const maxLeft = window.innerWidth - minSidePadding;
            const desiredLeft = rect.left + rect.width / 2;
            const clampedLeft = Math.min(Math.max(desiredLeft, minSidePadding), maxLeft);
            const desiredTop = rect.top - 10;
            const clampedTop = Math.max(desiredTop, 10);

            toast.style.left = `${clampedLeft}px`;
            toast.style.top = `${clampedTop}px`;
        }

        toast.classList.add('is-visible');

        if (toastTimer) {
            clearTimeout(toastTimer);
        }

        toastTimer = window.setTimeout(() => {
            toast.classList.remove('is-visible');
        }, 1400);
    }

    copyButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const email = button.getAttribute('data-copy-email');

            if (!email) {
                return;
            }

            try {
                await copyText(email);
                showToast('Copied', button);
            } catch (error) {
                showToast('Copy failed', button);
            }
        });
    });
})();
