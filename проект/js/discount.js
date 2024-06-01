document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.block').forEach((block) => {
        block.style.display = 'none';
    });

    const buttons = document.querySelectorAll('.buttons button');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const blockId = button.id.replace('btn', 'block');
            document.querySelectorAll('.block').forEach((block) => {
                block.style.display = 'none';
            });
            document.getElementById(blockId).style.display = 'block';
        });
    });
});
