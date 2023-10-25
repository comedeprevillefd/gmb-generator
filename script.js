document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.buttons button');
    const resultDiv = document.querySelector('.result');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonId = button.id;
            let promptText = '';

            switch (buttonId) {
                case 'standard':
                    promptText = "Tu es un client de l'entreprise Four Data. Génère un avis positif court sur ses solutions de télémétrie et son service client. Tu auras un ton sobre, concis et professionnel.";
                    break;
                case 'professionnel':
                    promptText = "Tu es un client de l'entreprise Four Data. Génère un avis positif court sur ses solutions de télémétrie et son service client. Tu auras un ton très sobre, austère, efficace et professionnel.";
                    break;
                case 'enjoue':
                    promptText = "Tu es un client de l'entreprise Four Data. Génère un court avis positif sur ses solutions de télémétrie et son service client avec un ton enjoué.";
                    break;
                case 'fan':
                    promptText = "Tu es un client fan de l'entreprise Four Data. Génère un avis positif court sur ses solutions de télémétrie et son service client sur un ton très enthousiaste et familier !";
                    break;
            }

            // Supprime le paragraphe existant
            while (resultDiv.firstChild) {
                resultDiv.removeChild(resultDiv.firstChild);
            }

            // Ajoute un élément de chargement
            const loaderDiv = document.createElement('div');
            loaderDiv.classList.add('loader');
            loaderDiv.innerHTML = `
                <span class="loader__element"></span>
                <span class="loader__element"></span>
                <span class="loader__element"></span>
            `;
            resultDiv.appendChild(loaderDiv);

            fetch('https://n8n.fourdata.io/webhook/avis-gmb-four-data', {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // Ajoutez d'autres entêtes si nécessaire
                },
                body: `prompt=${encodeURIComponent(promptText)}`,
            })
            .then(response => response.json())
            .then(data => {
                // Supprime le contenu de la div .result
                while (resultDiv.firstChild) {
                    resultDiv.removeChild(resultDiv.firstChild);
                }

                // Crée un nouveau paragraphe avec le résultat de l'API
                const newParagraph = document.createElement('p');
                newParagraph.textContent = data.text;

                // Ajoute le nouveau paragraphe à la div .result
                resultDiv.appendChild(newParagraph);

                // Ajoute un bouton "copy" après le paragraphe du résultat
                const copyButton = document.createElement('button');
                copyButton.classList.add('copy');
                copyButton.textContent = 'Copier';
                resultDiv.appendChild(copyButton);
            })
            .catch(error => {
                console.error(error);
            });
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const resultDiv = document.querySelector('.result');

    resultDiv.addEventListener('click', function(event) {
        if (event.target.classList.contains('copy')) {
            const paragraph = resultDiv.querySelector('p');
            if (paragraph) {
                const textToCopy = paragraph.textContent;

                // Désactive le bouton pendant le traitement
                event.target.disabled = true;

                // Copie le texte dans le presse-papiers
                copyTextToClipboard(textToCopy);

                // Modifie le texte du bouton en "✓ Copié !" et applique un style
                event.target.textContent = "✓ Copié !";
                event.target.style.boxShadow = "inset 5px 5px 10px #bababa, inset -5px -5px 10px #ffffff";

                // Réinitialise le texte du bouton après 2 secondes
                setTimeout(function() {
                    event.target.textContent = "Copier";
                    event.target.style.boxShadow = "5px 5px 10px #bababa, -5px -5px 10px #ffffff";
                    event.target.disabled = false; // Réactive le bouton
                }, 2000);
            }
        }
    });

    function copyTextToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
});
