document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.button button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;

            if (answer.classList.contains('visible')) {
                answer.classList.remove('visible');
            } else {
                document.querySelectorAll('.answer').forEach(ans => ans.classList.remove('visible'));
                answer.classList.add('visible');
            }
        });
    });
});
