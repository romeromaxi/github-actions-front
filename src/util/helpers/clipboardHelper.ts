
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
    }

    try {
        const ta = document.createElement('textarea');
        ta.value = text;

        // Evita scroll y que se vea
        ta.style.position = 'fixed';
        ta.style.top = '0';
        ta.style.left = '-9999px';
        ta.style.opacity = '0';

        document.body.appendChild(ta);
        ta.focus();
        ta.select();

        const ok = document.execCommand('copy');
        document.body.removeChild(ta);

        return ok;
    } catch {
        return false;
    }
};